import React, { Component } from 'react';

class DeleteBtn extends Component {

    render() {
        return (
            <React.Fragment>
                <button id={'deleteBtn'} onClick={(e) => { this.props.deleteEntry(e) }} style={{ float: 'right', color: 'white', background: 'red' }}>Delete Entry</button>
            </React.Fragment>
        );
    }
}

export default DeleteBtn;