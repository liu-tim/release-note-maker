import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';

export default class App extends Component {
  state = { username: null, user: null };

  componentDidMount() {
    fetch('/api/get_user')
      .then(res => res.json())
      .then(a => this.setState({ user: a.user }));


    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
    console.log('state', this.state);
    
  }

  render() {
    const { username, user } = this.state;
    console.log('USER', user);
    
    return (
      <div>
        {username ? <h1>{`Hellos ${username}`}</h1> : <h1>Loading.. please wait!</h1>}

        {user ? <h1>{`Logged In as ${user}`}</h1> : <a id="login-button" href="/api/login">Log In With GitHub</a>}
        <body />
        <img src={ReactImage} alt="react" />
      </div>
    );
  }
}
