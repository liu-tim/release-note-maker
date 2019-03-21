import React, { Component } from 'react';

export default class CommitsScreen extends Component {

  render() {
    const { repo } = this.props;

    return (
      <div>{repo.name}</div>
      <li onClick={this.handleClick}>
        {name}
      </li>
    );
  }
}