import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CommitItem from './CommitItem';
import SummaryScreen from './SummaryScreen';

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
        const map = new Map(commits.map(commit => [commit, false]));
        this.setState({commitsSelectedMap: map})
      });
  }

  handleToggleCommit(commit) {
    const {commitsSelectedMap} = this.state;
    // toggle value of commit key 
    commitsSelectedMap.set(commit, !commitsSelectedMap.get(commit));
    this.setState(commitsSelectedMap);
  }

  handleCreateRelease() {
    const { selectedCommits, commitsSelectedMap } = this.state;
    const { repo } = this.props;
    const { name } = repo;

    let draft = {
      added: [],
      changed:[], 
      removed: [],
    }
    // look through commits and do basic classification for (Added, Changed, and Removed)
    // selectedCommits.forEach(commit) {

    let mostRecentSelectedCommit;
    let reqBody = '';
    debugger;
    commitsSelectedMap.forEach((isSelected, commit) => {
      if (isSelected) {
        // store first(most recent) commit for SHA code
        mostRecentSelectedCommit = mostRecentSelectedCommit || commit;
        const messageTitle = commit.commit.message.split('\n\n')[0];
        if (messageTitle.toLowerCase().search(/feature|add|new/) !== -1) {
        // add to "added"
          draft.added.push('- ' + messageTitle);
        } else if (messageTitle.toLowerCase().search(/change|fix|modif/) !== -1) {
          draft.changed.push('- ' + messageTitle);
        } else if (messageTitle.toLowerCase().search(/remove|delete|destroy/) !== -1) {
          draft.removed.push('- ' + messageTitle);
        }
      }
    });
    console.log('draft', draft);
    reqBody += '## Added\n';
    draft.added.forEach((added)=> {
      reqBody += `${added}\n`;
    });

    reqBody += '## Changed\n';
    draft.changed.forEach((change)=> {
      reqBody += `${change}\n`;
    });

    reqBody += '## Removed\n';
    draft.removed.forEach((change)=> {
      reqBody += `${change}\n`;
    });

    console.log('reqBody', reqBody)
    fetch(`/api/create_release?repo=${name}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target_commitish: mostRecentSelectedCommit.sha,
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
    const { commitsSelectedMap, releaseSummary } = this.state;
    let screen;

    screen = (
      <div>
        <Button onClick={this.goBack}> GoBack </Button>
        {commitsSelectedMap.size ? [...commitsSelectedMap.keys()].map(commit => <CommitItem commit={commit} handleCommitToggle={this.handleToggleCommit} isSelected = {commitsSelectedMap.get(commit)} />) : <div>You have no commits</div>}
        <div>
          <Button variant="outlined" onClick={this.handleCreateRelease}> Generate Release </Button>
        </div>
      </div>
    )
       
    if (releaseSummary) {
      screen = <SummaryScreen summary={releaseSummary} clearReleaseSummary={this.clearReleaseSummary}/>
    }
    return (
      <div>
        Repo: {name} Commit Log
        {screen}
     </div>
    );
  }
}
