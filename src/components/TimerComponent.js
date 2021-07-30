import Button from 'react-bootstrap/Button';
import ProjectInput from './dataEntry/projectInput';
import PropTypes from 'prop-types';

function TimerComponent(props) {

    function submitTimerData(e) {
        e.preventDefault();
        //props.postData();
    }

    function changeHandler(event) {
        event.target.name = event.target.value;
    }

    return (

        <div className="timerComponent">
            <form onSubmit={submitTimerData}>
                <table>
                    <tbody>
                        <tr>
                            <td style={{ width: "20%" }}>
                                <ProjectInput changeHandler={changeHandler} />
                            </td>
                            <td>
                                {props.activeTimer ?
                                    <Button className="tempButton" style={{ backgroundColor: "red" }} >Stop</Button> :
                                    <Button className="tempButton" style={{ backgroundColor: "4CAF50" }}>Start</Button>
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
        
        )

}

TimerComponent.propTypes = {
    activeTimer: PropTypes.bool.isRequired,
    startTimer: PropTypes.func.isRequired,
    stopTimer: PropTypes.func.isRequired,
    postData: PropTypes.func.isRequired,
}

export default TimerComponent;