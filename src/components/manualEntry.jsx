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
        date: new Date().toISOString().substr(0, 10),
        hours: null,
        description: null,
        project: 'unselected',
        screenWidth: window.screen.width
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize() {
        this.setState({ screenWidth: window.innerWidth });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize.bind(this));
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

        if (descString === " " || descString == null) {
            alert("Please enter a description");
            return;
        } else if (descString.length <= 6) { //6 is an arbitrary number; 'worked' is 6 letters.
            alert("Please enter a more expressive description");
            return;
        } else {
            let data = new entryData(this.state.date, this.state.hours.toString(), this.state.description, this.state.project);
            this.props.post_data(data);
        }
    }

    render = () => {
        return (
            <form id='hourEntryForm' onSubmit={this.handleSubmit}>
                
                <table style={{ display: 'inline-block' }}>
                    <tbody>
                        <tr>

                            <td width='1%' style={{ paddingInline: '5px'}}>
                                <DateInput changeHandler={this.changeHandler} />
                            </td>
                            <td className='hour-entry-bar-small' width='100%'></td>
                            <td width='1%' style={{ paddingRight: '5px' }}>
                                <div>Hours:</div>
                            </td>
                            <td width='1%' style={{ paddingInline: '5px' }}>
                                <NumInput minimum={0} maximum={24} changeHandler={this.changeHandler} />
                            </td>
                            <td className='hour-entry-bar-large' style={{ width: '1%', paddingInline: '5px' }}>
                                {this.state.screenWidth > 700 && <ProjectInput changeHandler={this.changeHandler} />}
                            </td>
                            <td className='hour-entry-bar-large' width='100%' style={{ paddingInline: '5px' }}>
                                {this.state.screenWidth > 700 && <TextInput changeHandler={this.changeHandler} />}
                            </td>
                            <td className='hour-entry-bar-large' style={{ paddingLeft: '5px' }}>
                                <Button variant='success' type='submit' style={{ width: '100px', align: 'right' }}>Submit</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table className='hour-entry-bar-small'>
                    <tbody>
                        <tr>
                            <td className='hour-entry-bar-hide-first-row' style={{ width: '1%', paddingRight: '5px' }}>
                                {this.state.screenWidth <= 700 && <ProjectInput changeHandler={this.changeHandler} />}
                            </td>
                            <td className='hour-entry-bar-hide-first-row' width='100%' style={{ paddingLeft: '5px' }}>
                                {this.state.screenWidth <= 700 && <TextInput changeHandler={this.changeHandler} />}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className='hour-entry-bar-small' align='right'>
                    <Button variant='success' type='submit' style={{ width: '100%', align: 'right' }}>Submit</Button>
                </div>
            </form>
        )
    }
}






export default ManualEntry;