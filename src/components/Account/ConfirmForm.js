import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import './Account.css';
import { Navigate, useNavigate } from "react-router-dom";

export default function ConfirmForm() {
    const [username, setUsername] = React.useState('');
    const [confirmationCode, setConfirmationCode] = React.useState('');
    const [confirmed, setConfirmed] = React.useState(false);

    const navigate = useNavigate();
    function handleSubmit(e) {
        e.preventDefault();

        Auth.confirmSignUp(username, confirmationCode)
            .then(() => {
                setConfirmed(true);
                navigate('/account/signin');
            })
            .catch(error => console.log(error))

    };

    function handleChange(e) {
        if(e.target.name === "username") {
            setUsername(e.target.value);
        } else if(e.target.name === "confirmationCode") {
            setConfirmationCode(e.target.value);
        }
    };

    return (
        <div className="account-wrapper">
            <div className="account-section">
                <div className="container-wrapper">
                    <h4>Confirm Account</h4>
                    <div className="line" />
                    <p className="confirm-info">Please check your phone or email address for the 6-digit confirmation code.</p>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="username" placeholder="username" value={username} onChange={handleChange} />
                        <input type="text" name="confirmationCode" placeholder="confirmation code" onChange={handleChange} />
                        <button>Confirm</button>
                    </form>
                </div>
            </div>
        </div>
    )
    
}
