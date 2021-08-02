import React, { Component } from 'react';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import ManualEntry from './manualEntry';
import TimerComponent from './TimerComponent';

class HourLogger extends Component {

	render() {
		return (
			<Tabs defaultActiveKey='manual-entry'>
				<Tab className='hourLoggerTab' eventKey='manual-entry' title='Manual Entry'>
					<ManualEntry post_data={this.props.postData}/>
				</Tab>
				<Tab className='hourLoggerTab' eventKey='timer-entry' title='Timer Entry'>
					<TimerComponent postData={this.props.postData} activeTimer={this.props.activeTimer}
						startTimer={this.props.startTimer} stopTimer={this.props.stopTimer} startTime={this.props.startTime}
						stopTime={this.props.stopTime} hoursWorked={this.props.hoursWorked} />

				</Tab>
			</Tabs>
		);
	}
}

export default HourLogger;