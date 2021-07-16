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
        this.handleHistory=this.handleHistory.bind(this);
        this.state = {
            user: null,
            formInfo: null,
            history_list: []
        }
    }

    componentDidMount() {
        //Signs user in if they are not already signed in
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({user: user});
                console.log(user.email);
                var domain = user.email.split('@')[1]
                console.log(domain);
                if (domain === "techforgoodinc.org") {
                    console.log("Trusted");
                    //document.getElementById("title").innerHTML = document.getElementById("title").innerHTML + " - " + user.email
                } else { //Doesn't allow non-techforgoodinc emails. This will change eventually to allow for organizations to set their own email requirements
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
                this.setState({user: user});
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

    handleLogout() {
        firebase.auth().signOut().then(function () {
            // Redirect to google sign out.
            window.location.assign('https://accounts.google.com/logout');

        }).catch(function (error) {
            // Error occurred.
        });
    }

    //Uploads data to the database
    post_data = (formInput) => {

        this.setState({formInfo: formInput}, () => {
            console.log('Recording hours - Date:', this.state.formInfo.date,
                '; Hours:', this.state.formInfo.hours, '; Work Performed:', this.state.formInfo.description);
            let db = firebase.firestore();

            var dateDoc = db.collection('employees').doc(this.state.formInfo.project).collection(this.state.user.email).doc(this.state.formInfo.date);

            dateDoc.collection('entries').get().then(snap => {
                dateDoc.collection('entries').doc("Entry #" + (snap.size + 1).toString()).set({
                    Hours: this.state.formInfo.hours,
                    Work_Performed: this.state.formInfo.description
                })
            });

            alert("Information Submitted Successfully.")
        })
    }

    handleHistory() {
        let db = firebase.firestore();
        let history_list = this.state.history_list;
        let i = 0;
        db.collection('employees').doc('OSSFTGG').collection(this.state.user.email).get().then((records) => {
                        records.forEach((record) => {
                            history_list.push({
                                "id": ++i, "date": record.data().Date, "hours": record.data().Hours,
                                "work": record.data().Work_Performed
                            });
                        })
                        this.setState({history_list: history_list});
        })




    }


    render = () => {
        return (
            <div style={{padding: '20px'}}>
                <Header handleLogout={this.handleLogout} email={(this.state.user) ? this.state.user.email : ''}/>
                <HourLogForm post_data={this.post_data}/>

                <button onClick={this.handleHistory}>View History</button>
                <table id="customers">
                    <tbody>
                {this.state.history_list.map((data) => {
                    //console.log(data);
                    return <History key={data.id} index={data.id} date={data.date}
                                    hours={data.hours} work={data.work}/>
                })}
                    </tbody>
                </table>

            </div>
        );
    }

}
export default App;
