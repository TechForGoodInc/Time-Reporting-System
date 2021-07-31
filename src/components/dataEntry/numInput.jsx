import React, { Component } from 'react';

class NumInput extends Component {

    render() {
        return (
            <React.Fragment>
                <label htmlFor="hours">Hours Worked (Numerical Form)</label>
                <input type="number" id="hours" name="hours" placeholder="8" min={this.props.minimum} max={this.props.maximum} required onChange={this.props.changeHandler} step="0.1" />
                <span className="validity"></span>
            </React.Fragment>
        );
    }
}

export default NumInput;