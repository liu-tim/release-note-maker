import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import CommitItem from '../Components/CommitItem';
import SummaryScreen from './SummaryScreen';
import Header from '../Common/Header'

export default class CommitsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      commitsSelectedMap: new Map(),
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
      .then((commitsData) => {
        const {commits} = commitsData;
        if (commits) {
          const map = new Map(commits.map(commit => [commit, false]));
          this.setState({commitsSelectedMap: map})
        }
      });
  }

  handleToggleCommit(commit) {
    const {commitsSelectedMap} = this.state;
    // toggle value of commit key 
    commitsSelectedMap.set(commit, !commitsSelectedMap.get(commit));
    this.setState(commitsSelectedMap);
  }

  handleCreateRelease() {
    const { commitsSelectedMap } = this.state;
    const { repo } = this.props;
    const { name } = repo;

    const selectedCommits = [];
    commitsSelectedMap.forEach((isSelected, commit) => {
      if (isSelected) {
        selectedCommits.push(commit);
      }
    });

    fetch(`/api/create_release?repo=${name}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({selectedCommits}),
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
    const { commitsSelectedMap, releaseSummary } = this.state;
    let screen;

    screen = (
      <div>
        <Header onBackClick={this.goBack} title={`${name} Commit Log`} />
        {commitsSelectedMap.size ? (
          <List>
            {[...commitsSelectedMap.keys()]
              .map(commit => (
                <CommitItem
                  commit={commit} 
                  handleCommitToggle={this.handleToggleCommit} 
                  isSelected={commitsSelectedMap.get(commit)}/>
              ))}
          </List>
        ) : <div>You have no commits</div>}
        <div>
          <Button variant="outlined" onClick={this.handleCreateRelease}> Generate Release </Button>
        </div>
      </div>
    );
       
    if (releaseSummary) {
      screen = <SummaryScreen summary={releaseSummary} clearReleaseSummary={this.clearReleaseSummary}/>
    }
    return (
      <div>
        {screen}
     </div>
    );
  }
}
