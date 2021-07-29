import React, { Component } from 'react';

class NumInput2 extends Component {

    render() {
        return (
            <React.Fragment>
                <label htmlFor="id">ID of Entry</label>
                <input type="number" id="id" name="id" placeholder="1" min={this.props.minimum} max={this.props.maximum} required onChange={this.props.changeHandler} />
                <span className="validity"></span>
            </React.Fragment>
        );
    }
}

export default NumInput2;