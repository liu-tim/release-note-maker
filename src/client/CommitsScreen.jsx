import React, { Component } from 'react';
import CommitItem from './CommitItem';
import Button from '@material-ui/core/Button';

export default class CommitsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      commits: null,
      selectedCommits: new Set()
    };
    this.handleToggleCommit = this.handleToggleCommit.bind(this);
    this.handleCreateRelease = this.handleCreateRelease.bind(this);
  }

  componentDidMount() {
    const { repo } = this.props;
    const { name } = repo;
    fetch(`/api/get_repo_commits?repo=${name}`)
      .then(res => res.json())
      .then(commits => this.setState(commits));
  }

  handleToggleCommit(commit) {
    console.log('hastogglecommit', commit);
    if (this.state.selectedCommits.has(commit)) {
      this.state.selectedCommits.delete(commit);
    } else {
      this.state.selectedCommits.add(commit);
    }
  }

  handleCreateRelease() {
    const { selectedCommits } = this.state;
    const { repo } = this.props;
    const { name } = repo;
    
    let reqBody = '';
    selectedCommits.forEach((commit) => {
      console.log(commit);
      console.log(commit.message);
      reqBody += `${commit.message}\n`;
    });

    fetch(`/api/create_release?repo=${name}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // to do check if stringify is necesary
      body: JSON.stringify({
        reqBody,
      })
    });
  }

  render() {
    const { repo } = this.props;
    const { name } = repo;
    const { commits } = this.state;
    let commitItems;

    if (commits) {
      commitItems = commits.map(commit => <CommitItem commit={commit.commit} handleCommitToggle={this.handleToggleCommit} />);
    }
    return (
      <div>
        Repo: {name} 
        {commitItems}
        <div>
          <Button onClick={this.handleCreateRelease}> Generate Release </Button>
        </div>
      </div>
    );
  }
}
