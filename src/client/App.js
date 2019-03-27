import React, { Component } from 'react';
import './app.css';
import Button from '@material-ui/core/Button';
import ReposScreen from './Screens/ReposScreen';
import logo from '../../public/github.png';

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
        {user ? (
          <ReposScreen />
        ) : (
          <div className="login">
            <h1>Release Note Maker</h1>
            <div><img src={logo} /></div>
            <Button id="login-button" href="/api/login">
              <img className="login-logo" src={logo} />
              Log In With GitHub
            </Button>
          </div>
        )}
      </div>
    );
  }
}
