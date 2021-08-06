import React, { Component } from 'react';

class NumInput extends Component {

    render() {
        return (
            <React.Fragment>
                <input type="number" id="hours" name="hours" style={{ verticalAlign: 'middle', width: '50px' }} placeholder="8" min={this.props.minimum} max={this.props.maximum} required onChange={this.props.changeHandler} step="0.01" />
            </React.Fragment>
        );
    }
}

export default NumInput;