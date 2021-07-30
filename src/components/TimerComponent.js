import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ProjectInput from './dataEntry/projectInput';
import PropTypes from 'prop-types';
import TextInput from './dataEntry/textInput';

class TimerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTimer: props.activeTimer,
            startTimer: null,
            stopTimer: null,
            postData: null,
            date: null,
            hours: 0,
            description: null,
            project: "unselected",
        }
    }

    submitForm(event) {
        event.preventDefault();

        //TODO: postData
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
                                <td style={{ width: "48%" }}>
                                    <TextInput changeHandler={this.changeHandler} />
                                </td>
                                <td>
                                    <input type="text" id="inputStartTime" changeHandler={this.changeHandler} readOnly />
                                </td>
                                <td>
                                    <input type="text" id="inputStopTime" changeHandler={this.changeHandler} readOnly />
                                </td>
                                <td>
                                    <input type="text" id="inputHoursWorked" changeHandler={this.changeHandler} readOnly />
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
