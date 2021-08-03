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
            description: null,
            project: "unselected",
            showPopup: false,
            startTimeAsDate: null,
            submitting: false,
            time: {
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0
            }
        }
    }

    componentDidMount = () => {
        
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

        var data = new entryData(formattedDate, this.props.hoursWorked.toString(), this.state.description, this.state.project);

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
        this.setState({ showPopup: !this.state.showPopup });
    }

    getNotStartedTimerBar() {
        return (
            <tbody>
                <tr>
                    <td>
                        <Button variant='success' onClick={this.props.startTimer}>Start Timer</Button>
                    </td>
                    <td>
                        00:00:00
                    </td>
                </tr>
            </tbody>
        )
    }

    getStartedTimerBar() {
        return (
            <tbody>
                <tr>
                    <td>
                        <Button variant='danger' onClick={this.togglePopup} >Stop Timer</Button>
                    </td>
                    <td>
                        {this.state.time.hours}:{this.state.time.minutes}:{this.state.time.seconds}
                    </td>
                </tr>
            </tbody>
        )
    }

    getStoppedTimerBar() {
        return (
            <tbody>
                <tr>
                    <th></th>
                    <th></th>
                    <th style={{ textAlign: 'center' }}>Started</th>
                    <th style={{ textAlign: 'center' }}>Stopped</th>
                    <th style={{ textAlign: 'center' }}>Hours</th>
                </tr>
                <tr>
                    <td style={{ width: "20%" }}>
                        <ProjectInput changeHandler={this.changeHandler} />
                    </td>
                    <td style={{ width: "70%" }}>
                        <TextInput changeHandler={this.changeHandler} />
                    </td>
                    <td style={{ width: "5%", textAlign: 'center' }}>
                        <p>{(this.props.startTime)}</p>
                    </td>
                    <td style={{ width: "5%", textAlign: 'center' }}>
                        <p>{(this.props.stopTime)}</p>
                    </td>
                    <td style={{ width: "5%", textAlign: 'center' }}>
                        <p>{this.props.hoursWorked}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <Button variant='secondary' onClick={() => {
                            this.props.removeTimer();
                            clearInterval(this.intervalID);
                            this.setState({ submitting: false });
                        }}>Delete this entry</Button>
                        <Button variant='success' type='submit' onClick={() => { this.setState({ submitting: false }); }}>Submit</Button>
                    </td>
                </tr>
            </tbody>
        )
    }

    msToTime(duration) {
        let milliseconds = parseInt((duration % 1000));
        let seconds = Math.floor((duration / 1000) % 60);
        let minutes = Math.floor((duration / (1000 * 60)) % 60);
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');
        milliseconds = milliseconds.toString().padStart(3, '0');

        return {
            hours,
            minutes,
            seconds,
            milliseconds
        };
    }

    run() {
        const diff = Date.now() - this.state.startTimeAsDate;
        this.setState(() => ({
        time: this.msToTime(diff)
    }));
    }

    startClock = () => {
        console.log('start time =', this.props.startTime)
        let stad = new Date();
        let split = this.props.startTime.split(':');
        let splitInt = [];
        for (const e of split) splitInt.push(parseInt(e));
        //stad.setHours(splitInt[1], splitInt[2], 0);
        stad.setHours(split[1], split[2], 0);

        this.setState({ startTimeAsDate: stad });
        this.intervalID = setInterval(() => this.run(), 1000);
    }

    stopTimer = () => {
        this.togglePopup();
        this.props.stopTimer();
        this.setState({ submitting: true });

        let temp = this.intervalID;
        clearInterval(temp);
        this.intervalID = null;
    }

    componentDidUpdate = () => {
        console.log(!this.intervalID, this.props.activeTimer, this.props.startTime.length > 1, !this.state.submitting)
        if (!this.intervalID && this.props.activeTimer && this.props.startTime.length > 1 && !this.state.submitting) {
            this.startClock();
        }
    }

    render = () => {
        const startedTimerBar = this.getStartedTimerBar(); //When the timer is started and user is not ready to submit
        const notStartedTimerBar = this.getNotStartedTimerBar(); //When the timer has not been started
        const stoppedTimerBar = this.getStoppedTimerBar(); //When the timer is stopped and user is going to submit

        

        return (
            <div className="timerComponent">
                {this.state.showPopup &&
                    <div className='popup-window'>
                    <div className='popup-box'>
                        <h4 style={{ marginBottom: '20px' }}>Are you sure you want to stop the timer?</h4>
                        <Button variant='secondary' style={{ float: 'left', display: 'inline-block', width: '44%', marginInline: '3%'}} onClick={this.togglePopup}>Cancel</Button>
                        <Button variant='danger' style={{ float: 'right', display: 'inline-block', width: '44%', marginInline: '3%' }} onClick={this.stopTimer}>Stop Timer</Button>
                        </div>
                    </div>
                }
                <form onSubmit={this.submitForm}>
                    <table>
                        {this.props.activeTimer ?
                            startedTimerBar :
                            this.props.stopTime.length <= 1 ?
                                notStartedTimerBar : stoppedTimerBar
                        }
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
