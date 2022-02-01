import React, { Component, useContext } from 'react';
import { Navigate } from "react-router-dom";
import { Auth } from 'aws-amplify';
import './Account.css';
import { AuthContext } from '../../authContext';

export default function SignInForm() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [navigate, setNavigate] = React.useState(null);

    const {setCurrentUser} = useContext(AuthContext);


    async function handleSubmit(e) {
        e.preventDefault(); // make sure this is necessary
        
        await Auth.signIn({
            username,
            password
        })
            .then(() => console.log('signed in'))
            .catch(error => {
                if(error.code = "UserNotConfirmedException") {
                        try {
                            Auth.resendSignUp(username);
                            console.log('code resent succesfully');
                            setNavigate('/account/confirm');
                        } catch (err) {
                            console.log('error resending code: ', err);
                        }
                }
            });


        await Auth.confirmSignIn(username)
            .then(() => console.log('confirmed sign up'))
            .catch(error => console.log(error))

        await Auth.currentSession()
            .then(data => {
                let userInfo = data.accessToken.payload;
                setCurrentUser(userInfo);
            })
            .catch(err => {
                console.log(err.message);
            });

        setNavigate('/');
    }

    function handleChange(e) {
        if(e.target.name === 'username') {
            setUsername(e.target.value);
        } else {
            setPassword(e.target.value);
        }

    }

    if (navigate) {
        return <Navigate to={navigate} />
    } else {
        return (
            <div className="account-wrapper">
                <div className="account-section">
                    <div className="container-wrapper">
                        <h4>Sign In To Your Account</h4>
                        <div className="line" />
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="username" placeholder="username" onChange={handleChange} />
                            <input type="password" name="uassword" placeholder="password" onChange={handleChange} />
                            <button>Sign In</button>
                        </form>
                        <a href="/account/signup">create an account</a>
                    </div>
                </div>
            </div>
        )
    }
}
