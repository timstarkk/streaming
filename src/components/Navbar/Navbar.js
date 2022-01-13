import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Auth } from 'aws-amplify';

export default function Navbar() {
    const [isOpen, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [currentUser, setUser] = useState('');
    //the line below is named such to match older component, need to rename this variable.
    const [changeCurrentUser, setChangeCurrentUser] = useState('');


    const listenScrollEvent = e => {
        if (window.scrollY > 400) {
            this.setState({ scrolled: true })
        } else {
            this.setState({ scrolled: false })
        }
    };

    const handleToggle = () => {
        this.setState({ isOpen: !this.state.isOpen })
    };

    useEffect(() => {
        window.addEventListener("scroll", listenScrollEvent())

        console.log('hello tijmmmmmmhny');

        const { setCurrentUser } = this.context;

        Auth.currentAuthenticatedUser()
        .then(currentUser => setUser(currentUser))
        .catch(err => console.log({ err }))

        Auth.currentSession()
            .then(data => {
                let sub = data.accessToken.payload.sub;
                let username = data.accessToken.payload.username;
                let userInfo = data.accessToken.payload;


                setIsSignedIn(true);
                setUser(userInfo);
            })
            .catch(err => {
                console.log(err);
                console.log(this.state.isSignedIn)
            });
    });

    const getLocation = () => {
        return this.props.location.pathname;
    }

    const accountButtonClick = () => {
        // console.log('you clicked the account button')
        const { currentUser, setCurrentUser, afterSignOut } = this.context;
        console.log(currentUser);

        if (Object.keys(currentUser).length !== 0) {
            this.setState({
                isSignedIn: true,
                currentUser: currentUser.username,
                showAccountMenu: true,
                setCurrentUser,
                afterSignOut
            }, () => {
                document.addEventListener('click', this.closeMenu);
            });
        } else {
            this.setState({
                showAccountMenu: true,
                setCurrentUser,
                afterSignOut
            }, () => {
                document.addEventListener('click', this.closeMenu);
            });
        }
    }

    const closeMenu = () => {
        this.setState({ showAccountMenu: false }, () => {
            document.removeEventListener('click', this.closeMenu);
        });
    }

    const handleSignOut = () => {
        console.log('you clicked sign out')
        this.state.afterSignOut();
        Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log(err));

        this.state.setCurrentUser('');
        this.setState({
            currentUser: '',
            isSignedIn: false
        })
        this.props.history.push('/');
    }

    return (
        <>
            <nav className={"navbar nav-white"}>
                <div className="nav-center">
                    <div className="nav-header">
                        <Link to="/" className="text-link">
                            <div className="logo-div">
                                <p className={"logo-text nav-white"}>
                                    streaming app
                            </p>
                            </div>
                            {/* <img src={logo} alt="logo" style={{ width: "250px", height: "auto" }} /> */}
                        </Link>
                    </div>
                    <ul className={"nav-links nav-white"}>
                        <li>
                            <Link to="/" onClick={() => {
                                this.setState({
                                    isOpen: false
                                })
                            }}>Home</Link>
                        </li>
                        <li>
                            <Link to="/auth" onClick={() => {
                                this.setState({
                                    isOpen: false
                                })
                            }}>Profile</Link>
                        </li>
                    </ul>
                </div >
            </nav >
        </>
    )
}
