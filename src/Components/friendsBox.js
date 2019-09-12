import React, { Component } from 'react';
import  { withFirebase } from '../Firebase';
import StatusBar from './statusBar';

class FriendsBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: null,
            selectedUser: null
        };
    }
    componentDidMount() {
        this.props.firebase.users().on("value", snapshot => {
            this.setState({users: snapshot.val()});
        })
    }

    render() {
        return (
            <div className="width350 vl">
                <h3 className="logo-text">FireChat</h3>
                <div style={{overflowY: "auto", height: "400px"}}>
                    { (!this.props.currentUser || !this.state.users) && <p style={{textAlign: "center"}}>N/A</p> }
                    <ul>
                        { this.props.currentUser && Object.entries(this.state.users || {}).map(v =>
                            <li key={v[0]}><a href="#" onClick={ () => this.props.onUserSelected({uid: v[0], email: v[1]}) }>{v[1]}</a></li>
                        )}
                    </ul>
                </div>
                <StatusBar currentUser={this.props.currentUser}/>
            </div>
        )
    }
}
export default withFirebase(FriendsBox);
