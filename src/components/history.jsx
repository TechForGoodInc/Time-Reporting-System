import React, { Component } from 'react';

import HistoryBlock from './historyBlock';

import Button from 'react-bootstrap/Button';

class History extends Component {
    state = {
        histBlocks: []
    }

    loadMore() {
        let newBlocks = [...this.state.histBlocks];
        let now = new Date();
        
        //Getting start and end of the week we're loading
        let d1 = new Date(new Date().setDate(now.getDate() - now.getDay() - newBlocks.length * 7) + 1);
        let d2 = new Date(new Date(d1).setDate(d1.getDate() + 6));

        newBlocks.push({
            startDate: d1,
            endDate: d2
        })

        this.setState({
            histBlocks: newBlocks
        })
    }

    formatDate(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate();
    }

    getPreloadedBlock(startDate, endDate) {
        let start = this.formatDate(startDate);
        let end = this.formatDate(endDate);
        let data = this.props.preloadedData;
        let res = [];
        for (let i = 0; i < data.length; ++i) {
            if (data[i].date >= start && data[i].date <= end)
                res.push(data[i]);
        }

        return res;
    }

    render() {
        return (
            <div>
                <div>
                    <h3>History</h3>
                    <ul style={{ listStyleType: 'none', paddingLeft: '0px' }}>
                        {this.state.histBlocks.map((data, index) => {
                            let preloaded = this.props.preloadedData ? this.getPreloadedBlock(data.startDate, data.endDate) : null;

                            return <li key={index} style={{ marginBottom: '20px' }} >
                                <HistoryBlock startDate={data.startDate} endDate={data.endDate} getEntries={this.props.getEntries} postData={this.props.postData} delete_data={this.props.delete_data} nBlock={index} email={this.props.email} preloadedBlock={preloaded} />
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