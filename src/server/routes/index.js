const qs = require('querystring');
const randomString = require('randomstring');
const semver = require('semver');
const router = require('express').Router();
const request = require('request');
const utils = require('../utils');
/*
    Get Client_ID and Client Secret from .env file
*/
const isDev = process.env.NODE_ENV === 'development';
const clientId = isDev ? process.env.DEV_CLIENT_ID : process.env.PROD_CLIENT_ID;
const clientSecret = isDev ? process.env.DEV_CLIENT_SECRET : process.env.PROD_CLIENT_SECRET;
const redirectUri = `${isDev ? process.env.DEV_HOST : process.env.PROD_HOST}/redirect`;


router.get('/api/get_user', (req, res) => {
  res.send({ user: req.session.user });
});

router.get('/api/login', (req, res, next) => {
  req.session.csrf_string = randomString.generate();
  const githubAuthUrl = `https://github.com/login/oauth/authorize?${
    qs.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      state: req.session.csrf_string,
      scope: 'repo'
    })}`;
  res.redirect(githubAuthUrl);
});

router.get('/redirect', (req, res) => {
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
});

router.get('/api/get_repos', (req, res) => {
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
      res.send({ repos: jsonData });
    }
  );
});

router.get('/api/get_repo_commits', (req, res) => {
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
        res.send({ commits: jsonData });
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
  Post request to Github for creating repo release using generated body from commits
*/
router.post('/api/create_release', (req, res) => {
  const { repo } = req.query;
  const { selectedCommits } = req.body;
  const mostRecentSelectedSHA = selectedCommits[0].commit.message.sha;

  const reqBody = utils.generateRequestBody(selectedCommits);

  request.get(
    {
      url: `https://api.github.com/repos/${req.session.user}/${repo}/releases`,
      headers: {
        Authorization: `token ${req.session.access_token}`,
        'User-Agent': 'Login-App'
      }
    },
    (error, response, body) => {
      const jsonData = JSON.parse(body);
      // get most recent release by RELEASE DATE
      const tagName = jsonData[0].tag_name;
      // Assume all major releases set release to 1.0.0 no earlier releases
      const newTagName = tagName ? semver.inc(tagName, 'major') : '1.0.0';
      request.post(
        {
          url: `https://api.github.com/repos/${req.session.user}/${repo}/releases`,
          headers: {
            Authorization: `token ${req.session.access_token}`,
            'User-Agent': 'Login-App'
          },
          body: JSON.stringify({ tag_name: newTagName, body: reqBody, target_commitish: mostRecentSelectedSHA })
        },
        (error, response, body) => {
          const jsonData = JSON.parse(body);
          res.send({ releaseSummary: jsonData });
        }
      );
    }
  );
});
module.exports = router;
