import React, { Component } from 'react';

class HistoryBtn extends Component {

    render() {
        return (
            <React.Fragment>
                <button onClick={this.props.handleHistory} style={{ float: 'left', color: 'white', background: 'red' }}>View History</button>
            </React.Fragment>
        );
    }
}

export default HistoryBtn;