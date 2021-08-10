import './App.css';
import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './firebaseCfg.js'
import Header from './components/header';
import History from "./components/history";
import HourLogger from "./components/hourLogger";
import entryData from './components/dataEntry/entryData.js';

firebase.initializeApp(firebaseConfig);

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            formInfo: null,
            activeTimer: null,
            startTime: "-",
            stopTime: "-",
            hoursWorked: 0,
            screenWidth: window.innerWidth
        }
    }

    componentDidMount() {
        document.title = 'Time Reporting System';

        //For when window is resized
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        //Signs user in if they are not already signed in
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user });
                console.log(user.email);
                var domain = user.email.split('@')[1]
                console.log(domain);
                if (domain === "techforgoodinc.org") {
                    console.log("Trusted");
                    //document.getElementById("title").innerHTML = document.getElementById("title").innerHTML + " - " + user.email
                    this.timerIsActive();
                }
                else { //Doesn't allow non-techforgoodinc emails. This will change eventually to allow for organizations to set their own email requirements
                    this.handleLogin();
                }
            } else { //User is not signed in
                this.handleLogin();
            }
        });
    }

    resize() {
        this.setState({ screenWidth: window.innerWidth });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize.bind(this));
    }

    handleLogin = () => {
        var user;

        var provider = new firebase.auth.GoogleAuthProvider();

        provider.setCustomParameters({
            hd: "techforgoodinc.org"
        });

        firebase.auth().signInWithRedirect(provider);

        firebase.auth()
            .getRedirectResult()
            .then((result) => {
                if (result.credential) {
                    /** @type {firebase.auth.OAuthCredential} */
                    //var credential = result.credential;

                    // This gives you a Google Access Token. You can use it to access the Google API.
                    //var token = credential.accessToken;
                    // ...
                    console.log(user.first_name);
                }
                // The signed-in user info.
                user = result.user;
                this.setState({ user: user }, this.timerIsActive());
            }).catch((error) => {
                //// Handle Errors here.
                //var errorCode = error.code;
                //var errorMessage = error.message;
                //// The email of the user's account used.
                //var email = error.email;
                //// The firebase.auth.AuthCredential type that was used.
                //var credential = error.credential;
                //// ...
            });
    }

    timerIsActive = () => {
        if (!this.state.user) {
            this.setState({ activeTimer: false });
            this.setState({ startTime: "-" });
        } else {
            let db = firebase.firestore();
            db.collection('timers').doc(this.state.user.email).get().then((doc) => {
                if (doc.exists) {
                    this.setState({ activeTimer: true });
                    this.setState({ startTime: doc.data().Time });
                } else {
                    this.setState({ activeTimer: false });
                    this.setState({ startTime: "-" });
                }
            })
        }
    }

    startTimer = () => {

        if (this.state.activeTimer) {
            alert("User has active timer");
        } else {
            let newDate = new Date();
            let now = newDate.getDay() + ':' + newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds();
            let db = firebase.firestore();
            db.collection('timers').doc(this.state.user.email).get().then((doc) => {
                if (doc.exists) {
                    if (!doc.data().Time) {
                        db.collection('timers').doc(this.state.user.email).set({ Time: now });
                        this.setState({ activeTimer: true });
                        this.setState({ startTime: now });
                        alert("Timer started!");
                    }
                } else {
                    db.collection('timers').doc(this.state.user.email).set({ Time: now });
                    this.setState({ activeTimer: true });
                    this.setState({ startTime: now });
                    alert("Timer Started!");
                }
            })
        }
    }

    stopTimer = () => {

        if (!this.state.activeTimer) {
            alert("There is no active timer.");
        } else {
            let newDate = new Date();
            let now = newDate.getDay() + ':' + newDate.getHours() + ':' + newDate.getMinutes();
            let db = firebase.firestore();
            db.collection('timers').doc(this.state.user.email).get().then((doc) => {
                if (doc.exists) {
                    this.setState({ stopTime: now }, () => {
                        this.setState({ hoursWorked: this.calculateHoursWorked() });
                    });
                    this.setState({ activeTimer: false });
                }
            })
        }
    }

    removeTimer = () => {
        let db = firebase.firestore();
        db.collection('timers').doc(this.state.user.email).delete().then(() => {
            this.setState({ activeTimer: false });
            this.setState({ startTime: "-" });
            this.setState({ stopTime: "-" });
            this.setState({ hoursWorked: 0 });
        }).catch((error) => {
            console.error("Error deleting: ", error);
        })
    }

    calculateHoursWorked = () => {
        let stad = new Date();

        if (parseInt(stad.getDay()) !== parseInt(this.state.startTime[0])) {
            //Timer is more than 1 day, or new day has begun, user needs to enter time manually.
            alert("Timer is more than 24 hours, please enter time manually.");
            this.removeTimer();
            return;
        }

        let split = this.state.startTime.split(':');
        stad.setHours(split[1], split[2], split[3]);
        return this.msToHours(Date.now() - stad);
    }

    msToHours(duration) {
        let milliseconds = parseInt((duration % 1000));
        let seconds = Math.floor((duration / 1000) % 60);
        let minutes = Math.floor((duration / (1000 * 60)) % 60);
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        let res = hours;
        res += minutes / 60.0;
        res += seconds / (60.0 * 60);
        res += milliseconds / (1000 * 60.0 * 60);
        return res;
    }

    getFormattedTimeString = (date) => {
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

    handleLogout(e) {
        e.preventDefault();
        firebase.auth().signOut().then(function () {
            // Redirect to google sign out.
            window.location.assign('https://accounts.google.com/logout');

        }).catch(function (error) {
            // Error occurred.
            alert('Error signing out');
            console.log(error);
        });
    }

    //Uploads data to the database
    //Renamed to follow conventions
    postData = (data, alertMessage) => {

        let db = firebase.firestore();
        db.collection('employees').doc(data.project).set({});
        let dateDoc = db.collection('employees').doc(data.project).collection(this.state.user.email).doc(data.date);
        dateDoc.update({ Date: data.date });
        dateDoc.get().then(snap => {
            if (!snap.get('Entries')) {
                dateDoc.set({
                    Date: data.date,
                    Entries: [{
                        Hours: data.hours,
                        Work_Performed: data.description
                    }]
                });
            } else {
                let tempArray = snap.get('Entries');
                tempArray.push({
                    Hours: data.hours,
                    Work_Performed: data.description
                })
                dateDoc.update({ Entries: tempArray })
            }
        }).then(() => {
            if(alertMessage) alert(alertMessage);
            this.removeTimer();
            this.timerIsActive();
        });
    }

    //Returns a promise that gives a list of entries falling between the startDate and endDate. Start and end date must be at most 1 year apart.
    getEntriesBetweenDates = async (startDate, endDate) => {
        let db = firebase.firestore();
        let res = []; //Resulting array containing all entries in range

        let d1String = startDate.getFullYear() + '-' + (startDate.getMonth() + 1 < 10 ? '0' : '') + (startDate.getMonth() + 1) + '-' + (startDate.getDate() < 10 ? '0' : '') + startDate.getDate();
        let d2String = endDate.getFullYear() + '-' + (endDate.getMonth() + 1 < 10 ? '0' : '') + (endDate.getMonth() + 1) + '-' + (endDate.getDate() < 10 ? '0' : '') + endDate.getDate();

        let projects = await db.collection('employees').get();

        //Goes through each project in the list of projects
        for (const doc of projects.docs) {

            //value becomes a list of entries in the date range in this current project
            let temp = await db.collection('employees').doc(doc.id).collection(this.state.user.email).orderBy('Date', 'desc').startAt(d2String).endAt(d1String).limit(365).get().then(async (query) => {
                //Temp array to store list of entries in this project that are in range
                let inRangeEntries = [];

                //For every entry by this user in this project
                for (const entry of query.docs) {
                    let entryDate = new Date(entry.id + 'T12:00:00+00:00');

                    //Setting every time to the same time to avoid errors with timezones
                    startDate.setHours(12, 0 - startDate.getTimezoneOffset(), 0, 0);
                    endDate.setHours(12, 0 - endDate.getTimezoneOffset(), 0, 0);

                    //If date is in range, add it to the array
                    if (startDate <= entryDate && entryDate <= endDate) {

                        //Goes through all entries in a specific date
                        for (let j = 0; j < entry.data().Entries.length; ++j) {
                            try {
                                //Determining if entry was made using old method
                                let tempHours = entry.data().Entries[j].Hours ? entry.data().Entries[j].Hours : -300//entry.data().Entries[j]['Entry ' + (j + 1).toString()].Hours;
                                let tempWorkPerformed = entry.data().Entries[j].Work_Performed ? entry.data().Entries[j].Work_Performed : 'This entry was not logged correctly. Contact TRS project lead to correct this'//entry.data().Entries[j]['Entry ' + (j + 1).toString()].Work_Performed;

                                let newEntry = new entryData(entry.id, tempHours, tempWorkPerformed, doc.id);
                                inRangeEntries.push(newEntry)
                            } catch (error) {
                                console.log('Error collecting entries:', error);
                            }
                        }
                    }
                }
                //If there were no entries by the user in this project, return undefined
                if (inRangeEntries.length === 0) return undefined;

                return inRangeEntries;
            })

            if (temp !== undefined) res = res.concat(temp);

        }
        
        console.log('All entries between', startDate, 'and', endDate, '=', res);
        return res.reverse();
    }

    getEntriesOnDate = async (d) => {
        if(d instanceof Date)
            return await this.getEntriesBetweenDates(d, d)

        console.log('Error getting entry on date: parameter is not of type Date');
        return [];
    }

    // deletes data from the database
    delete_data = async (entry) => {
        let db = firebase.firestore();

        let entries = await db.collection('employees').doc(entry.project).collection(this.state.user.email).doc(entry.date).get('Entries');

        console.log(entries.data().Entries);

        if (!entries) { //If there is not currently an entry for this date
            alert("There is no entry to delete on this date.");
        }
        else { //If there are entries on this date
            let tempArray = entries.data().Entries; //Array that will replace existing array
            for (let i = 0; i < tempArray.length; ++i) {
                if (tempArray[i].Hours === entry.hours && tempArray[i].Work_Performed === entry.description) {
                    tempArray.splice(i, 1); //Removing element from array
                    db.collection('employees').doc(entry.project).collection(this.state.user.email).doc(entry.date).update({ Entries: tempArray }); //Replace existing array with tempArray
                    return;
                }
            }
        }
        console.log('Error deleting data');
    }

    render = () => {
        return (
            <div className='App'>
                <Header handleLogout={this.handleLogout} email={(this.state.user) ? this.state.user.email : ''} firebase={firebase} user={this.state.user} />
                <HourLogger postData={this.postData} activeTimer={this.state.activeTimer} screenWidth={this.state.screenWidth}
                    startTimer={this.startTimer} stopTimer={this.stopTimer} removeTimer={this.removeTimer} startTime={this.state.startTime}
                    stopTime={this.state.stopTime} hoursWorked={this.state.hoursWorked} />
                <br/>
                <br/>
                <History getEntries={this.getEntriesBetweenDates} display_history={this.display_history} postData={this.postData} delete_data={this.delete_data} />
            </div>
        );
    }
}

export default App;
