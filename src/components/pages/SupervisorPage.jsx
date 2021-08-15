import React, { Component } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

import History from '../history'

//This is a quick temporary page for supervisor features that should be replaced with a better layout and more optimized functions
class SupervisorPage extends Component {

	state = {
		emailInput: null,
		validEmail: false,
		individualDetails: null,
		individualEntries: null,
		showAll: false,
		totalHours: null,
		totalEntries: null,
		totalContributors: null,
		projectNames: null,
		loadedProjects: {},
		projectShown: null,
		showingAll: false
	}

	componentDidMount = async () => {
		if (this.state.projectNames === null) {
			let projects_query = await firebase.firestore().collection('projects').get();
			let projectsArray = [];
			for (let p of projects_query.docs)
				projectsArray.push(p.id);

			this.setState({ projectNames: projectsArray });
        }
    }

	handleIndividualViewSubmit = async (event) => {
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

	handleProjectViewSubmit = async (event) => {
		event.preventDefault();

		await this.loadProject(event.target.name);
		this.setState({ projectShown: null });
		this.setState({ projectShown: event.target.name });
	}

	loadProject = async (projectName) => {
		//Ensuring no duplicates
		if (this.state.loadedProjects[projectName] !== undefined) return;

		let query = await firebase.firestore().collection('hour-entries').where('project', '==', projectName).get();
		let entries = [];
		let total = 0;

		let contributorHourTracker = {};

		for (const entry of query.docs) {
			let replacement = entry.data();
			total += parseFloat(replacement.hours);
			replacement.description = replacement.email + ": " + replacement.description;
			entries.push(replacement);

			if (contributorHourTracker[replacement.email] === undefined)
				contributorHourTracker = { [replacement.email]: 0, ...contributorHourTracker }
			contributorHourTracker[replacement.email] += parseFloat(replacement.hours);
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

		let user_works_on_query = await firebase.firestore().collection('user-works-on').where('project', '==', projectName).get();
		let contributors = [];
		for (const user of user_works_on_query.docs) {
			contributors.push(user.data().email + " " + contributorHourTracker[user.data().email] + " hours");
		}
		contributors.sort();
		
		let newProject = { totalHours: total, entries: entries, contributors: contributors };
		this.setState({loadedProjects: { [projectName]: newProject, ...this.state.loadedProjects }});
		await this.setState({ totalHours: this.state.totalHours + total });
	}

	//Renders the given project
	renderProject = (projectName) => {
		let project = this.state.loadedProjects[projectName];

		if (project === undefined)
			return <div>No project by the name of {projectName}</div>

		if (project.totalHours === null || project.entries.length === 0 || project.contributors.length === 0)
			return <div>Project is missing data</div>

		return (
			<div style={{ marginTop: '10px', marginBottom: '10px' }}>
				<hr />
				<h4>{projectName}</h4>
				Total hours: {project.totalHours.toFixed(1)}
				<br />
				Average hours per user: {(project.totalHours / project.contributors.length).toFixed(3)}
				<br />
				Average hours per entry: {(project.totalHours / project.entries.length).toFixed(3)}
				<br />
				<br />
				<Dropdown>
					<Dropdown.Toggle variant="success" id="dropdown-basic">
						List of contributors
					</Dropdown.Toggle>

					<Dropdown.Menu>
						{project.contributors.map((data, index) => {
							return (
								<Dropdown.Item key={index}>
									{data}
								</Dropdown.Item>
							);
						})}
					</Dropdown.Menu>
				</Dropdown>
			</div>
		);
	}

	//When the user clicks load all data we loop through all project names and load each of them
	handleAllViewSubmit = async (event) => {
		event.preventDefault();

		if (this.state.showAll) return;

		let totalEntries = 0;
		let totalContributors = 0;
		for (const name of this.state.projectNames) {
			await this.loadProject(name);
			totalEntries += this.state.loadedProjects[name].entries.length;
			totalContributors += this.state.loadedProjects[name].contributors.length;
		}

		await this.setState({ showAll: true, totalEntries: totalEntries, totalContributors: totalContributors});
	}

	refreshAllView = async () => {
		await this.setState({ showAll: false });
		await this.setState({ showAll: true });
    }

	render() {
		return (
			<div>
				<br />
				This page is temporary and should be replaced with the new group of interns. It would be best to avoid refreshing this page because if you load a bunch of entries then refresh, you'd have to load them again and some of the queries take a lot of reads.
				<br />
				There is a daily limit of 50k reads on Firestore and there are about 3.5k entries as of 2021-08-14 so it's not too bad yet to load all the entries.
				<br />
				This isn't really a problem now but could be a problem in the future when there are many more entries. Once TRS is moved to a relational DBMS, this should not be a problem.
				<br />
				The app keeps the projects loaded so if you load all entries, clicking any of the other projects doesn't make any more calls to the database and you don't have to worry about the read limit unless you refresh.
				<br />
				<br />
				<Tabs>
					<Tab className='borderedTab' eventKey='individual' title='View individuals'>
						<form onSubmit={this.handleIndividualViewSubmit}>
							<label>Enter a user's email to view their history</label>
							<br />
							<input id='supervisorUserEmailInput' type='text' style={{ width: '200px', textAlign: 'right', paddingInline: '5px' }} onChange={this.emailChangeHandler} />@techforgoodinc.org
						<Button type='submit' variant='success' style={{ marginInline: '20px' }} >Check Email</Button>
						</form>
						{this.state.emailInput && (this.state.validEmail ? <div style={{ color: 'lime' }}>{this.state.emailInput} found</div> : <div style={{ color: 'red' }}>{this.state.emailInput} was not found. Either the email was misspelled or the user has no entries</div>)}
						<br />
						{this.state.validEmail && <div>
							<div>
								Total Hours: {this.state.individualDetails.totalHours.toFixed(1)} Number of entries: {this.state.individualDetails.numEntries}
							</div>
							<History preloadedData={this.state.individualEntries} />
						</div>
						}
					</Tab>


					<Tab className='borderedTab' eventKey='project' title='View projects'>
						<div>
							<h5>Pick a project to view</h5>

							{this.state.projectNames && this.state.projectNames.map((data, index) => {
								return (
									<Button key={index} name={data} variant='primary' style={{ width: '200px', margin: '5px' }} onClick={this.handleProjectViewSubmit}>{data}</Button>
								);
							})}
						</div>
						<div>
							{this.state.projectShown && this.renderProject(this.state.projectShown)}
							{this.state.projectShown && <History preloadedData={this.state.loadedProjects[this.state.projectShown].entries} />}
						</div>
					</Tab>


					<Tab className='borderedTab' eventKey='all' title='All data'>
						<h4>Show All TRS Data</h4>
						<br />
						<Button variant='danger' style={{ width: '100%' }} onClick={this.handleAllViewSubmit}>Load All Data</Button>
						<br />
						<br />
						{this.state.showAll &&
							<div>
								Total Hours: {this.state.totalHours.toFixed(1)}
								<br />
								Total Contributors: {this.state.totalContributors}
								<br />
								Total Entries: {this.state.totalEntries}
								<br />
								Average hours per contributor: {(this.state.totalHours / this.state.totalContributors).toFixed(3)}
								<br />
								Average hours per entry: {(this.state.totalHours / this.state.totalEntries).toFixed(3)}
								<br />
								<br />
								<Button variant='secondary' onClick={this.refreshCumulativeView}>Collapse all history</Button>
								<br />
								<br />
								<h2>Project Data</h2>
								{this.state.projectNames.map((data, index) => {
									return <div key={index}>{this.renderProject(data)}</div>
								})}
							</div>
						}

					</Tab>
				</Tabs>
			</div>

		);
	}
}

export default SupervisorPage;