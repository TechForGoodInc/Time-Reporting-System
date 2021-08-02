import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';

import ProjectInput from './dataEntry/projectInput';
import TextInput from './dataEntry/textInput';
import entryData from './dataEntry/entryData.js';

class TimerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTimer: props.activeTimer,
            startTimer: null,
            stopTimer: null,
            postData: null,
            hours: 0,
            description: null,
            project: "unselected",
            show: false
        }
    }

    submitForm = (event) => {
        event.preventDefault();

        if (this.props.activeTimer) {
            alert("Please stop the active timer");
            return;
        }
        if (this.state.project === "unselected") {
            alert("Please select a project");
            return;
        }
        if (!this.state.description || this.state.description === " ") {
            alert("Please enter a description");
            return;
        }
        if (this.state.description.length < 6) {
            alert("Please enter a more descriptive description");
            return;
        }

        let now = new Date();
        let formattedDate = "";
        let day = now.getDate();
        let month = now.getMonth() + 1;
        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        formattedDate = now.getFullYear() + "-" + month + "-" + day;

        var data = new entryData(formattedDate, this.props.hoursWorked, this.state.description, this.state.project);

        this.props.postData(data);

        //this.setState({ description: null });
        //this.setState({ project: "unselected" });
    }

    changeHandler = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    togglePopup = () => {
        this.setState({ show: !this.state.show });
    }

    render = () => {
        return (
            <div className="timerComponent">
                {this.state.show &&
                    <div className='popup-window'>
                    <div className='popup-box'>
                        <h4 style={{ marginBottom: '20px' }}>Are you sure you want to stop the timer?</h4>
                        <Button variant='secondary' style={{ float: 'left', display: 'inline-block', width: '44%', marginInline: '3%'}} onClick={this.togglePopup}>Cancel</Button>
                        <Button variant='danger' style={{ float: 'right', display: 'inline-block', width: '44%', marginInline: '3%' }} onClick={() => { this.togglePopup(); this.props.stopTimer() }}>Stop Timer</Button>
                        </div>
                    </div>
                }
                <form onSubmit={this.submitForm}>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{ width: "20%" }}>
                                    <ProjectInput changeHandler={this.changeHandler} />
                                </td>
                                <td>
                                    {this.props.activeTimer ?
                                        <Button variant='danger' onClick={this.togglePopup} >Stop</Button> :
                                        //If the timer was started and is now stopped, we show nothing. Otherwise, the timer isn't started so we show the start button
                                        this.props.stopTime.length <= 1 && <Button variant='success' onClick={this.props.startTimer}>Start</Button>
                                    }
                                    {/*<Button className='tempButton' style={{ backgroundColor: 'red' }} onClick={removeTimer} >Delete</Button>*/}
                                </td>
                                <td style={{ width: "65%" }}>
                                    <TextInput changeHandler={this.changeHandler} />
                                </td>
                                <td style={{ width: "5%" }}>
                                    <div>{(this.props.startTime).substr(2)}</div>
                                </td>
                                <td style={{ width: "5%" }}>
                                    <div>{(this.props.stopTime).substr(2)}</div>
                                </td>
                                <td style={{ width: "5%" }}>
                                    <div>{this.props.hoursWorked}</div>
                                </td>
                                <td>
                                    <Button variant='success' type='submit' onSubmit={this.submitForm}>Submit</Button>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
            )
    }
}

TimerComponent.propTypes = {
    activeTimer: PropTypes.bool,
    startTimer: PropTypes.func.isRequired,
    stopTimer: PropTypes.func.isRequired,
    postData: PropTypes.func.isRequired,
}

export default TimerComponent
