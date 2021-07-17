import React, { Component } from 'react';

class LogoutBtn extends Component {

    render() {
        return (
            <React.Fragment>
                <button id={'logoutBtn'} onClick={(e) => { this.props.handleLogout(e) }} style={{ float: 'right', color: 'white', background: 'red' }}>Log out</button>
            </React.Fragment>
        );
    }
}

export default LogoutBtn;