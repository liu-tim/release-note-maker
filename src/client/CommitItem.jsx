import React, { Component } from 'react';

export default class CommitItem extends Component {
  handleClick = () => {
    console.log(this.props)
    const { commit } = this.props;
    this.props.onItemClick(commit);
  }

  render() {
    const { commit } = this.props;
    const { message } = commit;
    return (
      <li onClick={this.handleClick}>
        {message}
      </li>
    );
  }
}