import React, { Component } from 'react';
import Modal from "./modal";
import LoginForm from "./loginForm";
import SignupForm from "./signupForm";
import Loader from './loader'
class LoginSignUpModal extends Component {

    render() {
        const { currentUser, onAuthStateChanged } = this.props;
        const modalBody =
            onAuthStateChanged ?
            <div style={{color: "black"}}>
                <h3> Welcome to Firechat v0.0.1. Please login or signup to start chatting.</h3>
                <div className="inline-flex-row">
                    <LoginForm/>
                    <p style={{height: "100%", margin: "auto 40px"}}>or</p>
                    <SignupForm/>
                </div>
            </div> :
            <Loader/>

        return (
            <Modal show={!currentUser}>
                {modalBody}
            </Modal>
        );
    }
}
export default LoginSignUpModal;
