const request = require('request');

/*
    Gets list of all commits in repo(specified in query parameter)
*/

exports.getCommitsFromRepo = (req, res) => {
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
};
