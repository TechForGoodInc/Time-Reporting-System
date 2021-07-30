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
					<HourLogForm post_data={this.props.postData}/>
				</Tab>
				<Tab className='hourLoggerTab' eventKey='timer-entry' title='Timer Entry'>
					<TimerComponent postData={this.props.postData} activeTimer={this.props.activeTimer} startTimer={this.props.startTimer} stopTimer={this.props.stopTimer} />

				</Tab>
			</Tabs>
		);
	}
}

export default HourLogger;