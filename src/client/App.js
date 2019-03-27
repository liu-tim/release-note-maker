import React, { Component } from 'react';
import './app.css';
import ReposScreen from './Screens/ReposScreen';
import LoginScreen from './Screens/LoginScreen';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    fetch('/api/get_user')
      .then(res => res.json())
      .then(user => this.setState(user));
  }

  render() {
    const { user } = this.state;
    return (
      <div>
        {user ? <ReposScreen /> : (<LoginScreen /> )}
      </div>
    );
  }
}
