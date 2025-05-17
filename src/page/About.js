import React, {Component} from 'react';
import backbtn from "../images/back-button.png"
import {Link} from "react-router-dom";
import RouteCheck from "../components/routeCheck";

class About extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <>
                <RouteCheck/>
                <div className="about-container" style={{minHeight:"800px",height:"auto",marginBottom:"0px",paddingBottom:"50px"}}>
                    <title>About Zeros Wallet</title>
                    <div className="about-header p-3">
                        <Link onClick={()=>this.props.history.go(-1)} to="#" className="about-back-btn text-decoration-none">
                            <img src={backbtn} alt="Back" className="about-back-icon" width="30px"/>
                        </Link>
                        <h1 className="text-center mb-0">About</h1>
                    </div>


                    <div className="content-section mb-4">
                        <p className="description">
                            Zeros Wallet Is A Next-Generation Crypto Wallet Designed For Seamless, Secure, And Rewarding
                            Digital Asset Management. Whether You're New To Crypto Or An Experienced Trader, Zeros
                            Wallet Empowers You To Store, Send, And Receive Digital Assets Effortlessly.
                        </p>
                    </div>

                    <div className="features">
                        <div className="feature-item mb-4">
                            <p>
                                ðŸš€ Sign-Up Bonus ~ Get Rewarded Instantly With 2 Zeros Tokens Just For Joining!
                            </p>
                        </div>

                        <div className="feature-item mb-4">
                            <p>
                                ðŸ”’ Secure & Reliable ~ Built With Top-Tier Encryption And Security Protocols To Keep
                                Your Assets Safe.
                            </p>
                        </div>

                        <div className="feature-item mb-4">
                            <p>
                                ðŸ’° Effortless Transactions ~ Send And Receive Zeros Tokens And Other Cryptocurrencies
                                With Lightning-Fast Speed.
                            </p>
                        </div>

                        <div className="feature-item mb-4">
                            <p>
                                ðŸ“Œ Future-Ready ~ Zeros Wallet Is More Than Just A Wallet; It's The Gateway To An
                                Entire Ecosystem Of Crypto-Powered Services.
                            </p>
                        </div>

                        <div className="feature-item">
                            <p>
                                Join Us Today And Take Control Of Your Digital Assets With Zeros Wallet!
                            </p>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default About;