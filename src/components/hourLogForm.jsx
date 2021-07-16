import React, { Component } from 'react';

import DateInput from './DataEntry/dateInput';
import NumInput from './DataEntry/numInput';
import ProjectInput from './DataEntry/projectInput';
import TextInput from './DataEntry/textInput';

class HourLogForm extends Component {
    //State of the form
    state = {
        date: null,
        hours: null,
        description: null,
        project: 'unselected'
    }

    //Sets the state every time the form is changed
    changeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    //Submits form to App
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.project === 'unselected') {
            alert("Please select a project");
            return;
        }
        this.props.post_data(this.state);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <DateInput changeHandler={this.changeHandler} />
                    <br />
                    <br />
                    <NumInput minimum={1} maximum={12} changeHandler={this.changeHandler} />
                    <br />
                    <br />
                    <TextInput changeHandler={this.changeHandler} />
                    <br />
                    <br />
                    <ProjectInput changeHandler={this.changeHandler} />

                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default HourLogForm;