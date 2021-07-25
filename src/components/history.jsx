import React, { Component } from 'react';

import HistoryBlock from './historyBlock';

import Button from 'react-bootstrap/Button';

class History extends Component {
    state = {
        histBlocks: []
    }

    loadMore() {
        let newBlocks = [...this.state.histBlocks];
        if (newBlocks.length === 0) { //Historn not shown
            let d1 = new Date();
            d1.setHours(12, 0 - d1.getTimezoneOffset(), 0, 0);
            newBlocks.push({
                //startDate: d1.getFullYear() + '-' + (d1.getMonth() + 1 < 10 ? '0' : '') + (d1.getMonth() + 1) + '-' + d1.getDate(),
                //endDate: d1.getFullYear() + '-' + (d1.getMonth() + 1 < 10 ? '0' : '') + (d1.getMonth() + 1) + '-' + d1.getDate()
                startDate: d1,
                endDate: d1
            })
        }
        else if (newBlocks[newBlocks.length] < 6) { //Only showing the past week (or less)
            let d1 = new Date(new Date().setDate(new Date().getDate() - newBlocks.length));
            newBlocks.push({
                //startDate: d1.getFullYear() + '-' + (d1.getMonth() + 1 < 10 ? '0' : '') + (d1.getMonth() + 1) + '-' + d1.getDate(),
                //endDate: d1.getFullYear() + '-' + (d1.getMonth() + 1 < 10 ? '0' : '') + (d1.getMonth() + 1) + '-' + d1.getDate()
                startDate: d1,
                endDate: d1
            })
        }
        else { //Clicking show more history will begin to show entries by week
            //let d1 = new Date(new Date().setDate(new Date().getDate() - (newBlocks.length - 7)));
            //let d2 = new Date(new Date(d1).setDate(d1.getDate() - 7 * ))
            //newBlocks.push({
            //    startDate: d1.getFullYear() + '-' + (d1.getMonth() + 1 < 10 ? '0' : '') + (d1.getMonth() + 1) + '-' + d1.getDate(),
            //    endDate: d1.getFullYear() + '-' + (d1.getMonth() + 1 < 10 ? '0' : '') + (d1.getMonth() + 1) + '-' + d1.getDate()
            //})
        }

        this.setState({
            histBlocks: newBlocks
        })
    }

    //TODO make a list of HistoryBlocks. First one displays today's entries, 
    //second displays yesterday's, individual ones for each day of the past week, 
    //then start making a HistoryBlock for each week before that. 
    //ONLY LOAD ENTRIES IF USER CLICKS BUTTON SAYING SHOW HISTORY
    render() {
        
        let showHist = false;
        return (
            <div>
                {/*This history block is just for testing*/}
                <HistoryBlock startDate={new Date()} endDate={new Date()} getEntries={this.props.getEntries}></HistoryBlock>
                <HistoryBlock startDate={new Date(new Date().setDate(new Date().getDate() - 7))} endDate={new Date(new Date().setDate(new Date().getDate() - 1))} getEntries={this.props.getEntries}></HistoryBlock>

                <div>
                    <ul>
                        {this.state.histBlocks.map((data, index) => {
                            return <li>
                                    <HistoryBlock startDate={data.startDate} endDate={data.endDate} getEntries={this.props.getEntries}></HistoryBlock>
                                </li>
                        })}
                    </ul>
                </div>
                <Button onClick={() => { this.loadMore(); showHist = !showHist; }}>{(this.state.histBlocks.length > 0) ? 'Load More' : 'Show History'}</Button>
            </div>
        );
    }
}

export default History;