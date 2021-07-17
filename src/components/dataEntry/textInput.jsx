import React, { Component } from 'react';

class TextInput extends Component {

    render() {
        return (
            <React.Fragment>
                <label htmlFor="description">Description of work done</label>
                <input type="text" id="description" name="description" placeholder="Worked on ...." required onChange={this.props.changeHandler}></input>
                <span className="validity"></span>
            </React.Fragment>
        );
    }
}

export default TextInput;