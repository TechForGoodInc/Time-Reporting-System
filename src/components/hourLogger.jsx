import React, { Component } from 'react';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import HourLogForm from './hourLogForm';
import TimerComponent from './TimerComponent';

class HourLogger extends Component {

	render() {
		return (
			<Tabs defaultActiveKey='manual-entry'>
				<Tab className='hourLoggerTab' eventKey='manual-entry' title='Manual Entry'>
					<HourLogForm post_data={this.props.post_data}/>
				</Tab>
				<Tab className='hourLoggerTab' eventKey='timer-entry' title='Timer Entry'>
					<TimerComponent firebase={this.props.firebase} currentUser={this.props.currentUser} postData={this.props.post_data} />

				</Tab>
			</Tabs>
		);
	}
}

export default HourLogger;