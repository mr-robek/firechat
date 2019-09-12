import React, { Component } from 'react';
import VerticalForm from "./verticalForm";
import { withFirebase } from '../Firebase';


const INITIAL_STATE = {
    signupEmail: '',
    signupPassword1: '',
    signupPassword2: '',
    error: null
}

class SignupForm extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value});
    }
    onSubmit = event => {
        const { signupEmail, signupPassword1 } = this.state;
        this.props.firebase
          .createUserWithEmailAndPassword(signupEmail, signupPassword1)
          .then(authUser => {
              return this.props.firebase
              .user(authUser.user.uid)
              .set(signupEmail);
          })
          .then(() => {
              this.setState({ ...INITIAL_STATE });
          })
          .catch(error => {
            this.setState({ error });
          });
        event.preventDefault();
    }
    render() {
        const {
            signupEmail,
            signupPassword1,
            signupPassword2,
            error,
        } = this.state;

        const isValid = signupEmail && signupPassword1 && signupPassword1 === signupPassword2;

        return (
            <VerticalForm>
                <label htmlFor="signupEmail">Email</label>
                <input type="text" name="signupEmail" className="width250 common-input" placeholder="Enter Email" onChange={this.onChange} value={signupEmail}/>
                <label htmlFor="signupPassword1"> Password</label>
                <input type="password" name="signupPassword1" className="width250 common-input" placeholder="Enter Password" onChange={this.onChange} value={signupPassword1}/>
                <label htmlFor="signupPassword2"> Repeat Password</label>
                <input type="password" name="signupPassword2" className="width250 common-input" placeholder="Repeat Password" onChange={this.onChange} value={signupPassword2}/>
                <input type="button" className="common-input" value="Sign up" onClick={this.onSubmit} disabled={!isValid}/>
                {error && <p className="width250">{error.message}</p>}
            </VerticalForm>
        )
    }
}

export default withFirebase(SignupForm);
