import React, { Component } from 'react';

class TextInput extends Component {

    render() {
        return (
            <React.Fragment>
                <input type="text" id="description" name="description" style={this.props.style} placeholder="Worked on ..." required onChange={this.props.changeHandler} defaultValue={this.props.defaultValue}></input>
                <span className="validity"></span>
            </React.Fragment>
        );
    }
}

export default TextInput;