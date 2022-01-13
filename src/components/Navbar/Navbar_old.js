import React, { Component } from 'react';
import './Navbar.css';
// import logo from '../../images/logo.png';
import { GoThreeBars as Hamburger } from "react-icons/go";
import { MdAccountCircle as AccountIcon } from "react-icons/md";
import { FaShoppingCart as CartIcon } from "react-icons/fa";
import { Link, withRouter } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { ItemContext } from '../../context';


class Navbar extends Component {
    static contextType = ItemContext;
    constructor(props) {
        super();

        this.state = {
            isOpen: false,
            scrolled: false,
            showAccountMenu: false,
            isSignedIn: false,
            currentUser: '',
            setCurrentUser: ''
        }

        this.accountButtonClick = this.accountButtonClick.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    listenScrollEvent = e => {
        if (window.scrollY > 400) {
            this.setState({ scrolled: true })
        } else {
            this.setState({ scrolled: false })
        }
    }

    handleToggle = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    componentDidMount() {
        window.addEventListener("scroll", this.listenScrollEvent)

        const { setCurrentUser } = this.context;

        Auth.currentSession()
            .then(data => {
                let sub = data.accessToken.payload.sub;
                let username = data.accessToken.payload.username;
                let userInfo = data.accessToken.payload;

                setCurrentUser(userInfo);

                this.setState({
                    isSignedIn: true,
                    currentUser: username
                })
            })
            .catch(err => {
                console.log(err);
                console.log(this.state.isSignedIn)
            });
    }

    getLocation() {
        return this.props.location.pathname;
    }

    accountButtonClick() {
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

    closeMenu() {
        this.setState({ showAccountMenu: false }, () => {
            document.removeEventListener('click', this.closeMenu);
        });
    }

    handleSignOut() {
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

    render() {
        const { toggleCart } = this.context;
        return (
            <>
                <nav className={"navbar " + (this.state.scrolled ? "nav-scrolled" : "") + (this.getLocation() !== '/' ? " nav-white" : "")}>
                    <div className="nav-center">
                        <div className="nav-header">
                            <Link to="/" className="text-link">
                                <div className="logo-div">
                                    <p className={"logo-text " + (this.state.scrolled ? "nav-scrolled" : "") + (this.getLocation() !== '/' ? " nav-white" : "")}>
                                        ShoeStore
                                </p>
                                </div>
                                {/* <img src={logo} alt="logo" style={{ width: "250px", height: "auto" }} /> */}
                            </Link>
                            <button type="button" className="nav-btn" onClick={this.handleToggle}>
                                <Hamburger className={"nav-icon " + (this.state.scrolled ? 'nav-scrolled' : '') + (this.getLocation() !== '/' ? " nav-white" : "")} />
                            </button>
                        </div>
                        <ul className={this.state.isOpen ? "nav-links show-nav nav-scrolled" : "nav-links " + (this.state.scrolled ? 'nav-scrolled' : '') + (this.getLocation() !== '/' ? " nav-white" : "")}>
                            <li>
                                <Link to="/" onClick={() => {
                                    this.setState({
                                        isOpen: false
                                    })
                                }}>Home</Link>
                            </li>
                            <li>
                                <Link to="/store" onClick={() => {
                                    this.setState({
                                        isOpen: false
                                    })
                                }}>Store</Link>
                            </li>
                            <li>
                                <Link to="/About" onClick={() => {
                                    this.setState({
                                        isOpen: false
                                    })
                                }}>About</Link>
                            </li>
                            <li>
                                <Link onClick={() => {
                                    this.accountButtonClick()
                                    this.setState({
                                        isOpen: false
                                    })
                                }}><AccountIcon id="account-link" /></Link>
                            </li>
                            <li>
                                <a onClick={() => {
                                    toggleCart()
                                    this.setState({
                                        isOpen: false
                                    })
                                }}><CartIcon id="cart-icon" /></a>
                            </li>
                        </ul>
                    </div >
                </nav >

                {
                    this.state.showAccountMenu
                        ? (
                            <div className="account-container-container">
                                <div className="account-container">
                                    <div className="account-menu">
                                        {
                                            this.state.isSignedIn ?
                                                <p>hello, {this.state.currentUser}</p> :
                                                <Link to="/account/signup"><button className="btn"> Sign Up </button></Link>
                                        }
                                        {
                                            this.state.isSignedIn ?
                                                <button className="btn featured-btn" onClick={() => this.handleSignOut()}> Sign Out </button> :
                                                <Link to='/account/signin'><button className="btn featured-btn">Sign In</button></Link >
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                        : (
                            null
                        )
                }
            </>
        );
    }
};

export default withRouter(Navbar);