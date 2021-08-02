import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';

import DateInput from './dataEntry/dateInput';
import NumInput from './dataEntry/numInput';
import ProjectInput from './dataEntry/projectInput';
import TextInput from './dataEntry/textInput';
import entryData from './dataEntry/entryData.js';

class ManualEntry extends Component {
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

        let descString = this.state.description;
        console.log(descString);

        if (descString === " " || descString == null) {
            alert("Please enter a description");
            return;
        } else if (descString.length <= 6) { //6 is an arbitrary number; 'worked' is 6 letters.
            alert("Please enter a more expressive description");
            return;
        } else {
            let data = new entryData(this.state.date, this.state.hours.toString(), this.state.description, this.state.project);
            this.props.post_data(data);

            //this.props.post_data(this.state);  - OLD
        }
    }

    render() {
        return (
            <div>
                <form id='hourEntryForm' onSubmit={this.handleSubmit}>
                    <DateInput changeHandler={this.changeHandler} />
                    <br />
                    <br />
                    <NumInput minimum={0} maximum={14} changeHandler={this.changeHandler} />
                    <br />
                    <br />
                    <TextInput changeHandler={this.changeHandler} />
                    <br />
                    <br />
                    <ProjectInput changeHandler={this.changeHandler} />

                    <Button variant='success' type='submit' style={{ marginTop: '20px', width: '100%' }}>Submit</Button>
                </form>
            </div>
        );
    }
}

export default ManualEntry;