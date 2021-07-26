import PropTypes from 'prop-types';

function TimerComponent({ firebase, currentUser, startTime, stopTime }) {

    const startNewTimer = async (e) => {
        
        e.preventDefault();

        let db = firebase.firestore();
        db.collection('timers').doc(currentUser.email).collection('timer').doc('time').get().then((doc) => {
            if (doc.exists) {

                if (!doc.data().Time) {
                    let db = firebase.firestore();
                    var date = new Date();
                    var now = date.getDay() + ':' + date.getHours() + ':' + date.getMinutes();
                    var timerDoc = db.collection('timers').doc(currentUser.email).collection('timer').doc('time').set({ Time: now });
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
                var date = new Date();
                var now = date.getDay() + ':' + date.getHours() + ':' + date.getMinutes();
                var timerDoc = db.collection('timers').doc(currentUser.email).collection('timer').doc('time').set({ Time: now });
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
                var date = new Date();
                var now = date.getDay() + ':' + date.getHours() + ':' + date.getMinutes();
                stopTime = now;
                startTime = doc.data().Time.toString();
                document.getElementById('input_stopTime').value = getFormattedTimeString(date).substr(2);

                var startTimer = startTime.split(':');
                var displayStartTime = startTimer[1] + ':' + startTimer[2];
                document.getElementById('input-startTime').value = displayStartTime;

                document.getElementById('input_hoursWorked').value = calculateHoursWorked();
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

    function submitTimerData() {
        //TODO: send data to App.js.post_data
        removeTimer();
    }

    function calculateHoursWorked() {
        var date = new Date();
        var now = getFormattedTimeString(date);
        console.log(now);
        if (date.getDay() != startTime[0]) {
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
                            <input type='text' id='input-startTime' readOnly />
                        </td>
                        <td>
                            <input type='text' id='input_stopTime' readOnly />
                        </td>
                        <td>
                            <input type='text' id='input_hoursWorked' readOnly />
                        </td>
                        <td>
                            <button onClick={startNewTimer} >Start</button>
                        </td>
                        <td>
                            <button onClick={stopCurrentTimer} >Stop</button>
                        </td>
                        <td>
                            <input type='submit' onSubmit={submitTimerData} value='Submit' />
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
}

TimerComponent.defaultProps = {
    startTime: '-',
    stopTime: '-',
}

export default TimerComponent