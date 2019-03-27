import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown'
import Header from './Header';

export default class SummaryScreen extends Component {
  goBack = () => {
    this.props.clearReleaseSummary();
  }

  render() {
    const { summary } = this.props;
    const { body, tag_name } = summary;
    return (
      <div>
        <Header onBackClick={this.goBack} title={'Summary'} />
        Tag Name: {tag_name}
        <ReactMarkdown source={body} />
      </div>
    );
  }
}
