import React, { Component } from 'react';
import LogoutBtn from './logoutBtn';

class Header extends Component {
    render() {
        return (
            <div>
                {/*<LogoutBtn handleLogout={(e) => { this.props.handleLogout(e) }}/> Disabled until fixed */}
                <h3 id="title">TFG Time Reporting System - {this.props.email}</h3>
            </div>
        );
    }
}

export default Header;