import React, { Component } from 'react';

class DateInput extends Component {

    render() {
        return (
            <React.Fragment>
                <input type="date" id="date" name="date" defaultValue={new Date().toISOString().substr(0, 10)}
                    placeholder="(MM/DD/YY)" required pattern="\d{4}-\d{2}-\d{2}" onChange={this.props.changeHandler} />
            </React.Fragment>
        );
    }
}

export default DateInput;