import React, { Component } from 'react';

class ProjectInput extends Component {

    render() {
        return (
            <React.Fragment>
                <select id="project" name="project" onChange={this.props.changeHandler}>
                    <option value="unselected">Select a Project</option>
                    <option value="Flant">Flant</option>
                    <option value="IDDPS">IDDPS</option>
                    <option value="Mission Uplink">Mission Uplink</option>
                    <option value="Make The Stars">Make The Stars</option>
                    <option value="OSSFTGG">OSSFTGG</option>
                    <option value="TFG Website">TFG Website</option>
                    <option value="Assurance">Assurance</option>
                    <option value="Project Interactivity">Project Interactivity</option>
                    <option value="Blockchain Donations">Blockchain Donations</option>
                    <option value="Re-Right">Re-Right</option>
                    <option value="FireSpot">FireSpot</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Other">Other</option>
                </select>
            </React.Fragment>
        );
    }
}

export default ProjectInput;