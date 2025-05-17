import React, {Component} from 'react';
import zeros from "../images/zeros-3d-logo.png"
import {Link} from "react-router-dom";
import RouteCheck from "../components/routeCheck";

class HomeLock extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem("authtoken")
        if(token){
            this.props.history.push("/")
        }
    }

    render() {
        return (
            <>
                <RouteCheck/>
                <title>Zeros Wallet</title>
                <div className="container-fluid min-vh-100 d-flex flex-column justify-content-between homelock">
                    <div className="wallet-content text-center">
                        <div className="logo-container mb-4">
                            <img src={zeros} alt="Zeros Wallet Logo" className="logo"/>
                        </div>

                        <h1 className="wallet-title mb-4">ZEROS<br/>WALLET</h1>

                        <p className="wallet-description mb-5">
                            The Most Secure, Safe & Trustworthy<br/>
                            Decentralized Web3 Wallet
                        </p>

                        <div className="button-group">
                            <Link to={"/createwallet"} className="btn btn-primary mb-3 w-100">Create Wallet</Link>
                            <Link to="/importwallet">
                                <button className="btn btn-outline-primary w-100">Import Wallet</button>
                            </Link>
                        </div>
                    </div>

                    <div className="privacy-notice text-center mb-4">
                        <small>
                            By Continuing, You Agree To Bitget Wallet's Privacy<br/>
                            Policy And <Link to="/terms">Terms Of Service</Link>
                        </small>
                    </div>
                </div>
            </>
        );
    }
}

export default HomeLock;