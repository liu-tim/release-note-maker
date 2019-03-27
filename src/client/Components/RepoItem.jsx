import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export default class RepoItem extends Component {
  handleClick = () => {
    const { repo } = this.props;
    this.props.onItemClick(repo);
  }

  render() {
    const { repo } = this.props;
    const { name } = repo;
    return (
      <ListItem button onClick={this.handleClick}>
        <ListItemText primary={name} />
      </ListItem>
    );
  }
}
