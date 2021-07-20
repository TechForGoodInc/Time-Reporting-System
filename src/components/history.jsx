import React, { Component } from 'react';
import ProjectInput from "./dataEntry/projectInput";
import DateInput from "./dataEntry/dateInput";

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

    render() {
        return (
            <div>
                <ProjectInput changeHandler={this.changeHandler} />
                <DateInput changeHandler={this.changeHandler} />
                <button onClick={this.viewHistory}>View History</button>
                <table id="customers">
                    <tbody>
                    {this.props.list.map((data) => {
                        return <tr key = {data.id} id={data.id} >
                            {/*<td>*/}
                            {/*    <input type="text" readOnly={true} defaultValue={this.props.date} />*/}
                            {/*</td>*/}
                            <td>
                                <input type="text" readOnly={true} value={data.hours} />
                            </td>
                            <td>
                                <input type="text" readOnly={true} value={data.work} />
                            </td>
                            <td>
                                <button >Delete</button>
                            </td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default History;