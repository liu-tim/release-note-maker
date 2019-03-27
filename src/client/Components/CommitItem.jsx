import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Moment from 'moment';

export default class CommitItem extends Component {
  toggleCommit = () => {
    const { commit, handleCommitToggle } = this.props;
    handleCommitToggle(commit);
  }

  render() {
    const { commit, isSelected } = this.props;
    const { message, author } = commit.commit;
    const { name, date } = author;
    const fromNowText = Moment(date).fromNow();
    const secondaryText = `${name} committed ${fromNowText}`;

    return (
      <ListItem>
        <Checkbox checked={isSelected} onChange={this.toggleCommit} value={message} />
        <ListItemText primary={message} secondary={secondaryText} />
      </ListItem>
    );
  }
}
