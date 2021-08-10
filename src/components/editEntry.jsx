import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import NumInput from './dataEntry/numInput';
import ProjectInput from './dataEntry/projectInput';
import TextInput from './dataEntry/textInput';
import entryData from './dataEntry/entryData.js';


class EditEntry extends Component {

    state = {
        date: new Date(new Date(this.props.data.date + 'T12:00:00+00:00').setHours(0, 0 - new Date().getTimezoneOffset(), 0, 0)).toISOString().substr(0, 10),
        hours: this.props.data.hours,
        description: this.props.data.description,
        project: this.props.data.project,
        showEditBox: false
    }

    //Sets the state every time the form is changed
    changeHandler = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    toggleEditBox = () => {
        this.setState({
            date: this.props.data.date,
            hours: this.props.data.hours,
            description: this.props.data.description,
            project: this.props.data.project,
            showEditBox: !this.state.showEditBox
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.state.project === 'unselected') {
            alert("Please select a project");
            return;
        }

        let descString = this.state.description;

        if (descString === " " || descString == null) {
            alert("Please enter a description");
            return;
        } else if (descString.length <= 6) { //6 is an arbitrary number; 'worked' is 6 letters.
            alert("Please enter a more detailed description");
            return;
        } else {
            let data = new entryData(this.state.date, this.state.hours.toString(), this.state.description, this.state.project);
            if (this.props.removeFromHistory)
                this.props.removeFromHistory();
            if (this.props.insertIntoHistory)
                this.props.insertIntoHistory(data);
            this.props.delete_data(this.props.data).then(() => { this.props.postData(data); });
            this.toggleEditBox();
        }
    }

    deleteEntry = (entry) => {


        this.props.delete_data(entry);
        if (this.props.removeFromHistory)
            this.props.removeFromHistory();
        this.toggleEditBox();
    }

    render = () => {
        return (
            <div>
                <button style={{ border: 'none' , backgroundColor: '#ffffff' }} onClick={this.toggleEditBox}><img src="https://www.pngkey.com/png/detail/202-2022557_edit-comments-edit-icon-png.png" width="35" height="35" alt=""></img></button>

                <Modal show={this.state.showEditBox} onHide={this.toggleEditBox}>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Header>
                            <Modal.Title>Edit Entry</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='edit-box-element'>
                                Date: {this.props.data.date}
                            </div>
                            <div className='edit-box-element'>
                                Hours: <NumInput changeHandler={this.changeHandler} defaultValue={this.props.data.hours} />
                            </div>
                            <div className='edit-box-element'>
                                Project:
                                <br />
                                <ProjectInput changeHandler={this.changeHandler} defaultValue={this.props.data.project} style={{ width: '100%' }} />
                            </div>
                            <div className='edit-box-element'>
                                Description: <textarea rows="5" id='description' placeholder="Worked on ..." required style={{ width: '100%', border: 'ridge', borderRadius: '5px', verticalAlign: 'middle' }} defaultValue={this.props.data.description} onChange={this.changeHandler} />
                            </div>
                        </Modal.Body>
                        <Modal.Footer align='left'>
                            <Button variant='danger' onClick={() => {this.deleteEntry(this.props.data)}}>Delete entry</Button>
                            <Button variant='success' type='submit'>Update Entry</Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        );
    }
}

export default EditEntry;
