const randomString = require('randomstring');
const qs = require('querystring');
const request = require('request');


/*
    Get Client_ID and Client Secret from .env file
*/
const isDev = process.env.NODE_ENV === 'development';
const clientId = isDev ? process.env.DEV_CLIENT_ID : process.env.PROD_CLIENT_ID;
const clientSecret = isDev ? process.env.DEV_CLIENT_SECRET : process.env.PROD_CLIENT_SECRET;
const redirectUri = `${isDev ? process.env.DEV_HOST : process.env.PROD_HOST}/redirect`;

/*
    Redirect the user user to Github login for authorization
*/
exports.login = (req, res) => {
  req.session.csrf_string = randomString.generate();
  const githubAuthUrl = `https://github.com/login/oauth/authorize?${
    qs.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      state: req.session.csrf_string,
      // app requires read and write access to repos
      scope: 'repo'
    })}`;
  res.redirect(githubAuthUrl);
}

/*
    Called by Github to send a code parameter
    Send request to Github for access_token
    Store access_token in express session
    Send request to Github for user data, store user data
    Finally, redirect to homepage
*/
exports.redirect = (req, res) => {
  const { code } = req.query;
  const returnedState = req.query.state;
  if (req.session.csrf_string === returnedState) {
    // request for access_token
    request.post(
      {
        url:
          `https://github.com/login/oauth/access_token?${
            qs.stringify({
              client_id: clientId,
              client_secret: clientSecret,
              code,
              redirect_uri: redirectUri,
              state: req.session.csrf_string
            })}`
      },
      (error, response, body) => {
        req.session.access_token = qs.parse(body).access_token;
        // request for user data
        request.get(
          {
            url: 'https://api.github.com/user',
            headers: {
              Authorization: `token ${req.session.access_token}`,
              'User-Agent': 'Login-App'
            }
          },
          (error, response, body) => {
            const jsonData = JSON.parse(body);
            req.session.user = jsonData.login;
            if (isDev) {
              // HACK (liu-tim): problem with two servers running force to redirect to web-pack-dev port
              res.redirect('http://localhost:3000');
            } else {
              res.redirect('/');
            }
          }
        );
      }
    );
  } else {
    res.redirect('/');
  }
}