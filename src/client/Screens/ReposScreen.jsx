import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import Fuse from 'fuse.js';
import List from '@material-ui/core/List';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';

import RepoItem from '../Components/RepoItem';
import CommitsScreen from './CommitsScreen';
import Header from '../Common/Header';
import '../app.css';

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
    this.setState({ selectedRepo: null, searchedRepos: null });
  }

  handleSearchQuery(event) {
    const { repos } = this.state;
    const searchQuery = event.target.value;
    const options = {
      threshold: 0.3,
      minMatchCharLength: 1,
      keys: [
        'name',
      ]
    };
    const fuse = new Fuse(repos, options);
    const searchedRepos = fuse.search(searchQuery);
    this.setState({ searchedRepos });
  }

  render() {
    const {
      repos, selectedRepo, searchQuery, searchedRepos
    } = this.state;
    let screen;
    if (selectedRepo) {
      screen = <CommitsScreen repo={selectedRepo} clearRepoSelection={this.clearRepoSelection} />;
    } else if (!repos) {
      screen = <div>LOADING</div>;
    } else {
      // Display all repos if there are no searched repos
      const displayedRepos = (searchedRepos && searchedRepos.length) ? searchedRepos : repos;
      screen = (
        <div>
          <Header title="Your repos: " />
          <Input
            value={searchQuery}
            onChange={this.handleSearchQuery}
            endAdornment={(
              <InputAdornment position="end">
                <Icon>search</Icon>
              </InputAdornment>
             )}
          />
          {displayedRepos ? (
            <List>
              {displayedRepos.map(repo => <RepoItem onItemClick={this.selectRepo} repo={repo} />) }
            </List>
          ) : <div> No repos</div>}
        </div>
      );
    }
    return (
      <div className="screen">
        {screen}
      </div>
    );
  }
}
