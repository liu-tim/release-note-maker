const router = require('express').Router();

const user = require('../controllers/user');
const repos = require('../controllers/repos');
const auth = require('../controllers/auth');
const commits = require('../controllers/commits');
const release = require('../controllers/release');


router.get('/api/get_user', user.getUser);

router.get('/api/login', auth.login);

router.get('/redirect', auth.redirect);

router.get('/api/get_repos', repos.getReposList);

router.get('/api/get_repo_commits', commits.getCommitsFromRepo);

router.post('/api/create_release', release.createRelease);
module.exports = router;
