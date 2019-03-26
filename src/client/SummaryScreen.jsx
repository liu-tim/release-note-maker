import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown'
import Header from './Header';

// eslint-disable-next-line react/prefer-stateless-function
export default class SummaryScreen extends Component {
  constructor(props) {
    super(props);
  }
  
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
        <ReactMarkdown source={body} />,
      </div>
    )
  }
}
