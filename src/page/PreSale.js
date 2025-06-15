import React, {Component} from 'react';
import Footer from "../components/Footer";
import backbtn from "../images/Vector (2).svg"
import airdropearn from "../images/19100E3D.png"
import {Link} from "react-router-dom";
import ApiUrl from "../AppUrl/ApiUrl";
import RouteCheck from "../components/routeCheck";

import { showPopup } from '@telegram-apps/sdk';
import PreSaleCard from '../components/PreSaleCard';


class PreSale extends Component {
    constructor() {
        super();
        this.state={
            token:"", loading:true, showPopup: false, token_price : 0.02, deadline : 28
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
                <title>Pre Sale</title>
                <RouteCheck/>
                <div className="mobile-container earn" style={{background:"#D0E1F1"}}>
                    <div className="wallet-headerearn" style={{background:"#D0E1F1"}}>
                        <button className="back-btn" onClick={() => this.props.history.goBack()}>
                            <img src={backbtn} alt="Back" width="30px"/>
                        </button>
                        <h1 className="text-center mb-0 " style={{color:"#191b1c"}}>Pre Sale</h1>
                        <button className="notification-btn">

                        </button>
                    </div>

                    <div className="main-content px-5 py-3">
                        <div className='d-flex flex-column justify-content-center align-items-center gap-3'>
                            <h6 className="mt-4" style={{color:"#1877D1", textAlign: "center", fontSize: "32px", fontWeight: 600}}>Zeros Token Pre-Sale is Live!</h6>
                            <span>10 days 00hours  00min</span>
                            <span style={{color: "#1877D1"}}>1 Zeros Tokens = {this.state.token_price}$</span>
                        </div>

                        <div className='d-flex flex-column'>
                            <div style={{marginTop: "50px"}}>
                                <PreSaleCard token_price={this.state.token_price} token={this.state.token} />
                            </div>
                            <div className='d-flex flex-column justify-content-center align-items-center p-3' style={{marginTop: "70px"}}>
                                <h5 style={{fontWeight: 600}}>Description:</h5>
                                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                    <p style={{fontSize: "16px", marginBottom: 0}}>We’re excited to announce that the Zeros Token Pre-Sale is now officially live! You can now purchase zeros using BNB with a minimum investment of just $1 - and no maximum limit!</p>
                                    
                                    <p style={{fontSize: "16px", marginBottom: 0}}>To participate in the pre-sale:</p>
                                    <div>
                                        <p style={{fontSize: "16px", marginBottom: 0}}>1. Deposit your BNB into your Airdrop Wallet.</p>
                                        <p style={{fontSize: "16px", marginBottom: 0}}>2. Once the deposit is made, your pre-sale ZRS tokens will be credited directly to your Airdrop Wallet.</p>
                                    </div>
                                    <p style={{fontSize: "16px", marginBottom: 0}}>This is your exclusive opportunity to secure Zeros Tokens at the lowest price before the official listing on June 21. Don’t miss out!</p>
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

export default PreSale;