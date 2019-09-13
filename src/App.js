import React, { Component } from 'react';

import LoginSignUpModal from './Components/loginSignUpModal';
import FriendsBox from './Components/friendsBox';
import ChatBox from './Components/chatBox';

import  { withFirebase } from './Firebase';

const cid = (uidA, uidB) => {
    return uidA < uidB ? `${uidA}<=>${uidB}` : `${uidB}<=>${uidA}`
}

const DEFAULT_APP_STATE = {
    currentUser: null,
    users: null,
    selectedUser: null,
    onAuthStateChanged: false,
    chatBoxState: null,
    chatBoxMessages: null,
    notifs: {}
}
const getUserUid = (user) => user && user.uid;

const areSameUsers = (userA, userB) => getUserUid(userA) && (getUserUid(userA) === getUserUid(userB));

class Message {
    constructor(senderUid, receiverUid, content) {
        this.timestamp = new Date().getTime();
        this.sender = senderUid;
        this.receiver = receiverUid;
        this.content = content;
    }
}
class Notif {
    constructor(messageid, channelid) {
        this.messageid = messageid;
        this.channelid = channelid;
        this.seen = false;
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { ...DEFAULT_APP_STATE }
        const { firebase } = this.props;
        firebase.auth.onAuthStateChanged( user => {
            // cleanup
            firebase.users().off();
            // remove notif listner when user logged out (user is null, currentUser is previous logged in user)
            getUserUid(this.state.currentUser) && firebase.notif(getUserUid(this.state.currentUser)).off();

            // is user logged in?
            if (getUserUid(user)) {
                //fetch data for user/emails list
                firebase.users().on("child_added", snapshot => {
                    this.setState({ users: {...this.state.users, ...{[snapshot.key]:snapshot.val()}} });
                }, console.log)
                const handleNotif = snapshot => {
                    // read the message instantly, update db
                    if (getUserUid(this.state.selectedUser) === snapshot.key)
                        firebase.notif(getUserUid(user)).child(getUserUid(this.state.selectedUser)).update({seen: true});
                    else
                        this.setState({ notifs: {...this.state.notifs, ...{[snapshot.key]:snapshot.val()}} });
                };
                firebase.notif(user.uid).on("child_added", handleNotif, console.log);
                firebase.notif(user.uid).on("child_changed", handleNotif, console.log)
            }
            this.setState({ ...DEFAULT_APP_STATE, currentUser: user, onAuthStateChanged: true});
        });
    }

    onUserSelected = newSelectedUser => {
        const { currentUser, selectedUser } = this.state;
        const { firebase } = this.props;

        if (!areSameUsers(selectedUser, newSelectedUser)) {
            // remove previous .on(value) listener
            if (selectedUser)
                firebase.channel(cid(selectedUser.uid, currentUser.uid)).off();

            firebase.channel(cid(newSelectedUser.uid, currentUser.uid)).on('value', snapshot => {
                this.setState({selectedUser: newSelectedUser, chatBoxMessages: snapshot.val()})
            })
            if (!areSameUsers(currentUser, newSelectedUser) && this.state.notifs[newSelectedUser.uid])
                firebase.notif(currentUser.uid).child(newSelectedUser.uid).update({seen: true});
            this.setState({selectedUser: newSelectedUser, chatBoxMessages: null});
        }
    }
    onMessageSubmit = message => {
        const { currentUser, selectedUser } = this.state;
        const { firebase } = this.props;
        console.log(`Sending new message from ${currentUser.email} to ${selectedUser.email}`);
        const channelid = cid(selectedUser.uid, currentUser.uid);
        const newMessageRef = firebase.channels().child(channelid).push();
        newMessageRef.set(new Message(currentUser.uid, selectedUser.uid, message), console.log)
        .then(() => {
            if (!areSameUsers(selectedUser, currentUser)) {
                console.log(`Sending new notif from ${currentUser.email} to ${selectedUser.email}`)
                firebase.notifs().child(selectedUser.uid).child(currentUser.uid).update(new Notif(newMessageRef.key,channelid), console.log);
            }
        });
    }

    render() {
        return (
            <div>
                <div className="flex-row" style={{border: "1px solid var(--primary-bg-color)"}}>
                    <ChatBox currentUser={this.state.currentUser} selectedUser={this.state.selectedUser} chatBoxState={this.state.chatBoxState} chatBoxMessages={this.state.chatBoxMessages} onMessageSubmit={this.onMessageSubmit}/>
                    <FriendsBox currentUser={this.state.currentUser} selectedUser={this.state.selectedUser} onUserSelected={this.onUserSelected} users={this.state.users} notifs={this.state.notifs}/>
                </div>
                <LoginSignUpModal currentUser={this.state.currentUser} onAuthStateChanged={this.state.onAuthStateChanged}/>
            </div>
        );
    }
}

export default withFirebase(App);
