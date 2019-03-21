import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import RepoItem from './RepoItem'

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: null, user: null, repos: null, selectedRepo: null
    };
    this.selectRepo = this.selectRepo.bind(this);
  }
  
  selectRepo(selectedRepo) {
    this.setState({ selectedRepo })
  }

  componentDidMount() {
    // TODO: don't make unncessary calls on load here?
    fetch('/api/get_user')
      .then(res => res.json())
      .then(a => this.setState({ user: a.user }));

    fetch('/api/get_repos')
      .then(res => res.json())
      .then(a => this.setState({ repos: a.repos }));

    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    console.log('state', this.state);
    const { username, user, repos, selectedRepo } = this.state;
    let listItems;
    if (repos) {
      listItems = repos.map(repo => <RepoItem onItemClick={this.selectRepo} repo={repo} />);
    }
    return (
      <div>
        {}
        {selectedRepo && <div>{selectedRepo.name}</div>}
        {username ? <h1>{`Hellos ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
        {user ? <h1>{`Logged In as ${user}`}</h1> : <a id="login-button" href="/api/login">Log In With GitHub</a>}
        <body />
        {listItems}
        <img src={ReactImage} alt="react" />
      </div>
    );
  }
}
