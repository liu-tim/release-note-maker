const express = require('express');
const os = require('os');
const session = require('express-session');
const request = require('request');
const qs = require('querystring');
const path = require('path');
const url = require('url');
const randomString = require('randomstring');
const bodyParser = require('body-parser');
const semver = require('semver');

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
// support parsing of application/json type post data
app.use(bodyParser.json());
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

app.get('/api/get_user', (req, res) => {
  res.send({ user: req.session.user });
});

app.get('/api/get_repos', (req, res) => {
  res.send({ repos: req.session.repos });
});


app.get('/api/login', (req, res, next) => {
  req.session.csrf_string = randomString.generate();
  const githubAuthUrl =
    `https://github.com/login/oauth/authorize?${ 
      qs.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        state: req.session.csrf_string,
        scope: 'repo'
      })}`;
  res.redirect(githubAuthUrl);
});

app.get('/redirect', (req, res) => {
  const { code } = req.query;
  const returnedState = req.query.state;
  if (req.session.csrf_string === returnedState) {
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
        res.redirect('/fetch_user');
      }
    );
  } else {
    res.redirect('/');
  }
});

app.get('/fetch_user', (req, res) => {
  console.log("TOKEN", req.session.access_token);
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
      res.redirect('/fetch_repos');
    }
  );
});

app.get('/fetch_repos', (req, res) => {
  request.get(
    {
      url: 'https://api.github.com/user/repos?per_page=100',
      headers: {
        Authorization: `token ${req.session.access_token}`,
        'User-Agent': 'Login-App'
      }
    },
    (error, response, body) => {
      const jsonData = JSON.parse(body);
      JSON.parse(body);
      req.session.repos = jsonData;
      if (isDev) {
        // HACK (liu-tim): problem with two servers running force to redirect to web-pack-dev port
        res.redirect('http://localhost:3000');
      } else {
        res.redirect('/');
      }
    }
  );
});

app.get('/api/get_repo_commits', (req, res) => {
  const { repo } = req.query;
  request.get(
    {
      url: `https://api.github.com/repos/${req.session.user}/${repo}/commits`,
      headers: {
        Authorization: `token ${req.session.access_token}`,
        'User-Agent': 'Login-App'
      }
    },
    (error, response, body) => {
      // Check if there are commits for the repo
      const jsonData = JSON.parse(body);
      if (Array.isArray(jsonData)) {
        res.send({commits: jsonData});
      } else {
        res.send([]);
      }
    }
  );
});

/*
  Receives repo name from post request
  Get request to Github for latest repo release
  Increment version number using semver
  Post request to Github for creating repo release
*/
app.post('/api/create_release', (req, res) => {
  // req.checkBody('body', 'Body is required').notEmpty();
  const { repo } = req.query;
  const { reqBody } = req.body;
  request.get(
    {
      url: `https://api.github.com/repos/${req.session.user}/${repo}/releases/latest`,
      headers: {
        Authorization: `token ${req.session.access_token}`,
        'User-Agent': 'Login-App'
      }
    },
    (error, response, body) => {
      const jsonData = JSON.parse(body);
      const tagName = jsonData.tag_name;
      // Assume all major releases
      const newTagName = tagName ? semver.inc(tagName, 'major') : '1.0.0';
      request.post(
        {
          url: `https://api.github.com/repos/${req.session.user}/${repo}/releases`,
          headers: {
            Authorization: `token ${req.session.access_token}`,
            'User-Agent': 'Login-App'
          },
          body: JSON.stringify({ tag_name: newTagName, body: reqBody })
        },
        (error, response, body) => {
          const jsonData = JSON.parse(body);
          res.send({releaseSummary: jsonData});
        }
      );
    }
  );
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));