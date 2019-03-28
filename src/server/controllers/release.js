const request = require('request');
const utils = require('../utils');
const semver = require('semver');

/*
  Receives repo name from post request
  Get request to Github for latest release
  Increment previous version number using semver bump
  Post request to Github for creating repo release using generated body from commit messages
*/
exports.createRelease = (req, res) => {
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
      const tagName = jsonData.length ? jsonData[0].tag_name : undefined;
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
};
