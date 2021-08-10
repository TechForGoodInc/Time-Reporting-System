import React, { Component } from 'react';

import HistoryBlock from './historyBlock';

import Button from 'react-bootstrap/Button';

class History extends Component {
    state = {
        histBlocks: []
    }

    loadMore() {
        let newBlocks = [...this.state.histBlocks];
        if (newBlocks.length === 0) { //History not shown
            let d1 = new Date();
            d1.setHours(12, 0 - d1.getTimezoneOffset(), 0, 0);
            newBlocks.push({
                startDate: d1,
                endDate: d1
            })
        }
        else if (newBlocks.length < 7) { //Only showing the past week (or less)
            let d1 = new Date(new Date().setDate(new Date().getDate() - newBlocks.length));
            newBlocks.push({
                startDate: d1,
                endDate: d1
            })
        }
        else { //Clicking show more history will begin to show entries by week
            let d1 = new Date(new Date().setDate((new Date().getDate() - (newBlocks.length - 7 + 2) * 7)+1));
            let d2 = new Date(new Date(d1).setDate(d1.getDate() + 6));

            newBlocks.push({
                startDate: d1,
                endDate: d2
            })
        }

        this.setState({
            histBlocks: newBlocks
        })
    }

    render() {
        
        return (
            <div>
                <div>
                    <h3>History</h3>
                    <ul style={{ listStyleType: 'none', paddingLeft: '0px' }}>
                        {this.state.histBlocks.map((data, index) => {
                            return <li key={index} style={{ marginBottom: '20px' }} >
                                <HistoryBlock startDate={data.startDate} endDate={data.endDate} getEntries={this.props.getEntries} postData={this.props.postData} delete_data={this.props.delete_data} />
                            </li>
                        })}
                    </ul>
                </div>
                <Button variant='secondary' style={{ width: '100%' }} onClick={() => { this.loadMore();}}>{(this.state.histBlocks.length > 0) ? 'Load More' : 'Show History'}</Button>
            </div>
        );
    }
}

export default History;