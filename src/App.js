import './App.css';
import './main.css';
import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './firebaseCfg.js'

import Header from './components/header';
import HourLogForm from './components/hourLogForm';
import History from "./components/history";

firebase.initializeApp(firebaseConfig);

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            formInfo: null,
            historyInfo:null,
            history_list: []
        }
    }

    componentDidMount() {
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
                }
                else { //Doesn't allow non-techforgoodinc emails. This will change eventually to allow for organizations to set their own email requirements
                    this.handleLogin();
                }
            } else { //User is not signed in
                this.handleLogin();
            }
        });
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
                    var credential = result.credential;

                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = credential.accessToken;
                    // ...
                    console.log(user.first_name);
                }
                // The signed-in user info.
                user = result.user;
                this.setState({ user: user });
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
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
    post_data = (formInput) => {

        this.setState({ formInfo: formInput }, () => {
            console.log('Recording hours - Date:', this.state.formInfo.date,
                '; Hours:', this.state.formInfo.hours, '; Work Performed:', this.state.formInfo.description);
            let db = firebase.firestore();

            var dateDoc = db.collection('employees').doc(this.state.formInfo.project).collection(this.state.user.email).doc(this.state.formInfo.date);

            dateDoc.get().then(snap => {
                if (!snap.get('Entries')) { //If there is not currently an entry for this date
                    dateDoc.set({
                        Entries: [{
                            ['Entry 1']: {
                                Hours: this.state.formInfo.hours,
                                Work_Performed: this.state.formInfo.description
                            }
                        }]
                    });
                }
                else { //If there are multiple entries on this date
                    dateDoc.update({
                        Entries: firebase.firestore.FieldValue.arrayUnion({ //Append to existing array
                            ['Entry ' + (snap.data().Entries.length + 1).toString()]: {
                                Hours: this.state.formInfo.hours,
                                Work_Performed: this.state.formInfo.description
                            }
                        })
                    })
                }

                console.log('Recording hours - Project:', this.state.formInfo.project, 'Date:', this.state.formInfo.date,
                    '; Hours:', this.state.formInfo.hours, '; Work Performed:', this.state.formInfo.description);
            })

            alert("Information Submitted Successfully.")
        })
    }

    //Returns a promise that gives a list of entries falling between the startDate and endDate
    getEntriesBetweenDates = async (startDate, endDate) => {
        let db = firebase.firestore();
        let res = []; //Resulting array containing all entries in range

        let projects = await db.collection('employees').get();

        //Goes through each project in the list of projects
        for (const doc of projects.docs) {

            //value becomes a list of entries in the date range in this current project
            let temp = await db.collection('employees').doc(doc.id).collection(this.state.user.email).get().then(async (query) => {

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
                                inRangeEntries.push({
                                    ['project']: doc.id,
                                    ['date']: entry.id,
                                    ['hours']: entry.data().Entries[j]['Entry ' + (j + 1).toString()].Hours,
                                    ['desc']: entry.data().Entries[j]['Entry ' + (j + 1).toString()].Work_Performed
                                })
                            } catch (error) {
                                console.log('Error collecting entries:', error);
                            }
                        }
                    }
                }
                //If there were no entries by the user in this project, return undefined
                if (inRangeEntries.length == 0) return undefined;

                return inRangeEntries;
            })

            if (temp != undefined) res = res.concat(temp);

        }

        console.log('All entries between', startDate, 'and', endDate, '=', res);
        return res;
    }

    //Gets all entries from a specified user
    getAllEntries = async () => {
        return await this.getEntriesBetweenDates(new Date('0000-01-01'), new Date('5000-01-01'));
    }

    display_history = (formInput) => {
        let db = firebase.firestore();
        //this.setState({history_list: []});
        let list = [];

        console.log("History");
        this.setState({ historyInfo: formInput }, () => {
            db.collection('employees').doc(this.state.historyInfo.project).collection(this.state.user.email).doc(this.state.historyInfo.date).get().then((records) => {

                let entries =  records.get('Entries');
                if(entries==null) return;
                for (let i = 0; i < entries.length; i++) {
                    let entry = entries[i]['Entry '+(i+1)];
                    console.log(entry);
                    list.push({
                        "id": i,
                        "hours":entry.Hours,
                        "work": entry.Work_Performed
                    });

                }
                this.setState({history_list: list});

                // for (let record in records.get('Entries')) {
                //      console.log(record);
                // }
                //     for (let entry in record.data()) {
                //         console.log(entry.data());
                //
                //         // history_list.push({
                //         //     "id": ++i,
                //         //     //"date": record.data().Date,
                //         //     "hours":entry.Hours,
                //         //     "work": entry.Work_Performed
                //         //  });
                //
                //     }
                // })
                //this.setState({history_list: history_list});
            })

        })


    }


    render = () => {
        return (
            <div style={{ padding: '20px' }}>
                <Header handleLogout={this.handleLogout} email={(this.state.user) ? this.state.user.email : ''} />
                <HourLogForm post_data={this.post_data}/>

                <History  display_history={this.display_history} list={this.state.history_list}/>
            </div>
        );
    }
}

export default App;
