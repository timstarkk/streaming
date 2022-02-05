import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { Auth } from 'aws-amplify';
import { GoThreeBars as Hamburger } from "react-icons/go";
import { MdAccountCircle as AccountIcon } from "react-icons/md";
import { FaShoppingCart as CartIcon } from "react-icons/fa";
import { AuthContext } from '../../authContext';
import { Navigate, useNavigate } from "react-router-dom";

export default function Navbar(props) {
    const [isOpen, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [currentUser, setUser] = useState('');
    //the line below is named such to match older component, need to rename this variable.
    const [changeCurrentUser, setChangeCurrentUser] = useState('');

    const location = useLocation().pathname;
    const navigate = useNavigate();

    const { user, setCurrentUser, afterSignOut } = useContext(AuthContext);

    const listenScrollEvent = e => {
        if (window.scrollY > 400) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    const handleToggle = () => {
        setOpen(!isOpen);
    };

    useEffect(() => {
        window.addEventListener("scroll", listenScrollEvent)

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
            });
      }, [])

    
    const AccountButtonClick = function(){
        console.log('you clicked the account button');

        if (Object.keys(currentUser).length !== 0) {
            setIsSignedIn(true);
            setCurrentUser(currentUser.username);
            setShowAccountMenu(!showAccountMenu);
            window.addEventListener("mousedown", closeMenu);
        } else {
            setShowAccountMenu(!showAccountMenu);
            window.addEventListener("mousedown", closeMenu);
        }

    }

    const closeMenu = (e) => {
        if (e === undefined) {
            setShowAccountMenu(false);
            window.removeEventListener('click', closeMenu);
        } else if (e.target.name === 'signup' || e.target.name === 'signin') {
            navigate(`/account/${e.target.name}`)
            closeMenu();
        } else {
            setShowAccountMenu(false);
            window.removeEventListener('click', closeMenu);
        }
    }

    const handleSignOut = () => {
        // afterSignOut();
        Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log(err));

        setUser('');
        setIsSignedIn(false);
        props.history.push('/');
    }

    return (
        <>
            <nav className={"navbar " + (scrolled ? "nav-scrolled" : "") + (location !== '/' ? " nav-white" : "")}>
                <div className="nav-center">
                    <div className="nav-header">
                        <Link to="/" className="text-link">
                            <div className="logo-div">
                                <p className={"logo-text " + (scrolled ? "nav-scrolled" : "") + (location !== '/' ? " nav-white" : "")}>
                                    streaming site
                            </p>
                            </div>
                            {/* <img src={logo} alt="logo" style={{ width: "250px", height: "auto" }} /> */}
                        </Link>
                        <button type="button" className="nav-btn" onClick={handleToggle}>
                            <Hamburger className={"nav-icon " + (scrolled ? 'nav-scrolled' : '') + (location !== '/' ? " nav-white" : "")} />
                        </button>
                    </div>
                    <ul className={isOpen ? "nav-links show-nav nav-scrolled" : "nav-links " + (scrolled ? 'nav-scrolled' : '') + (location !== '/' ? " nav-white" : "")}>
                        <li>
                            <Link to="/" onClick={() => {
                                setOpen(false);
                            }}>Home</Link>
                        </li>
                        <li>
                            <Link to="/channel" onClick={() => {
                                setOpen(false);
                            }}>Channel</Link>
                        </li>
                        <li>
                            <Link to="/About" onClick={() => {
                                setOpen(false);
                            }}>About</Link>
                        </li>
                        <li>
                            <Link to="" onClick={() => {
                                AccountButtonClick();
                                setOpen(false);
                                // document.addEventListener('click', closeMenu);
                            }}><AccountIcon id="account-link" /></Link>
                        </li>
                    </ul>
                </div >
            </nav >

            {
                showAccountMenu
                    ? (
                        <div className="account-container-container" onBlur={() => closeMenu}>
                            <div className="account-container">
                                {/* <OutsideClick> */}
                                    <div className="account-menu">
                                        {
                                            isSignedIn ?
                                                <p>hello, {currentUser.username}</p> :
                                                <Link to="/account/signup"><button className="btn" name="signup"> Sign Up </button></Link>
                                        }
                                        {
                                            isSignedIn ?
                                                <button className="btn featured-btn" onClick={() => handleSignOut()}> Sign Out </button> :
                                                <Link to='/account/signin'><button className="btn featured-btn" name="signin">Sign In</button></Link >
                                        }
                                    </div>
                                {/* </OutsideClick> */}
                            </div>
                        </div>
                    )
                    : (
                        null
                    )
            }
        </>
    )
}
