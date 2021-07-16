import React, { Component } from 'react';
import HistoryBtn from "./historyBtn";

class History extends Component {
    render() {
        return (
            <div>

                <tr id={this.props.index} className="alt">
                    <td>
                        <input type="text" readOnly={true} defaultValue={this.props.date} />
                    </td>
                    <td>
                        <input type="text" readOnly={true} defaultValue={this.props.hours} />
                    </td>
                    <td>
                        <input type="text" readOnly={true} defaultValue={this.props.work} />
                    </td>
                    <td>
                        <button >Delete</button>
                    </td>
                </tr>
            </div>
        );
    }
}

export default History;