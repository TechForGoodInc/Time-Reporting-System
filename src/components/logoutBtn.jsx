import React, { Component } from 'react';

class LogoutBtn extends Component {

    render() {
        return (
            <React.Fragment>
                <button onClick={this.props.handleLogout} style={{ float: 'right', color: 'white', background: 'red' }}>Log out</button>
            </React.Fragment>
        );
    }
}

export default LogoutBtn;