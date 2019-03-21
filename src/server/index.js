const express = require('express');
const os = require('os');
const session = require('express-session');
const request = require('request');
const qs = require('querystring');
const path = require('path');
const url = require('url');
const randomString = require('randomstring');

require('dotenv').config();

const app = express();
const isDev = process.env.NODE_ENV === 'development';
const clientId = isDev ? process.env.DEV_CLIENT_ID : process.env.PROD_CLIENT_ID;
const clientSecret = isDev ? process.env.DEV_CLIENT_SECRET : process.env.PROD_CLIENT_SECRET;
const redirectUri = `${isDev ? process.env.DEV_HOST : process.env.PROD_HOST}/redirect`;

console.log('isDev', isDev);


// app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

// const redirect_uri = process.env.HOST + '/redirect';

app.use(express.static('dist'));

app.use(
  session({
    secret: randomString.generate(),
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

app.get('/', (req, res, next) => {

  // res.sendFile(__dirname + '/index.html');
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));
  // res.sendFile(__dirname + '/index.html');
});

app.get('/api/login', (req, res, next) => {
  req.session.csrf_string = randomString.generate();
  const githubAuthUrl =
    'https://github.com/login/oauth/authorize?' +
    qs.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      state: req.session.csrf_string,
      scope: 'user:email'
    });
    console.log('githubURL', githubAuthUrl);
  res.redirect(githubAuthUrl);
});

app.all('/redirect', (req, res) => {
  const { code } = req.query;
  const returnedState = req.query.state;
  if (req.session.csrf_string === returnedState) {
    request.post(
      {
        url:
          'https://github.com/login/oauth/access_token?' +
          qs.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri,
            state: req.session.csrf_string
          })
      },
      (error, response, body) => {
        console.log("redirect@@@@@@@@@@", body);
        req.session.access_token = qs.parse(body).access_token;
        res.redirect('/user');
      }
    );
  } else {
    res.redirect('/');
  }
});

app.get('/user', (req, res) => {
  // request.get(
  //   {
  //     url: 'https://api.github.com/user',
  //     headers: {
  //       Authorization: 'token ' + req.session.access_token,
  //       'User-Agent': 'Login-App'
  //     }
  //   },
  //   (error, response, body) => {
  //     res.send(
  //       "<p>You're logged in! Here's all your repos on GitHub: </p>" +
  //         body +
  //         '<p>Go back to <a href="./">log in page</a>.</p>'
  //     );
  //   }
  // );
  console.log("TOKEN", req.session.access_token);
  // request.get(
  //   {
  //     url: 'https://api.github.com/user/repos',
  //     headers: {
  //       Authorization: 'token ' + req.session.access_token,
  //       'User-Agent': 'Login-App'
  //     }
  //   },
  //   (error, response, body) => {
  //     console.log(error);
  //     // console.log(body);
  //     // console.log(error, response, body);
  //     res.send(
  //       "<p>You're logged in! Here's all your repos on GitHub: </p>" +
  //         body +
  //         '<p>Go back to <a href="./">log in page</a>.</p>'
  //     );
  //   }
  // );
  request.get(
    {
      url: 'https://api.github.com/repos/liu-tim/stratosnap_dji_naza_interface/commits',
      headers: {
        Authorization: 'token ' + req.session.access_token,
        'User-Agent': 'Login-App'
      }
    },
    (error, response, body) => {

      // console.log("BODY", body);
      // console.log(error, response, body);
      // res.send(
      //   "<p>You're logged in! Here's all your repos on GitHub: </p>" +
      //     body +
      //     '<p>Go aa back to a aaa <a href="./">log in page</a>.</p>'
      // );
      if (isDev) {
        // HACK (liu-tim): problem with two servers running force to redirect to web-pack-dev port
        res.redirect('http://localhost:3000');
      } else {
        res.redirect('/');
      }
    }
  );

});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));