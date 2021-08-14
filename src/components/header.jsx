import React, { Component } from 'react';

import FeedbackModal from './FeedbackModal';

class Header extends Component {

    render = () => {
        return (
            <div style={{ marginBottom: '20px' }}>
                <FeedbackModal firebase={this.props.firebase} user={this.props.user} buttonStyle={{ float: 'right' }} />
                <div style={{ textAlign: 'center' }}>
                    <h4 id="title">TFG Time Reporting System</h4>
                    <h6>{this.props.email}</h6>
                </div>
            </div>
        );
    }
}

export default Header;