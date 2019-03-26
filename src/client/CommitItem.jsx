import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox'

export default class CommitItem extends Component {
  toggleCommit = () => {
    const { commit, handleCommitToggle } = this.props;
    handleCommitToggle(commit);
  }

  render() {
    const { commit, isSelected } = this.props;
    const { message } = commit.commit;
    return (
      <div>
        <Checkbox checked={isSelected} onChange={this.toggleCommit} value={message} />
        {message}
      </div>
    );
  }
}