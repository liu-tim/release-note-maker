import React, { Component } from 'react';

// eslint-disable-next-line react/prefer-stateless-function
export default class SummaryScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('props', this.props);
    const { summary } = this.props;
    const { body, tag_name } = summary;
    return (
      <div>
        Tag Name: {tag_name}
        <div style={{whiteSpace: 'pre-wrap'}}>{body}</div>
      </div>
    )
  }
}
