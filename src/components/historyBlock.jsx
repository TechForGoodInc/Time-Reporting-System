import React, { Component } from 'react';

import Table from 'react-bootstrap/Table';

import entryData from './dataEntry/entryData.js';
import EditEntry from './editEntry.jsx';

class HistoryBlock extends Component {
    state = {
        totalHours: null,
        entries: []
    }

    componentDidMount() {
        if (this.state.totalHours === null) {
            this.props.getEntries(this.props.startDate, this.props.endDate).then((e) => {
                this.setState({ entries: e.reverse() });
            }).then(() => {
                this.getTotalHours();
            })
        }
    }

    //Sets state property totalHours to the total hours in the date being shown
    getTotalHours() {
        let sum = 0;
        for (let entry of this.state.entries) {
            sum += parseFloat(entry['hours']);
        }
        this.setState({ totalHours: sum });
    }

    getHeader() {
        let d1 = this.props.startDate;
        let d2 = this.props.endDate;

        if (this.props.nBlock === 0) return 'This week';
        else if (this.props.nBlock === 1) return 'Last week'
        else return (d1.getMonth() + 1) + '/' + d1.getDate() + '/' + d1.getFullYear() + ' - ' + (d2.getMonth() + 1) + '/' + d2.getDate() + '/' + d2.getFullYear();
    }


    removeEntry = (index) => {
        let temp = this.state.entries;
        temp.splice(index, 1);
        this.setState({ entries: temp });
        this.getTotalHours();
    }

    insertIntoHistory = (data) => {
        let temp = this.state.entries;
        temp.push(data)
        this.setState({ entries: temp });
        this.getTotalHours();
    }

    render() {
        return (
            <div style={{ border: '2px solid rgba(0, 0, 0, 0.05)', borderRadius: '5px', padding: '20px', background: 'white' }}>
                <div>
                    <h6 align="center">{this.getHeader()}</h6>
                    <h6 align="right">Total Hours: {this.state.totalHours && this.state.totalHours.toFixed(1)}</h6>
                </div>
                {(this.state.totalHours === 0) ? <h6>You have no entries for this date</h6> :
                    (this.state.entries.length === 0) ? <h6 align='center'>Loading...</h6> :
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th>Project</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Hours</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.entries.map((data, index) => {
                                    return <tr key={index} id={data.id}>
                                        <td>
                                            <p>{data.project}</p>
                                        </td>
                                        <td style={{ width: '50%', overflowWrap: 'anywhere' }}>
                                            <p>{data.description}</p>
                                        </td>
                                        <td>
                                            <p>{data.date}</p>
                                        </td>
                                        <td align="center">
                                            <p>{data.hours}</p>
                                        </td>
                                        <td width="5%" style={{ border: 'none' }} align="center">
                                            <EditEntry postData={this.props.postData} delete_data={this.props.delete_data} data={data}
                                                removeFromHistory={() => {this.removeEntry(index);}}
                                                insertIntoHistory={this.insertIntoHistory}
                                            />
                                        </td>

                                    </tr>
                                })}
                            </tbody>
                        </Table>
                }
            </div>
        )
    };
}

export default HistoryBlock;
