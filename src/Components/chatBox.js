import React, {Component} from 'react';
import  { withFirebase } from '../Firebase';

const ANNONYMOUS = {
    email: "Annonymous"
}

class ChatBox extends Component {

    constructor(props) {
        super(props);
        this.state = { message: '' };
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ block: "end" });
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value});
    }

    selectChatInfo = () => {
        const { currentUser, selectedUser } = this.props;
        return currentUser && !selectedUser && <p style={{paddingLeft: "25px"}}> Please select a chat to start messaging</p>;
    }

    chatWithInfo() {
        const { currentUser, selectedUser } = this.props;
        return currentUser && selectedUser && <p style={{paddingLeft: "25px"}}>Chat with {selectedUser.email}</p>;
    }
    onSubmit = event => {
        event.preventDefault();
        const { onMessageSubmit } = this.props;
        onMessageSubmit(this.state.message);
        this.setState({message: ''});
    }
    render() {
        return (
            <div style={{ flexGrow: 1 }}>
            { this.chatWithInfo() || this.selectChatInfo()}
            <div style={{height: "465px", overflowY: "scroll", backgroundColor: "whitesmoke"}}>
                <ul className="flex-column" style={{flexGrow: 1}}>
            { Object.entries(this.props.chatBoxMessages || {}).map(v =>
                <li className="message" style={{alignSelf: v[1].receiver === this.props.currentUser.uid ? "flex-start" : "flex-end"}} key={v[0]}>{v[1].content}</li>
            )}
            </ul>
            <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }}/>
            </div>
            <form style={{display: "flex"}} onSubmit={this.onSubmit}>
            <input type="text" style={{ width:"100%", height: "30px"}} name="message" onChange={this.onChange} value={this.state.message}/>
            <button style={{width: "100px"}} disabled={!this.props.selectedUser}>Send</button>
            </form>
            </div>
        )
    }

}

export default withFirebase(ChatBox);
