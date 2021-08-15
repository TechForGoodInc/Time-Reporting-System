import React, { Component } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';

import History from '../history'

//This is a quick temporary page for supervisor features that should be replaced with a better layout and more optimized functions
class SupervisorPage extends Component {

	state = {
		emailInput: null,
		validEmail: false,
		individualDetails: null,
		individualEntries: null
    }

	handleSubmit = async (event) => {
		event.preventDefault();

		await this.setState({ emailInput: null, validEmail: false });

		let email = (document.getElementById('supervisorUserEmailInput').value + "@techforgoodinc.org").toLowerCase();

		if (email === '') return;

		let q = await firebase.firestore().collection('hour-entries').where('email', '==', email).limit(1).get();
		if (q.docs.length === 0) {
			this.setState({ emailInput: email, validEmail: false });
			return;
		}
		else {
			let allEntries = await firebase.firestore().collection('hour-entries').where('email', '==', email).get();
			let count = 0;
			let totalHours = 0;
			let entries = [];
			for (const entry of allEntries.docs) {
				++count;
				entries.push(entry.data());
				totalHours += parseFloat(entry.data().hours);
			}

			//Sorting
			for (let i = 1; i < entries.length; ++i) {
				let j = i - 1;
				let key = entries[i];
				while (j >= 0 && entries[j].date < key.date) {
					entries[j + 1] = entries[j--];
				}
				entries[j + 1] = key;
            }

			let details = { totalHours: totalHours, numEntries: count };

			this.setState({ emailInput: email, validEmail: true, individualDetails: details, individualEntries: entries})
		}
	}

    render() {
        return (
			<Tabs>
				<Tab className='borderedTab' eventKey='individual' title='View individuals'>
					<form onSubmit={this.handleSubmit}>
						<label>Enter a user's email to view their history</label>
						<br />
						<input id='supervisorUserEmailInput' type='text' style={{ width: '200px', textAlign: 'right', paddingInline: '5px'}} onChange={this.emailChangeHandler} />@techforgoodinc.org
						<Button type='submit' variant='success' style={{ marginInline: '20px' }} >Check Email</Button>
					</form>
					{this.state.emailInput && (this.state.validEmail ? <div style={{ color: 'lime' }}>{this.state.emailInput} found</div> : <div style={{ color: 'red' }}>{this.state.emailInput} was not found. Either the email was misspelled or the user has no entries</div>)}
					<br />
					{this.state.validEmail && <div>
						<div>
							Total Hours: {this.state.individualDetails.totalHours} Number of entries: {this.state.individualDetails.numEntries}
						</div>
						<History getEntries={this.props.historyDep.getEntries} postData={this.props.historyDep.postData} delete_data={this.props.historyDep.delete_data} email={this.state.emailInput} preloadedData={this.state.individualEntries} />
					</div>
					}
				</Tab>

				<Tab className='borderedTab' eventKey='project' title='View projects'>
					
				</Tab>

				<Tab className='borderedTab' eventKey='all' title='All data'>
					
				</Tab>
			</Tabs>
        );
    }
}

export default SupervisorPage;