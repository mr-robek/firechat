import React, { Component } from 'react';

import LoginSignUpModal from './Components/loginSignUpModal';
import FriendsBox from './Components/friendsBox';
import ChatBox from './Components/chatBox';

import  { withFirebase } from './Firebase';

const cid = (uidA, uidB) => {
    return uidA < uidB ? `${uidA}<=>${uidB}` : `${uidB}<=>${uidA}`
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            selectedUser: null,
            onAuthStateChanged: false,
            chatBoxState: null,
            chatBoxMessages: null
        }
        this.props.firebase.auth.onAuthStateChanged(function(user) {
            this.setState({ currentUser: user, onAuthStateChanged: true });
        }.bind(this));
    }

    onUserSelected = newSelectedUser => {
        const { currentUser, selectedUser } = this.state;
        const { firebase } = this.props;
        console.log("onUserSelected:", newSelectedUser);
        if (!selectedUser || selectedUser.uid !== newSelectedUser.uid) {
            if (selectedUser)
                firebase.channel(cid(selectedUser.uid, currentUser.uid)).off();

            firebase.channel(cid(newSelectedUser.uid, currentUser.uid)).on('value', snapshot => {
                console.log("got new snapshot value:", snapshot.val());
                console.log(this)
                this.setState({selectedUser: newSelectedUser, chatBoxState: "LOADED", chatBoxMessages: snapshot.val()})
            })

            this.setState({selectedUser: newSelectedUser, chatBoxState: "LOADING", chatBoxMessages: null});
        }
    }
    onMessageSubmit = message => {
        const { currentUser, selectedUser } = this.state;
        const { firebase } = this.props;
        firebase.channels().child(cid(selectedUser.uid, currentUser.uid)).push().set({
            timestamp: new Date().getTime(),
            sender: currentUser.uid,
            receiver: selectedUser.uid,
            content: message
        }, console.log)
    }

    render() {
        return (
            <div>
                <div className="flex-row" style={{border: "1px solid gray"}}>
                    <ChatBox currentUser={this.state.currentUser} selectedUser={this.state.selectedUser} chatBoxState={this.state.chatBoxState} chatBoxMessages={this.state.chatBoxMessages} onMessageSubmit={this.onMessageSubmit}/>
                    <FriendsBox currentUser={this.state.currentUser} onUserSelected={this.onUserSelected}/>
                </div>
                <LoginSignUpModal currentUser={this.state.currentUser} onAuthStateChanged={this.state.onAuthStateChanged}/>
            </div>
        );
    }
}

export default withFirebase(App);
