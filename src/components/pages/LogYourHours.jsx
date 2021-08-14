import React, { Component } from 'react';

import HourLogger from '../hourLogger';
import History from '../history';

class LogYourHours extends Component {
    render() {
        return (
            <div>
                <HourLogger postData={this.props.hourLoggerDep.postData} activeTimer={this.props.hourLoggerDep.activeTimer} screenWidth={this.props.hourLoggerDep.screenWidth}
                    startTimer={this.props.hourLoggerDep.startTimer} stopTimer={this.props.hourLoggerDep.stopTimer} removeTimer={this.props.hourLoggerDep.removeTimer} startTime={this.props.hourLoggerDep.startTime}
                    stopTime={this.props.hourLoggerDep.stopTime} hoursWorked={this.props.hourLoggerDep.hoursWorked} />
                <br />
                <br />
                <History getEntries={this.props.historyDep.getEntries} postData={this.props.historyDep.postData} delete_data={this.props.historyDep.delete_data} />
            </div>
        );
    }
  
}

export default LogYourHours;
