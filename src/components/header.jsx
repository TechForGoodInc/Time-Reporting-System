import React, { Component } from 'react';
//import LogoutBtn from './logoutBtn';

import Button from 'react-bootstrap/Button';

class Header extends Component {
    render() {
        return (
            <div>
                {/*<LogoutBtn handleLogout={(e) => { this.props.handleLogout(e) }}/> Disabled until fixed */}
                <Button variant="danger" style={{float: 'right'}}>Report A Bug / Suggest A Feature</Button>{' '}
                <h4 id="title">TFG Time Reporting System</h4>
                <h6>{this.props.email}</h6>
            </div>
        );
    }
}

export default Header;