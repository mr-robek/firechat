import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

class StatusBar extends Component {

    render() {
        const { currentUser } = this.props;
        return (
            <div style={{ height: "75px", textAlign: "center"}}>
            { currentUser &&
                <span>
                <p>
                    LOGGED IN AS <b> {currentUser.email} </b>
                </p>
                <a href="#" onClick={this.props.firebase.signOut}>LOGOUT</a>
                </span>
            }
            </div>
        )
    }
}

export default withFirebase(StatusBar);
