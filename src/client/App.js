import React, { Component } from 'react';
import './app.css';
import RepoItem from './RepoItem';
import CommitsScreen from './CommitsScreen';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: null, user: null, repos: null, selectedRepo: null
    };
    this.selectRepo = this.selectRepo.bind(this);
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

  selectRepo(selectedRepo) {
    this.setState({ selectedRepo });
  }

  render() {
    const { username, user, repos, selectedRepo } = this.state;
    let screen;
    const loaded = repos && user;
    let listItems;
    if (loaded) {
      listItems = repos.map(repo => <RepoItem onItemClick={this.selectRepo} repo={repo} />);
      if (selectedRepo) {
        screen = <div> <CommitsScreen repo = {selectedRepo} /> </div>;
      } else {
        screen = listItems;
      }
    }
    console.log('state', this.state);
    return (
      <div>
        {user ? <h1>{`Logged In as ${user}`}</h1> : <a id="login-button" href="/api/login">Log In With GitHub</a>}
        {screen}
        {/* {selectedRepo && <div>{selectedRepo.name}</div>} */}
        {/* {username ? <h1>{`Hellos ${username}`}</h1> : <h1>Loading.. please wait!</h1>} */}
        {/* <body /> */}
        {/* <img src={ReactImage} alt="react" /> */}
      </div>
    );
  }
}
