import React, { Component } from 'react';
import HourLogForm from "./hourLogForm";

class Entry extends Component {

	state = {
		date: null,
		hours: null,
		description: null,
		project: 'unselected'
		id: null
	}

    handleDelete = (event) => {
        event.preventDefault();
        if (this.state.date === 'unselected') {
            alert("Please select a date");
            return;
        }

        this.props.delete_data(this.state.date, this.state.id)
    }


export default DeleteBtn;