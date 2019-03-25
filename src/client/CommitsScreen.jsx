import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CommitItem from './CommitItem';
import SummaryScreen from './SummaryScreen';

export default class CommitsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      commits: null,
      selectedCommits: new Set(),
      releaseSummary: null,
    };
    this.handleToggleCommit = this.handleToggleCommit.bind(this);
    this.handleCreateRelease = this.handleCreateRelease.bind(this);
    this.goBack = this.goBack.bind(this);
    this.clearReleaseSummary = this.clearReleaseSummary.bind(this);
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
    })
      .then(res => res.json())
      .then(releaseSummary => this.setState(releaseSummary));
  }

  goBack() {
    this.props.clearRepoSelection();
  }

  clearReleaseSummary() {
    this.setState({releaseSummary: null});
  }

  render() {
    const { repo } = this.props;
    const { name } = repo;
    const { commits, releaseSummary } = this.state;
    let screen;

    screen = (
      <div>
        <Button onClick={this.goBack}> GoBack </Button>
        {commits ? commits.map(commit => <CommitItem commit={commit.commit} handleCommitToggle={this.handleToggleCommit} />) : <div>You have no commits</div>}
        <div>
          <Button variant="outlined" onClick={this.handleCreateRelease}> Generate Release </Button>
        </div>
      </div>
    )
       
    if (releaseSummary) {
      screen = <SummaryScreen  summary={releaseSummary} clearReleaseSummary={this.clearReleaseSummary}/>
    }
    return (
      <div>
        Repo: {name} 
        {screen}
     </div>
    );
  }
}
