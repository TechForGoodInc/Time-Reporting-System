import React, { Component } from 'react';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import ManualEntry from './manualEntry';
import TimerComponent from './TimerComponent';

class HourLogger extends Component {

	state = {
		key: 'manual-entry'
    }

	componentDidUpdate() {
		if (this.props.activeTimer && this.state.key !== 'timer-entry')
			this.setState({ key: 'timer-entry' });
	}

	componentdid

	setKey = (k) => {
		this.setState({ key: k });
    }

	render() {
		return (
			<Tabs id='hourLoggerTabs' activeKey={this.state.key} onSelect={(k) => this.setKey(k)}>
				<Tab className='hourLoggerTab' eventKey='manual-entry' title='Manual Entry'>
					<ManualEntry post_data={this.props.postData}/>
				</Tab>
				<Tab className='hourLoggerTab' eventKey='timer-entry' title='Timer Entry'>
					<TimerComponent postData={this.props.postData} activeTimer={this.props.activeTimer}
						startTimer={this.props.startTimer} stopTimer={this.props.stopTimer} removeTimer={this.props.removeTimer} startTime={this.props.startTime}
						stopTime={this.props.stopTime} hoursWorked={this.props.hoursWorked} />

				</Tab>
			</Tabs>
		);
	}
}

export default HourLogger;