import React, { Component } from 'react';

class DateInput extends Component {

    render() {
        return (
            <React.Fragment>
                <label htmlFor="date">Date (MM/DD/YY)</label>
                <input type="date" id="date" name="date" placeholder="(MM/DD/YY)" required pattern="\d{4}-\d{2}-\d{2}" onChange={this.props.changeHandler} />
                <span className="validity"></span>
            </React.Fragment>
        );
    }
}

export default DateInput;