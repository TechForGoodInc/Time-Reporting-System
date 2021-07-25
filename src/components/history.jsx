import React, { Component } from 'react';

import HistoryBlock from './historyBlock';

import Button from 'react-bootstrap/Button';

class History extends Component {
    state = {
        histBlocks: []
    }

    //getNextEntries = async () => {
    //    let db = firebase.firestore();
    //    let res = []; //Resulting array containing next block of entries








    //    let projects = await db.collection('employees').get();

    //    //Goes through each project in the list of projects
    //    for (const doc of projects.docs) {

    //        let d = histBlocks.length > 0 ? histBlocks[histBlocks.length - 1].startDate : new Date().setHours(12, 0 - new Date().getTimezoneOffset(), 0, 0);
    //        let dString = d.getFullYear() + '-' + (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1) + '-' + d.getDate();

    //        console.log('dString =', dString);

    //        //Value becomes a list of entries in the date range in this current project
    //        let temp = await db.collection('employees').doc(doc.id).collection(this.props.email).orderBy('Date', 'desc').startAt(dString).limit(7).get().then(async (query) => {

    //            //Temp array to store list of entries in this project that are in range
    //            let inRangeEntries = [];

    //            //For every entry by this user in this project
    //            for (const entry of query.docs) {
    //                let entryDate = new Date(entry.id + 'T12:00:00+00:00');

    //                //Setting every time to the same time to avoid errors with timezones
    //                startDate.setHours(12, 0 - startDate.getTimezoneOffset(), 0, 0);
    //                endDate.setHours(12, 0 - endDate.getTimezoneOffset(), 0, 0);

    //                //If date is in range, add it to the array
    //                if (startDate <= entryDate && entryDate <= endDate) {

    //                    //Goes through all entries in a specific date
    //                    for (let j = 0; j < entry.data().Entries.length; ++j) {
    //                        try {
    //                            inRangeEntries.push({
    //                                project: doc.id,
    //                                date: entry.id,
    //                                hours: entry.data().Entries[j]['Entry ' + (j + 1).toString()].Hours,
    //                                desc: entry.data().Entries[j]['Entry ' + (j + 1).toString()].Work_Performed
    //                            })
    //                        } catch (error) {
    //                            console.log('Error collecting entries:', error);
    //                        }
    //                    }
    //                }
    //            }
    //            //If there were no entries by the user in this project, return undefined
    //            if (inRangeEntries.length === 0) return undefined;

    //            return inRangeEntries;
    //        })

    //        if (temp !== undefined) res = res.concat(temp);

    //    }

    //    console.log('All entries between', startDate, 'and', endDate, '=', res);
    //    return res.reverse();
    //}

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
            let d1 = new Date(new Date().setDate(new Date().getDate() - (newBlocks.length - 7 + 2) * 7));
            let d2 = new Date(new Date(d1).setDate(d1.getDate() + 7));

            newBlocks.push({
                startDate: d1,
                endDate: d2
            })
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
                {/* This history block is just for testing
                <HistoryBlock startDate={new Date()} endDate={new Date()} getEntries={this.props.getEntries}></HistoryBlock>
                <HistoryBlock startDate={new Date(new Date().setDate(new Date().getDate() - 7))} endDate={new Date(new Date().setDate(new Date().getDate() - 1))} getEntries={this.props.getEntries}></HistoryBlock>
                */}

                <div>
                    <ul style={{ listStyleType: 'none', padding: '0'}}>
                        {this.state.histBlocks.map((data, index) => {
                            return <li key={index}>
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