import PropTypes from 'prop-types';
import ProjectInput from './dataEntry/projectInput';

function TimerComponent({ firebase, currentUser, startTime, stopTime, postData, date, hours, description, project, state }) {

    const startNewTimer = async (e) => {

        e.preventDefault();

        let db = firebase.firestore();
        db.collection('timers').doc(currentUser.email).collection('timer').doc('time').get().then((doc) => {
            if (doc.exists) {

                if (!doc.data().Time) {
                    let db = firebase.firestore();
                    let newDate = new Date();
                    let now = newDate.getDay() + ':' + newDate.getHours() + ':' + newDate.getMinutes();
                    db.collection('timers').doc(currentUser.email).collection('timer').doc('time').set({ Time: now });
                    startTime = now;
                    document.getElementById('input-startTime').value = now.substr(2);
                    alert("Timer started!");
                } else {
                    startTime = doc.data().Time.toString();
                    var time = startTime.split(':');
                    var displayTime = time[1] + ':' + time[2];
                    document.getElementById('input-startTime').value = displayTime;
                    alert("User has active timer.");
                }
            } else {
                let db = firebase.firestore();
                let newDate = new Date();
                let now = newDate.getDay() + ':' + newDate.getHours() + ':' + newDate.getMinutes();
                db.collection('timers').doc(currentUser.email).collection('timer').doc('time').set({ Time: now });
                startTime = now;
                document.getElementById('input-startTime').value = now.substr(2);
                alert("Timer started!");
            }
        })
    }

    function stopCurrentTimer(e) {
        e.preventDefault();

        let db = firebase.firestore();
        db.collection('timers').doc(currentUser.email).collection('timer').doc('time').get().then((doc) => {
            if (doc.exists) {
                let newDate = new Date();
                let now = newDate.getDay() + ':' + newDate.getHours() + ':' + newDate.getMinutes();
                stopTime = now;
                startTime = doc.data().Time.toString();
                document.getElementById('input_stopTime').value = getFormattedTimeString(newDate).substr(2);

                let startTimer = startTime.split(':');
                let displayStartTime = startTimer[1] + ':' + startTimer[2];
                document.getElementById('input-startTime').value = displayStartTime;

                //document.getElementById('input_hoursWorked').value = calculateHoursWorked();
                hours = calculateHoursWorked();
            } else {
                alert("No active timer.");
            }
        })
    }

    //Delete saved start time from db
    function removeTimer() {
        let db = firebase.firestore();

        db.collection('timers').doc(currentUser.email).collection('timer').doc('time').delete().then(() => {
            startTime = "-";
            stopTime = "-";
            document.getElementById('input-startTime').value = startTime;
            document.getElementById('input-stopTime').value = stopTime;
        }).catch((error) => {
            console.error("Error deleting: ", error);
        })
    }

    function submitTimerData(e) {
        e.preventDefault();
        //TODO: Create EntryData object for passing data to App.js.post_data
        date = new Date();

        //postData(state); - not working
        removeTimer();
    }

    function calculateHoursWorked() {
        let newDate = new Date();
        let now = getFormattedTimeString(newDate);
        console.log(now);
        if (newDate.getDay() !== startTime[0]) {
            //Timer is more than 1 day, or new day has begun, user needs to enter time manually.
            return;
        }
        let currentTime = now.split(':');
        let currentHours = currentTime[1];
        let currentMinutes = currentTime[2];

        let beginningTime = startTime.split(':');
        let startHours = beginningTime[1];
        let startMinutes = beginningTime[2];

        let totalHours = (parseInt(currentHours) - parseInt(startHours));
        let totalMinutes = 0;
        if (parseInt(currentMinutes) < parseInt(startMinutes)) {
            let extraMinutes = 60 - parseInt(startMinutes);
            totalMinutes = parseInt(currentMinutes) + extraMinutes;
        } else {
            totalMinutes = parseInt(currentMinutes) - parseInt(startMinutes);
        }
        let totalTime = totalHours + ':' + totalMinutes;

        return totalTime;
    }

    function getFormattedTimeString(date) {
        let day = date.getDay()
        let hours = date.getHours();
        let minutes = date.getMinutes();
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        return day + ':' + hours + ':' + minutes;
    }

    function changeHandler(event) {
        event.target.name = event.target.value;
        console.log(event.target.name + ':' + event.target.value);
    }

    return (

        <div className='timerComponent'>
            <form onSubmit={submitTimerData} >
                <table>
                    <tbody>
                        <tr>
                            <td style={{ width: '20%' }} >
                                <ProjectInput changeHandler={changeHandler} />
                            </td>
                            <td>
                                <button onClick={startNewTimer} >Start</button>
                            </td>
                            <td style={{ width: '48%' }} >
                                <input type='text' id='description' name='description' placeholder='Enter description of work completed' onChange={changeHandler} required />
                            </td>
                            <td>
                                <input type='text' id='input-startTime' readOnly />
                            </td>
                            <td>
                                <input type='text' id='input_stopTime' readOnly />
                            </td>
                            <td>
                                <input type='text' id='hours' name='hours' readOnly onChange={changeHandler} />
                            </td>
                            <td>
                                <input type='submit' onSubmit={submitTimerData} value='Submit' />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}

TimerComponent.propTypes = {
    firebase: PropTypes.object.isRequired,
    startTime: PropTypes.string,
    stopTime: PropTypes.string,
    postData: PropTypes.func.isRequired,
}

TimerComponent.defaultProps = {
    startTime: '-',
    stopTime: '-',
    date: null,
    hours: null,
    description: null,
    project: null,
}

export default TimerComponent