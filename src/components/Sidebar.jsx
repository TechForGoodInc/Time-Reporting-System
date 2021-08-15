import React, { Component } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from 'react-router-dom';

class Sidebar extends Component {

    render() {
        return (
            <Menu>
                <center>
                    <img src='https://techforgoodinc.org/images/TechForGood_Logo.png' width='100' height='50'></img>
                </center>
                <p style={{ color: '#373a47' }}>----</p>
                <nav>
                    <Link className='menu-item' to="/">
                        <p style={{ color: '#77CB88', textAlign: 'center', backgroundColor: '#595969' }}><b>Log Hours</b></p>
                    </Link>
                    <Link className='menu-item' to="settings">
                        <p style={{ color: '#77CB88', textAlign: 'center', backgroundColor: '#595969' }}><b>Settings</b></p>
                    </Link>
                    <Link className='menu-item' to="/calendar">
                        <p style={{ color: '#77CB88', textAlign: 'center', backgroundColor: '#595969' }}>Calendar</p>
                    </Link>
                    <Link className='menu-item' to="/...">
                        <p style={{ color: '#77CB88', textAlign: 'center', backgroundColor: '#595969' }}><b>Logout</b></p>
                    </Link>
                </nav>

            </Menu>
        );
    }
};

export default Sidebar;