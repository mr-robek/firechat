import React, { Component } from 'react';
import  { withFirebase } from '../Firebase';
import StatusBar from './statusBar';
import Loader from './loader';

class FriendsBox extends Component {
    render() {
        const {onUserSelected, selectedUser, currentUser, users, notifs} = this.props;
        const shouldNotify = (uid) => (!selectedUser || selectedUser.uid !== uid) && notifs && notifs[uid] && !notifs[uid].seen;
        return (
            <div className="width350 vl">
                <h3 className="logo-text">FireChat</h3>
                <div style={{overflowY: "auto", height: "400px"}}>
                <h5 style={{paddingLeft: "25px"}}>USERS:</h5>
                <ul style={{listStyle: "none"}}>
                    { (!currentUser || !users ) && <Loader/> }
                        { currentUser && Object.entries(users || {}).map(v =>
                            <li key={v[0]}>
                                <span style={{color: "var(--focus-color)", marginLeft: shouldNotify(v[0]) ? "-25px" : "18px"}}>{ shouldNotify(v[0]) && " [new] " }</span>
                                <a href="#" onClick={ () => onUserSelected({uid: v[0], email: v[1]}) }>{v[1]}</a>
                            </li>
                        )}
                    </ul>
                </div>
                <StatusBar currentUser={currentUser}/>
            </div>
        )
    }
}
export default withFirebase(FriendsBox);
