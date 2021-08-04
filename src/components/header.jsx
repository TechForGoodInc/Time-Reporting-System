import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import "./styles.css";

class Header extends Component {

    render() {
        return (
            <div id="page-wrap">
                <Button variant="danger" style={{ float: 'right' }} onClick={() => this.props.openModal(true)}>Report / Suggest</Button>{' '}
                <h4 id="title">TFG Time Reporting System</h4>
                <h6>{this.props.email}</h6>
            </div>
        );
    }
}

export default Header;