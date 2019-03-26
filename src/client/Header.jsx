import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import logo from '../../public/github.png';
import './app.css';

const Header = (props) => {
  const {onBackClick, title} = props;
  return (
    <div>
      <div className="header-title-container">
        <div>
          <img src={logo}/>
        </div> 
        <h1 className="header-title">Release Note Maker</h1>
      </div>
      {onBackClick &&<Button variant="outlined" onClick={onBackClick}> Back</Button>}
      <h2>{title}</h2>
    </div>
  );
}

export default Header;
