import React from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from 'react-router-dom';

export default props => {
    return (
        <Menu {...props}>
            <nav>
                <ul className="nav-links">
                    <Link className='menu-item' to="/">
                        <li>Log Hours</li>
                    </Link>
                    <Link className='menu-item' to="settings">
                        <li>Settings</li>
                    </Link>
                    <Link className='menu-item' to="/calendar">
                        <li>Calendar</li>
                    </Link>
                </ul>
            </nav>

        </Menu>
    );
};
