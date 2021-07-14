import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

class TestComponent extends Component {
	testWrite() {
		let db = firebase.firestore();
		db.collection('testCollection').add({ test: 'hello world' });
	}

	render() {
		return (
			<div>
				<button onClick={this.testWrite}>Press Me</button>
			</div>
		);
	}
}

export default TestComponent;