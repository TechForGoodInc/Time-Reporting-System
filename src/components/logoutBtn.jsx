import React, { Component } from 'react';

class LogoutBtn extends Component {

    //Get button and add listener to prevent page refresh on logout
    componentDidMount() {
        document.getElementById('logoutBtn').addEventListener('click', btn => {
            btn.preventDefault();
        });
    }

    //Remove previously added listener - just in case button is disabled in future
    componentWillUnmount() {
        document.getElementById('logoutBtn').removeEventListener('click', btn => {
            btn.preventDefault();
        });
    }

    render() {
        return (
            <React.Fragment>
                <button id={'logoutBtn'} onClick={this.props.handleLogout} style={{ float: 'right', color: 'white', background: 'red' }}>Log out</button>
            </React.Fragment>
        );
    }
}

export default LogoutBtn;