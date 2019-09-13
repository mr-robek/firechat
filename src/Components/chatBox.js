import React, {Component} from 'react';
import  { withFirebase } from '../Firebase';

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
        return (currentUser && !selectedUser) ? "Please select a chat to start messaging" : ""
    }

    chatWithInfo() {
        const { currentUser, selectedUser } = this.props;
        return (currentUser && selectedUser) ? `Chat with ${selectedUser.email}` : ""
    }

    onSubmit = event => {
        event.preventDefault();
        const { onMessageSubmit } = this.props;
        onMessageSubmit(this.state.message);
        this.setState({message: ''});
    }
    render() {
        const didISend = message => message.sender === this.props.currentUser.uid;

        return (
            <div style={{ flexGrow: 1 }}>
            <p className="chat-hint">{ this.chatWithInfo() || this.selectChatInfo() || " " }</p>
            <div style={{height: "465px", overflowY: "scroll", backgroundColor: "#2c3e50", color: "white"}}>
                <ul className="flex-column" style={{flexGrow: 1}}>
                { this.props.currentUser && Object.entries(this.props.chatBoxMessages || {}).map(v =>
                    <li className="message" style={{alignSelf: didISend(v[1]) ? "flex-end" : "flex-start"}} key={v[0]}>{v[1].content}</li>
                )}
            </ul>
            <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }}/>
            </div>
            <form className="flex-row message-form" onSubmit={this.onSubmit}>
            <input type="text" className="message-input" autoComplete="off" placeholder="Write a message..." name="message" onChange={this.onChange} value={this.state.message}/>
            <button className="message-button" disabled={!this.props.selectedUser || !this.state.message}>Send</button>
            </form>
            </div>
        )
    }

}

export default withFirebase(ChatBox);
