import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import Fuse from 'fuse.js';
import RepoItem from './RepoItem';
import CommitsScreen from './CommitsScreen'

export default class ReposScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      repos: null, selectedRepo: null, searchQuery: undefined, searchedRepos: null,
    };
    this.selectRepo = this.selectRepo.bind(this);
    this.handleSearchQuery = this.handleSearchQuery.bind(this);
    this.clearRepoSelection = this.clearRepoSelection.bind(this);
  }

  componentDidMount() {
    fetch('/api/get_repos')
      .then(res => res.json())
      .then(repos => this.setState(repos));
  }

  selectRepo(selectedRepo) {
    this.setState({ selectedRepo });
  }

  clearRepoSelection() {
    this.setState({selectedRepo: null });
  }

  handleSearchQuery(event) {
    const searchQuery = event.target.value;


    let options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "name",
      ]
    };
    console.log('repos', this.state.repos)
    const fuse = new Fuse(this.state.repos, options);
    const searchedRepos = fuse.search(searchQuery);
    console.log(searchedRepos)
    this.setState({searchedRepos});
  }

  render() {
    const { repos, selectedRepo, searchQuery, searchedRepos } = this.state;
    console.log('searchedRepos', searchedRepos)
    let screen;
    if (selectedRepo) {
      screen = <CommitsScreen repo = {selectedRepo} clearRepoSelection={this.clearRepoSelection}/>;
    } else if (!repos) {
      screen = <div>LOADING</div>;
    } else {
      // Display all repos if there are no searched repos
      const displayedRepos = searchedRepos || repos;
      console.log('displayedREpos', displayedRepos)
      screen = (
        <div>
          <Input value={searchQuery} onChange={this.handleSearchQuery}>Search Repo</Input>
          <h1>List of your repos: </h1>
          {displayedRepos ? displayedRepos.map(repo => <RepoItem onItemClick={this.selectRepo} repo={repo} />) : <div> You have no repos</div>}
        </div>
      )
    }
    return (
      <div>
        {screen}
      </div>
    );
  }
}
