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

        var data = new entryData(formattedDate, this.props.hoursWorked.toFixed(2).toString(), this.state.description, this.state.project);

        this.props.postData(data);
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

    formatTime(d) {
        let arr = d.split(':');
        let newArr = [];
        if (d[0] !== '-') {
            for (let i = 0; i < arr.length; ++i) {
                if (d[i] !== '-')
                    newArr.push(arr[i].length === 1 ? '0'.concat(arr[i]) : arr[i]);
            }
            return newArr[0] + ':' + newArr[1] + ':' + newArr[2];
        }

        return d;
    }

    getNotStartedTimerBar() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td>
                            <Button variant='success' onClick={this.props.startTimer}>Start Timer</Button>
                        </td>
                        <td>
                            <div style={{marginLeft: '20px', fontSize: '25px'}}>
                                00:00:00
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    getStartedTimerBar() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td>
                            <Button variant='danger' onClick={this.togglePopup} >Stop Timer</Button>
                        </td>
                        <td>
                            <div style={{ marginLeft: '20px', fontSize: '25px' }}>
                                {this.formatTime(this.state.time.hours + ':' + this.state.time.minutes + ':' + this.state.time.seconds)}
                            </div>
                            
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    getStoppedTimerBar() {
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td style={{ width: '1%', paddingRight: '5px' }}>
                                <ProjectInput changeHandler={this.changeHandler} />
                            </td>
                            <td style={{ paddingLeft: '5px' }}>
                                <TextInput changeHandler={this.changeHandler} />
                            </td>
                            {this.props.screenWidth > 800 &&
                                <td width='1%'>
                                    <table width='200px'>
                                        <tbody>
                                            <tr>
                                                <th style={{ color: 'green', textAlign: 'center', width: '500px' }}>Start</th>
                                                <th style={{ color: 'green', textAlign: 'center', marginInline: '5px' }}>Stop</th>
                                                <th style={{ color: 'green', textAlign: 'center', marginInline: '5px' }}>Hours</th>
                                            </tr>
                                            <tr>
                                                <td style={{ width: "33.3%", textAlign: 'center' }}>
                                                    <p>{this.formatTime(this.props.startTime).substring(3)}</p>
                                                </td>
                                                <td style={{ width: "33.3%", textAlign: 'center' }}>
                                                    <p>{this.formatTime(this.props.stopTime).substring(3)}</p>
                                                </td>
                                                <td style={{ width: "33.3%", textAlign: 'center' }}>
                                                    <p>{this.props.hoursWorked.toFixed(2)}</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            }
                        </tr>
                    </tbody>
                </table>

                {this.props.screenWidth <= 800 &&
                    <table width='200px' align='center'>
                        <tbody>
                            <tr>
                                <th style={{ color: 'green', textAlign: 'center', width: '500px' }}>Start</th>
                                <th style={{ color: 'green', textAlign: 'center', marginInline: '5px' }}>Stop</th>
                                <th style={{ color: 'green', textAlign: 'center', marginInline: '5px' }}>Hours</th>
                            </tr>
                            <tr>
                                <td style={{ width: "33.3%", textAlign: 'center' }}>
                                    <p>{this.formatTime(this.props.startTime).substring(3)}</p>
                                </td>
                                <td style={{ width: "33.3%", textAlign: 'center' }}>
                                    <p>{this.formatTime(this.props.stopTime).substring(3)}</p>
                                </td>
                                <td style={{ width: "33.3%", textAlign: 'center' }}>
                                    <p>{this.props.hoursWorked.toFixed(2)}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                }

                <div>
                    <Button variant='secondary' style={{ width: '100px', marginInline: '10px' }} onClick={() => {
                        this.props.removeTimer();
                        clearInterval(this.intervalID);
                        this.setState({ submitting: false });
                    }}
                    >Delete</Button>
                    <Button variant='success' type='submit' style={{ width: '100px', float: 'right', marginInline: '10px' }} onClick={() => { this.setState({ submitting: false }); }}>Submit</Button>
                </div>
            </div>
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
        stad.setHours(split[1], split[2], split[3]);

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
                    {this.props.activeTimer ?
                        startedTimerBar :
                        this.props.stopTime.length <= 1 ?
                            notStartedTimerBar : stoppedTimerBar
                    }
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
