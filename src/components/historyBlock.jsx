import React, { Component } from 'react';

import Table from 'react-bootstrap/Table';

class HistoryBlock extends Component {
    state = {
        totalHours: null,
        entries: []
    }

    componentDidMount() {
        if (this.state.totalHours === null) {
            this.props.getEntries(this.props.startDate, this.props.endDate).then((e) => {
                this.setState({ entries: e });
            }).then(() => {
                this.getTotalHours();
            })
        }
    }

    //Sets state property totalHours to the total hours in the date being shown
    getTotalHours() {
        let sum = 0;
        for (let entry of this.state.entries) {
            sum += parseInt(entry['hours']);
        }
        this.setState({ totalHours: sum });
    }

    getDay() {
        let today = new Date();
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        let lastWeek = new Date(new Date().setDate(new Date().getDate() - 6));
        let d1 = this.props.startDate;
        let d2 = this.props.endDate;
        today.setHours(12, 0 - today.getTimezoneOffset(), 0, 0);
        yesterday.setHours(12, 0 - yesterday.getTimezoneOffset(), 0, 0);
        lastWeek.setHours(12, 0 - lastWeek.getTimezoneOffset(), 0, 0);
        d1.setHours(12, 0 - d1.getTimezoneOffset(), 0, 0);
        d2.setHours(12, 0 - d2.getTimezoneOffset(), 0, 0);

        if (d1 - d2 !== 0) {
            return (d1.getMonth() + 1) + '/' + d1.getDate() + '/' + d1.getFullYear() + ' - ' + (d2.getMonth() + 1) + '/' + d2.getDate() + '/' + d2.getFullYear();
        }

        if (today - d1 === 0) {
            return 'Today';
        } else if (yesterday <= d1) {
            return 'Yesterday';
        } else if (lastWeek <= d1) {
            switch (d1.getDay()) {
                case 0:
                    return 'Sunday';
                    break;
                case 1:
                    return 'Monday';
                    break;
                case 2:
                    return 'Tuesday';
                    break;
                case 3:
                    return 'Wednesday';
                    break;
                case 4:
                    return 'Thursday';
                    break;
                case 5:
                    return 'Friday';
                    break;
                case 6:
                    return 'Saturday';
                    break;
                default:
                    return 'Error';
            }
        } else {

            return (d1.getMonth() + 1) + '/' + d1.getDate() + '/' + d1.getFullYear();
        }
    }

    //TODO Redesign this
    render() {
        return (
            <div>
                <div align="center">{this.getDay()}</div>
                <div align="right">Total Hours: {this.state.totalHours}</div>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Hours</th>
                            <th>Edit</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.entries.map((data, index) => {
                            return <tr key={index} id={data.id}>
                                <td>
                                    <p>{data.project}</p>
                                </td>
                                <td width='70%'>
                                    <p>{data.desc}</p>
                                </td>
                                <td>
                                    <p>{data.date}</p>
                                </td>
                                <td align="center">
                                    <p>{data.hours}</p>
                                </td>
                                
                                <td width="5%">
                                    <button style={{ border: 'none' }}><img src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-512.png" width="30" height="30"></img></button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </Table>
            </div>
    )};
}

export default HistoryBlock;
