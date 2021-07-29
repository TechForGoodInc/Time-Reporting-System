import React, { Component } from 'react';
//import LogoutBtn from './logoutBtn';

class Header extends Component {
    render() {
        return (
            <div>
                {/*<LogoutBtn handleLogout={(e) => { this.props.handleLogout(e) }}/> Disabled until fixed */}
                <h4 id="title">TFG Time Reporting System</h4>
                <h6>{this.props.email}</h6>
            </div>
        );
    }
}

export default Header;