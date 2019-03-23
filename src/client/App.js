import React, { Component } from 'react';
import './app.css';
import ReposScreen from './ReposScreen';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    // TODO: don't make unncessary calls on load here?
    fetch('/api/get_user')
      .then(res => res.json())
      .then(a => this.setState({ user: a.user }));
  }

  render() {
    const { user } = this.state;
    // let screen;
    // // TODO:
    // if (!user) {
    //   screen = loginScreen;
    // } else if (user && !selectedRepo) {
    //   screen = reposScreen
    // } else if (authenticated &&reposelected) {
    //   const commitsScreen = 
    //   screen = commitsScreen
    // } else {
    //   // screen = Loading
    // }
    // // if (loaded) {
    //   listItems = repos.map(repo => <RepoItem onItemClick={this.selectRepo} repo={repo} />);
    //   if (selectedRepo) {
    //     screen = <div> <CommitsScreen repo = {selectedRepo} /> </div>;
    //   } else {
    //     screen = listItems;
    //   }
    // }
    // console.log('state', this.state);
    return (
      <div>
        {user ? <ReposScreen/> : <a id="login-button" href="/api/login">Log In With GitHub</a>}
      </div>
    );
  }
}
