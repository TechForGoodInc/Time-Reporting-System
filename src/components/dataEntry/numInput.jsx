import React, { Component } from 'react';

class NumInput extends Component {

    render() {
        return (
            <React.Fragment>
                <input type="number" id="hours" name="hours" style={{ verticalAlign: 'middle', width: '60px' }} placeholder="8" defaultValue={this.props.defaultValue} min={this.props.minimum ? this.props.minimum : 0} max={this.props.maximum ? this.props.maximum : 12} required onChange={this.props.changeHandler} step="0.01" />
            </React.Fragment>
        );
    }
}

export default NumInput;