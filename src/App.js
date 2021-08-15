import './App.css';
import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './firebaseCfg.js'
import "./styles.css";
import Router from './components/Router';
import Header from './components/header';
//import Sidebar from './components/Sidebar';
import entryData from './components/dataEntry/entryData.js';

firebase.initializeApp(firebaseConfig);

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            userEmail: null,
            formInfo: null,
            activeTimer: null,
            startTime: "-",
            stopTime: "-",
            hoursWorked: 0,
            screenWidth: window.innerWidth,
            isSupervisor: false
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
                this.setState({ user: user, userEmail: user.email });
                var domain = user.email.split('@')[1]
                if (domain === "techforgoodinc.org") {
                    this.timerIsActive();
                    firebase.firestore().collection('supervisors').doc(this.state.user.email).get().then((doc) => {
                        this.setState({ isSupervisor: doc.exists });
                    });
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
        var provider = new firebase.auth.GoogleAuthProvider();

        provider.setCustomParameters({
            hd: 'techforgoodinc.org',
        });

        firebase.auth().signInWithRedirect(provider);

        firebase
            .auth()
            .getRedirectResult()
            .then((result) => {
                if (result.credential) {
                    /** @type {firebase.auth.OAuthCredential} */
                    //var credential = result.credential;

                    // This gives you a Google Access Token. You can use it to access the Google API.
                    //var token = credential.accessToken;
                    // ...
                }
                // The signed-in user info.
                this.setState({ user: result.user });
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
                    this.setState({ activeTimer: true, startTime: doc.data().Time });
                } else {
                    this.setState({ activeTimer: false, startTime: "-" });
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
    postData = async (data, alertMessage, email = this.state.user.email) => {
        if (alertMessage) alert(alertMessage);

        let db = firebase.firestore();

        let user_works_on_query = await db.collection('user-works-on').where('email', '==', email).where('project', '==', data.project).limit(1).get();
        if (user_works_on_query.docs.length === 0) {
            console.log('adding', email, 'to', data.project)
            await db.collection('user-works-on').add({
                email: email,
                project: data.project
            })
        }
        let projects_query = await db.collection('projects').doc(data.project).get();
        if (!projects_query.exists) {
            db.collection('projects').doc(data.project).set({});
        }


        await db.collection('hour-entries').add({
            email: email,
            project: data.project,
            date: data.date,
            hours: data.hours,
            description: data.description
        }).then(() => {
            this.timerIsActive();
        })
    }

    //Returns a promise that gives a list of entries falling between the startDate and endDate
    getEntriesBetweenDates = async (startDate, endDate, email = this.state.user.email) => {
        let db = firebase.firestore();
        let res = []; //Resulting array containing all entries in range

        let d1String = startDate.getFullYear() + '-' + (startDate.getMonth() + 1 < 10 ? '0' : '') + (startDate.getMonth() + 1) + '-' + (startDate.getDate() < 10 ? '0' : '') + startDate.getDate();
        let d2String = endDate.getFullYear() + '-' + (endDate.getMonth() + 1 < 10 ? '0' : '') + (endDate.getMonth() + 1) + '-' + (endDate.getDate() < 10 ? '0' : '') + endDate.getDate();
        let query;

        try {
            query = await db.collection('hour-entries').where('email', '==', email).where('date', '>=', d1String).where('date', '<=', d2String).get();
            for (const entry of query.docs)
                res.push(new entryData(entry.data().date, entry.data().hours, entry.data().description, entry.data().project));
        }
        catch (error) { //In case indexing has not been set up
            console.error(error);
            console.log('Please set up indexing using the link provided above to allow for better queries. Queries without indexing are only allowed 50 results');
            let current = new Date(startDate);
            let count = 0;
            while (current.getTime() <= endDate.getTime() && count < 50) {
                let d3String = current.getFullYear() + '-' + (current.getMonth() + 1 < 10 ? '0' : '') + (current.getMonth() + 1) + '-' + (current.getDate() < 10 ? '0' : '') + current.getDate();
                query = await db.collection('hour-entries').where('email', '==', email).where('date', '==', d3String).get();

                for (const entry of query.docs)
                    res.push(new entryData(entry.data().date, entry.data().hours, entry.data().description, entry.data().project));
                current.setDate(current.getDate() + 1);
                ++count;
            }
        }

        //console.log('All entries between', startDate, 'and', endDate, '=', res);
        return res;
    }

  getEntriesOnDate = async (d) => {
    if (d instanceof Date) return await this.getEntriesBetweenDates(d, d);

        console.log('Error getting entry on date: parameter is not of type Date');
        return [];
    }

    // Deletes an entry from the database
    delete_data = async (entry, email = this.state.user.email) => {
        let db = firebase.firestore();

        let query = await db.collection('hour-entries').where('email', '==', email).where('date', '==', entry.date).where('description', '==', entry.description).limit(1).get()
        await db.collection('hour-entries').doc(query.docs[0].id).delete();

        let entry_query = await db.collection('hour-entries').where('email', '==', email).where('project', '==', entry.project).limit(1).get();
        if (entry_query.docs.length === 0) {
            console.log('removing', email, 'from', entry.project);
            let user_works_on_query = await db.collection('user-works-on').where('email', '==', email).where('project', '==', entry.project).limit(1).get();
            await db.collection('user-works-on').doc(user_works_on_query.docs[0].id).delete();
        }
    }

    render = () => {
        return (
            <div className='App'>
                {/* Disabling sidebar until more routing is available
                <Sidebar />
                */}
                <div style={{ padding: '20px' }}>
                    <Header handleLogout={this.handleLogout} email={(this.state.user) ? this.state.user.email : ''} firebase={firebase} isSupervisor={this.state.isSupervisor} />
                    <Router
                        email={(this.state.user) ? this.state.user.email : ''}
                        hourLoggerDep={{
                            postData: this.postData,
                            activeTimer: this.state.activeTimer,
                            screenWidth: this.state.screenWidth,
                            startTimer: this.startTimer,
                            stopTimer: this.stopTimer,
                            removeTimer: this.removeTimer,
                            startTime: this.state.startTime,
                            stopTime: this.state.stopTime,
                            hoursWorked: this.state.hoursWorked,
                        }}
                        historyDep={{
                            getEntries: this.getEntriesBetweenDates,
                            postData: this.postData,
                            delete_data: this.delete_data
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default App;
