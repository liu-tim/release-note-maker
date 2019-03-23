import React, { Component } from 'react';

export default class CommitItem extends Component {
  state = {
    isSelected: false,
  }

  toggleCommit = () => {
    const { commit, handleCommitToggle } = this.props;
    this.setState(({ isSelected }) => (
      {
        isSelected: !isSelected,
      }
    ));
    handleCommitToggle(commit);
  }

  render() {
    const { commit } = this.props;
    const { isSelected } = this.state;
    const { message } = commit;
    return (
      <div>
        <input type="checkbox" checked={isSelected} onChange={this.toggleCommit} value={message} />
        {message}
      </div>
    );
  }
}