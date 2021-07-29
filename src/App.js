import './App.css';
import './main.css';
import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './firebaseCfg.js'

import Header from './components/header';
import HourLogForm from './components/hourLogForm';
import TimerComponent from './components/TimerComponent';

firebase.initializeApp(firebaseConfig);

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            formInfo: null,
            timerStartTime: "-",
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
                            [this.state.formInfo.id]: {
                                Hours: this.state.formInfo.hours,
                                Work_Performed: this.state.formInfo.description
                            }
                        }]
                    });
                    this.state.formInfo.id++;
                }
                else { //If there are multiple entries on this date
                    dateDoc.update({
                        Entries: firebase.firestore.FieldValue.arrayUnion({ //Append to existing array
                            [this.state.formInfo.id]: {
                                Hours: this.state.formInfo.hours,
                                Work_Performed: this.state.formInfo.description
                            }
                        })
                    })
                    this.state.formInfo.id++;
                }

                console.log('Recording hours - Project:', this.state.formInfo.project, 'Date:', this.state.formInfo.date,
                    '; Hours:', this.state.formInfo.hours, '; Work Performed:', this.state.formInfo.description);
            })

            alert("Information Submitted Successfully.")
        })
    }

    // deletes data from the database
    delete_data = (formInput) => {
        this.setState({ formInfo: formInput }, () => {
            var deleted = false;
            let db = firebase.firestore();
            var dateDoc = db.collection('employees').doc(this.state.formInfo.project).collection(this.state.user.email).doc(this.state.formInfo.date);
            dateDoc.get().then(snap => {
                    if (!snap.get('Entries')) { //If there is not currently an entry for this date
                        alert("There is no entry to delete on this date.");
                    }
                    else { //If there are entries on this date
                        for (var entry in snap.get('Entries')) {
                            if (entry == this.state.formInfo.id) { // Only delete the entry with the given id
                                dateDoc.delete();
                                deleted = true;
                                alert("Information succesfully deleted.");
                                break;
                            }
                        }
                        if (!deleted) {
                            alert("There is no entry with this ID on this date.")
                        }

                    }

                })
        })
        

    }

    render = () => {
        return (
            <div style={{ padding: '20px' }}>
                <Header handleLogout={this.handleLogout} email={(this.state.user) ? this.state.user.email : ''} />
                <HourLogForm post_data={this.post_data} delete_data={this.delete_data} />
                <TimerComponent firebase={firebase} currentUser={this.state.user} />
            </div>
        );
    }
}

export default App;
