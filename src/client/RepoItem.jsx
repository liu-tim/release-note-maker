import React, { Component } from 'react';

export default class RepoItem extends Component {
  handleClick = () => {
    const { repo } = this.props;
    this.props.onItemClick(repo);
  }

  render() {
    const { repo } = this.props;
    const { name } = repo;
    return (
      <li onClick={this.handleClick}>
        {name}
      </li>
    );
  }
}