import PropTypes from 'prop-types';

function TimerComponent({ firebase, currentUser, startTime, stopTime, hoursWorked, description }) {

    start();

    //Run this on initialization
    function start() {
        let db = firebase.firestore();
        let currentEntry = db.collection('timers').doc(currentUser.email).collection('timer').doc('time').get().then((doc) => {
            if (doc.exists) {
                startTime = doc.data().Time.toString();
                //document.getElementById('input_startTime').value = startTime.toString();
            } else {
                startTime = "-";
            }
        })
    }

    function startNewTimer() {
        var date = new Date();
        var now = date.getDay() + ':' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        let db = firebase.firestore();
        var timerDoc = db.collection('timers').doc(currentUser.email).collection('timer').doc('time').set({ Time: now });
        startTime = now;

        console.log("Activate Timer: " + now);
    }

    function stopCurrentTimer() {

    }

    //Get saved start time from db
    function getCurrentStartTime() {
        let db = firebase.firestore();
        let currentEntry = db.collection('timers').doc(currentUser.email).collection('timer').doc('time').get().then((doc) => {
            if (doc.exists) {
                var time = doc.data().Time;
                startTime = time;

                return time;
            }
        }).catch((error) => {
            console.error("Error reading database: ", error);
        })
    }

    //Delete saved start time from db
    function removeTimer() {
        let db = firebase.firestore();
        db.collection('timers').doc(currentUser.email).collection('timer').doc('time').delete().then(() => {
            startTime = "";
        }).catch((error) => {
            console.error("Error deleting: ", error);
        })
    }

    function submitTimerData() {
        //Send data to App.js.post_data
    }

    const onStart = (e) => {
        e.preventDefault();
        startNewTimer();
    }

    const onStop = (e) => {
        e.preventDefault();
    }

    function calculateHoursWorked() {
        getCurrentStartTime();
        var date = new Date();
        var now = date.getDay() + ':' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        if (now[0] != startTime[0]) {
            //Timer is more than 1 day, or new day has begun, user needs to enter time manually.
            return;
        }
        var currentTime = now.split(':');
        var currentHours = currentTime[1];
        var currentMinutes = currentTime[2];
        var beginningTime = startTime.split(':');
        var startHours = beginningTime[1];
        var startMinutes = beginningTime[2];
        var hoursWorked = currentHours - startHours;
        var minutesWorked = currentMinutes - startMinutes;
        console.log(hoursWorked + ':' + minutesWorked);
        return hoursWorked + ':' + minutesWorked;
    }

    return (

        <div className='timerComponent'>
            <form onSubmit={submitTimerData} >
                <table>
                    <tr>
                        <td style={{ width: '20%' }} >
                            <select id='projectSelector'>
                                <option defaultValue='Select Project' hidden value='selectProject'>Select Project</option>
                                <option value='ossftgg'>OSSFTGG</option>
                                <option value='flant'>Flant</option>
                                <option value='iddps'>IDDPS</option>
                                <option value='other'>Other</option>
                            </select>
                        </td>
                        <td style={{ width: '50%' }} >
                            <input type='text' id='descInput' placeholder='Enter description of work completed' />
                        </td>
                        <td>
                            <input type='text' id='input-startTime' value={startTime} readOnly />
                        </td>
                        <td>
                            <input type='text' value={stopTime} readOnly />
                        </td>
                        <td>
                            <input type='text' value={hoursWorked} readOnly />
                        </td>
                        <td>
                            <button onClick={onStart} >Start</button>
                        </td>
                        <td>
                            <button onClick={onStop} >Stop</button>
                        </td>
                        <td>
                            <input type='submit' value='Submit' />
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    )
}

TimerComponent.propTypes = {
    firebase: PropTypes.object.isRequired,
    startTime: PropTypes.string,
    stopTime: PropTypes.string,
    hoursWorked: PropTypes.string,
    description: PropTypes.string,
}

TimerComponent.defaultProps = {
    startTime: '-',
    stopTime: '-',
    hoursWorked: '0',
    description: '',
}

export default TimerComponent