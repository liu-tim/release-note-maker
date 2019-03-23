import React, { Component } from 'react';
import RepoItem from './RepoItem';
import CommitsScreen from './CommitsScreen'

export default class ReposScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      repos: null, selectedRepo: null,
    };
    this.selectRepo = this.selectRepo.bind(this);
  }

  componentDidMount() {
    fetch('/api/get_repos')
      .then(res => res.json())
      .then(a => this.setState({ repos: a.repos }));
  }

  selectRepo(selectedRepo) {
    this.setState({ selectedRepo });
  }

  render() {
    const { repos, selectedRepo } = this.state;
    let screen;
    if (selectedRepo) {
      screen = <CommitsScreen repo = {selectedRepo}/>;
    } else if (!repos) {
      screen = <div>LOADING</div> 
    } else {
      screen = repos.map(repo => <RepoItem onItemClick={this.selectRepo} repo={repo} />);
    }
    return (
      <div>
        {screen}
      </div>
    );
  }
}