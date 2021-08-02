import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ProjectInput from './dataEntry/projectInput';
import PropTypes from 'prop-types';
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

    render = () => {
        return (
            <div className="timerComponent">
                <form onSubmit={this.submitForm}>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{ width: "20%" }}>
                                    <ProjectInput changeHandler={this.changeHandler} />
                                </td>
                                <td>
                                    {this.props.activeTimer ?
                                        <Button className="tempButton" style={{ backgroundColor: "red" }} onClick={this.props.stopTimer} >Stop</Button> :
                                        <Button className="tempButton" style={{ backgroundColor: "4CAF50" }} onClick={this.props.startTimer}>Start</Button>
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
                                    <input type="submit" onSubmit={this.submitForm} value="Submit" />
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
