import React, {Component} from 'react';
import Footer from "../components/Footer";
import backbtn from "../images/Vector (2).svg"
import airdropearn from "../images/19100E3D.png"
import {Link} from "react-router-dom";
import ApiUrl from "../AppUrl/ApiUrl";
import Axios from "axios";
import loadinggif from "../images/loading.gif"
import jwtDecode from "jwt-decode";
import RouteCheck from "../components/routeCheck";

import TokenSwapCard from "../components/TokenSwapCard";

import zerosWalletIcon from "../images/zeros-wallet.png"
import tgeclaimdark from "../images/tgeclaim-blue.png"
import { showPopup } from '@telegram-apps/sdk';


class TokenSwap extends Component {
    constructor() {
        super();
        this.state={
            token:"", loading:true, showPopup: false, balances: {
                ZRS: 10000, // Example balance for Zeros token
                SOL: 500,     // Example balance for Solana
                USDT: 100     // Example balance for USDT
            }
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
        }else {
            this.props.history.push("/home")
        }
    }

    render() {
        return(
            <>
                <title>Swap Token</title>
                <RouteCheck/>
                <div className="mobile-container earn" style={{background:"#D0E1F1"}}>
                    <div className="wallet-headerearn" style={{background:"#D0E1F1"}}>
                        <button className="back-btn" onClick={() => this.props.history.goBack()}>
                            <img src={backbtn} alt="Back" width="30px"/>
                        </button>
                        <h1 className="text-center mb-0 " style={{color:"#191b1c"}}>Swap Zeros</h1>
                        <button className="notification-btn">

                        </button>
                    </div>

                    <div className="main-content px-5 py-3">
                        <h6 className="mt-4" style={{color:"#1877D1", textAlign: "center", fontSize: "32px", fontWeight: 600}}>Swap Your Zeros Token To Sol or Usdt</h6>

                        <div className='d-flex flex-column'>
                            <div style={{marginTop: "50px"}}>
                                <TokenSwapCard balances={this.state.balances} />
                            </div>
                            <div className='d-flex flex-column justify-content-center align-items-center p-3'>
                                <h5 style={{fontWeight: 600}}>How to Swap Zeros Token to SOL or USDT</h5>
                                <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                                    <p style={{fontSize: "16px", marginBottom: 0}}>Follow these steps to swap your Zeros tokens to SOL or USDT:</p>
                                    <div>
                                        <p style={{fontSize: "16px", marginBottom: 0}}>Step 1: Access the Swap interface</p>
                                        <ul style={{marginLeft: "-10px", marginBottom: 0}}>
                                            <li style={{fontSize: "14px"}}>Open the swap platform where the Zeros token is supported.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p style={{fontSize: "16px", marginBottom: 0}}>Step 2: Select Tokens</p>
                                        <ul style={{marginLeft: "-10px", marginBottom: 0}}>
                                            <li style={{fontSize: "14px"}}>Select Zeros as the token you want to swap.</li>
                                            <li style={{fontSize: "14px"}}>Choose either SOL or USDT as the desired output</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p style={{fontSize: "16px", marginBottom: 0}}>Step 3: Enter Amount</p>
                                        <ul style={{marginLeft: "-10px", marginBottom: 0}}>
                                            <li style={{fontSize: "14px"}}>Input the amount of Zeros you wish to swap.</li>
                                            <li style={{fontSize: "14px"}}>Click "Max" to automatically use your full balance (10,000 Zeros in this example)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p style={{fontSize: "16px", marginBottom: 0}}>Step 4: Review Details</p>
                                        <ul style={{marginLeft: "-10px", marginBottom: 0}}>
                                            <li style={{fontSize: "14px"}}>Check the conversion rate (e.g., 1 Zeros = 0.06$).</li>
                                            <li style={{fontSize: "14px"}}>Confirm the estimated amoun you'll receive in SOL or USDT.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p style={{fontSize: "16px", marginBottom: 0}}>Step 5: Confirmation</p>
                                        <ul style={{marginLeft: "-10px", marginBottom: 0}}>
                                            <li style={{fontSize: "14px"}}>Wait for the transaction to complete.</li>
                                            <li style={{fontSize: "14px"}}>Your swapped SOL or USDT will reflect in your airdrop wallet balance.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p style={{fontSize: "16px", marginBottom: 0}}>Tip: Always verify token addresses and rates before swapping to avoid scams.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/><br/><br/><br/><br/>
                </div>
            </>
        )
    }
}

export default TokenSwap;