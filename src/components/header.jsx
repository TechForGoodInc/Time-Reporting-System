import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';

import FeedbackModal from './FeedbackModal';

class Header extends Component {

    render = () => {
        return (
            <div style={{ marginBottom: '20px' }}>
                <FeedbackModal firebase={this.props.firebase} user={this.props.user} buttonStyle={{ float: 'right' }} />
                {this.props.isSupervisor &&
                    <div>
                        <NavLink to="/supervisortools"><Button variant='warning' style={{ float: 'right', marginInline: '10px' }} >Supervisor tools</Button></NavLink>
                        <NavLink to="/"><Button variant='success' style={{ float: 'right' }} to='/supervisortools' >Log hours page</Button></NavLink>
                    </div>
                }
                <div>
                    <h4 id="title">TFG Time Reporting System</h4>
                    <h6>{this.props.email}</h6>
                </div>
            </div>
        );
    }
}

export default Header;