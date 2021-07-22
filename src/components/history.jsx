import React, { Component } from 'react';
import ProjectInput from "./dataEntry/projectInput";
import DateInput from "./dataEntry/dateInput";
import HistoryBlock from './historyBlock';

class History extends Component {
    state = {
        date: null,
        project: 'unselected'
    }

    changeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    viewHistory = (event) => {
        event.preventDefault();
        if (this.state.project === 'unselected') {
            alert("Please select a project");
            return;
        } else {
            this.props.display_history(this.state);
        }
    }

    //TODO make a list of HistoryBlocks. First one displays today's entries, 
    //second displays yesterday's, individual ones for each day of the past week, 
    //then start making a HistoryBlock for each week before that. 
    //ONLY LOAD ENTRIES IF USER CLICKS BUTTON SAYING SHOW HISTORY
    render() {
        return (
            <div>
                <ProjectInput changeHandler={this.changeHandler} />
                <DateInput changeHandler={this.changeHandler} />
                <button onClick={this.viewHistory}>View History</button>
                {/*This history block is just for testing*/}
                <HistoryBlock startDate={new Date()} endDate={new Date()} getEntries={this.props.getEntries}></HistoryBlock>
                <HistoryBlock startDate={new Date(new Date().setDate(new Date().getDate() - 7))} endDate={new Date()} getEntries={this.props.getEntries}></HistoryBlock>

            </div>
        );
    }
}

export default History;