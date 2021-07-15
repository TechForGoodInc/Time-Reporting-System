import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import '../main.css';
import firebaseConfig from '../firebaseCfg.js';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class TempTRSClone extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
            date: null,
            hours: '1',
            description: null,
            project: null
        }
    }

    login = () => {

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

    logout = () => {
        firebase.auth().signOut().then(function () {
            // Redirect to google sign out.
            window.location.assign('https://accounts.google.com/logout');

        }).catch(function (error) {
            // Error occurred.
        });
    }

    //State updated
    componentDidMount() {
        
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user });
                console.log(user.email);
                var domain = user.email.split('@')[1]
                console.log(domain);
                if (domain === "techforgoodinc.org") {
                    console.log("Trusted");
                    document.getElementById("title").innerHTML = document.getElementById("title").innerHTML + " - " + user.email
                }
                else {
                    this.login();
                }
            } else {
                this.login();
            }
        });
    }

    //Sets the state every time form is changed
    changeHandler = (event) => {
        var nam = event.target.name;
        var val = event.target.value;
        this.setState({
            [nam]: val
        })
    }

    post_data = (event) => {
        event.preventDefault();

        let db = firebase.firestore();

        var dateDoc = db.collection('employees').doc(this.state.project).collection(this.state.user.email).doc(this.state.date);

        dateDoc.collection('entries').get().then(snap => {
            dateDoc.collection('entries').
                doc("Entry #" + (snap.size + 1).toString()).set({
                    Hours: this.state.hours,
                    Work_Performed: this.state.description
                })
        });

        alert("Information Submitted Successfully.")
    }

    render() {
        return (
            <React.Fragment>
                <button onClick={this.logout} style={{ float: 'right', color: 'white', background: 'red'}}>Log out</button>

                <h3 id="title">TFG Time Reporting System</h3>
                <div>

                    <form onSubmit={this.post_data}>
                        <label htmlFor="date">Date (MM/DD/YY)</label>
                        <input type="date" id="date" name="date" placeholder="(MM/DD/YY)" required pattern="\d{4}-\d{2}-\d{2}" onChange={this.changeHandler}/>
                        <span className="validity"></span>

                        <br />
                        <br />

                        <label htmlFor="hours">Hours Worked (Numerical Form)</label>
                        <input type="number" id="hours" name="hours" placeholder="8" min="1" max="12" required onChange={this.changeHandler} />
                        <span className="validity"></span>

                        <br />
                        <br />

                        <label htmlFor="description">Description of work done</label>
                        <input type="text" id="description" name="description" placeholder="Worked on ...." required onChange={this.changeHandler}></input>
                        <span className="validity"></span>

                        <br />
                        <br />

                        <label htmlFor="project">Project</label>
                        <select id="project" name="project" onChange={this.changeHandler}>
                            <option value="Flant">Flant</option>
                            <option value="IDDPS">IDDPS</option>
                            <option value="Mission Uplink">Mission Uplink</option>
                            <option value="Make The Stars">Make The Stars</option>
                            <option value="OSSFTGG">OSSFTGG</option>
                            <option value="TFG Website">TFG Website</option>
                            <option value="Assurance">Assurance</option>
                            <option value="Project Interactivity">Project Interactivity</option>
                            <option value="Blockchain Donations">Blockchain Donations</option>
                            <option value="Re-Right">Re-Right</option>
                            <option value="FireSpot">FireSpot</option>
                            <option value="Other">Other</option>
                        </select>

                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default TempTRSClone;