import React from "react";
import { slide as Menu } from "react-burger-menu";

export default props => {
  return (
    <Menu {...props}>
      <a className="menu-item" href="https://techforgoodinc.org/">
        <center>
          <img src='https://techforgoodinc.org/images/TechForGood_Logo.png' width='100' height='50'></img>
        </center>
      </a>
      
      <a className="menu-item">
        <p style={{ color: '#373a47' }}>----</p>
      </a>

      <a className="menu-item" href="/">
        <p style={{ color: '#A8F0B7', textAlign:'center', backgroundColor:'#595969' }}><b>Home</b></p>
      </a>

      <a className="menu-item" href="/...">
        <p style={{ color: '#77CB88', textAlign: 'center', backgroundColor:'#595969' }}>Activity</p>
      </a>

      <a className="menu-item" href="/...">
        <p style={{ color: '#77CB88', textAlign: 'center', backgroundColor:'#595969' }}>Calendar</p>
      </a>

      <a className="menu-item" href="/...">
        <p style= {{ color: '#77CB88', textAlign: 'center', backgroundColor:'#595969' }}><b>Logout</b></p>
      </a>

    </Menu>
  );
};
