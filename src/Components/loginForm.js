import React, { Component } from 'react';
import VerticalForm from "./verticalForm";
import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
    loginEmail: '',
    loginPassword: '',
    error: null
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
    }
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value});
    }
    onSubmit = event => {
        const { loginEmail, loginPassword } = this.state;
        const { firebase } = this.props;
        firebase.signInWithEmailAndPassword(loginEmail, loginPassword)
        .then(authUser => { this.setState({ ...INITIAL_STATE }) })
        .catch(error => { this.setState({ error }) });
        event.preventDefault();
    }
    render() {
        const {
            loginEmail,
            loginPassword,
            error,
        } = this.state;

        const isValid = loginEmail && loginPassword;

        return (
            <VerticalForm>
                <label htmlFor="loginEmail">Email</label>
                <input type="text" name="loginEmail" className="width250 common-input" placeholder="Enter Email" onChange={this.onChange} value={loginEmail}/>
                <label htmlFor="loginPassword"> Password</label>
                <input type="password" name="loginPassword" className="width250 common-input" placeholder="Enter Password" onChange={this.onChange} value={loginPassword}/>
                <input type="button" className="common-input" value="Login" disabled={!isValid} onClick={this.onSubmit}/>
                {error && <p className="width250">{error.message}</p>}
            </VerticalForm>
        )
    }
}

export default withFirebase(LoginForm);
