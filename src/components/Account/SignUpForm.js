import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { Auth } from 'aws-amplify';
import './Account.css';
import validator from 'email-validator';

export default class SignUpForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            email: '',
            phone_number: '',
            confirmationCode: '',
            signedUp: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const { signedUp, username, password, email, phone_number, confirmationCode } = this.state;
        let parametersPass = false;
        const formattedPhoneNumber = phone_number.replace(/\D/g,"");

        parametersPass = this.checkParameters(parametersPass, username, password, email, formattedPhoneNumber);

        console.log(parametersPass);

        if(parametersPass) {
            Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                    phone_number: '+1' + formattedPhoneNumber
                }
            })
                .then(() => console.log('signed up'))
                .catch(error => console.log(error))

            this.setState({
                signedUp: true,
                username: '',
                password: ''
            });
        } else {
            console.log('show red lines');
        }

    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    checkParameters(parametersPass, username, password, email, formattedPhoneNumber) {
        if (username.length > 0 &&
            password.length > 7 &&
            validator.validate(email) &&
            formattedPhoneNumber.length == 10){

            document.getElementById('formUsername').classList.remove('invalid');
            document.getElementById('formPassword').classList.remove('invalid');
            document.getElementById('formEmail').classList.remove('invalid');
            document.getElementById('formPhone').classList.remove('invalid');

            
            document.getElementById('username-invalid').classList.remove('visible');
            document.getElementById('password-invalid').classList.remove('visible');
            document.getElementById('email-invalid').classList.remove('visible');
            document.getElementById('phone-invalid').classList.remove('visible');

            parametersPass = true;
            return parametersPass;
        }

        if (username.length <= 0) {
            console.log('username invalid');
            document.getElementById('formUsername').classList.add('invalid');
            document.getElementById('username-invalid').classList.add('visible');
        } else {
            document.getElementById('formUsername').classList.remove('invalid');
            document.getElementById('username-invalid').classList.remove('visible');
        }
        
        if (password.length < 8) {
            console.log('password invalid');
            document.getElementById('formPassword').classList.add('invalid');
            document.getElementById('password-invalid').classList.add('visible');
        } else {
            document.getElementById('formPassword').classList.remove('invalid');
            document.getElementById('password-invalid').classList.remove('visible');
        }

        if(!validator.validate(email)) {
            console.log('email invalid');
            document.getElementById('formEmail').classList.add('invalid');
            document.getElementById('email-invalid').classList.add('visible');
        } else {
            document.getElementById('formEmail').classList.remove('invalid');
            document.getElementById('email-invalid').classList.remove('visible');
        }

        if (formattedPhoneNumber.length !== 10) {
            console.log('phone number invalid');
            document.getElementById('formPhone').classList.add('invalid');
            document.getElementById('phone-invalid').classList.add('visible');
        } else {
            document.getElementById('formPhone').classList.remove('invalid');
            document.getElementById('phone-invalid').classList.remove('visible');
        }
        
    }

    render() {
        const { signedUp } = this.state;

        if (signedUp) {
            return <Redirect to='/account/confirm' />
        } else {
            return (
                <div className="account-wrapper">
                    <div className="account-section">
                        <div className="container-wrapper">
                            <h4>Create Account</h4>
                            <div className="line" />
                            <form onSubmit={this.handleSubmit}>
                                <input id="formUsername" type="text" name="username" placeholder="username" onChange={this.handleChange} />
                                <p id="username-invalid" className="invalid-text">please enter a username</p>
                                <input id="formPassword" type="password" name="password" placeholder="password" onChange={this.handleChange} />
                                <p id="password-invalid" className="invalid-text">password must be at least 8 characters</p>
                                <input id="formEmail" type="text" name="email" placeholder="email address" onChange={this.handleChange} />
                                <p id="email-invalid" className="invalid-text">please enter a valid email address</p>
                                <input id="formPhone" type="text" name="phone_number" placeholder="phone number" onChange={this.handleChange} />
                                <p id="phone-invalid" className="invalid-text">please enter a 10 digit phone number</p>
                                {/* <p>all fields required</p> */}
                                <button>Sign Up</button>
                            </form>
                            <a href="/account/signin">Sign In To Your Account</a>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
