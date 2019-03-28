import React from 'react';
import Button from '@material-ui/core/Button';
import logo from '../../../public/github.png';
import '../app.css';

const LoginScreen = () => {
  return (
    <div className="login">
      <h1>Release Note Maker</h1>
      <div><img src={logo} /></div>
      <Button id="login-button" href="/api/login">
        <img className="login-logo" src={logo} />
        Log In With GitHub
      </Button>
    </div>
  );
};

export default LoginScreen;
