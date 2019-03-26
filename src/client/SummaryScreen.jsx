import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ReactMarkdown from 'react-markdown'

// eslint-disable-next-line react/prefer-stateless-function
export default class SummaryScreen extends Component {
  constructor(props) {
    super(props);
  }
  
  goBack = () => {
    this.props.clearReleaseSummary();
  }

  render() {
    console.log('props', this.props);
    const { summary } = this.props;
    const { body, tag_name } = summary;
    return (
      <div>
        <Button onClick={this.goBack}>Go Back</Button>
        Summary
        Tag Name: {tag_name}
        <ReactMarkdown source={body} />,
      </div>
    )
  }
}
