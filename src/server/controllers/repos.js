const request = require('request');

/*
    gets a list of public and private repos owned by the user
*/
exports.getReposList = (req, res) => {
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
};
