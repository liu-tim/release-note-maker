import React, { Component } from 'react';
import CommitItem from './CommitItem';

export default class CommitsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      commits: null,
      selectedCommit: null, 
    };
    this.selectCommit = this.selectCommit.bind(this);
  }

  componentDidMount() {
    const { repo } = this.props;
    const { name } = repo;
    fetch(`/api/get_repo_commits?repo=${name}`)
      .then(res => res.json())
      .then(commits => this.setState(commits));
  }

  selectCommit(selectedCommit) {
    console.log('selectedCOmmit', selectedCommit)
    this.setState({ selectedCommit });
  }

  render() {
    console.log('selectedCommit', this.state.selectedCommit);
    const { repo } = this.props;
    const { name } = repo;
    const { commits } = this.state;
    let commitItems;

    if (commits) {
      commitItems = commits.map(commit => <CommitItem commit={commit.commit} onItemClick={this.selectCommit} />);
    }
    return (
      <div>{commitItems}{name}</div>
    );
  }
}
