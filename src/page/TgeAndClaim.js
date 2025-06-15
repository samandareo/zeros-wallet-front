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

import zerosWalletIcon from "../images/zeros-wallet.png"
import tgeclaimdark from "../images/tgeclaim-blue.png"
import preSale from "../images/presale.jpg";


class TgeAndClaim extends Component {
    constructor() {
        super();
        this.state={
            token:"", loading:true
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
                <title>TGE&Claim</title>
                <RouteCheck/>
                <div className="mobile-container earn" style={{background:"#D0E1F1"}}>
                    <div className="wallet-headerearn" style={{background:"#D0E1F1"}}>
                        <button className="back-btn" onClick={() => this.props.history.goBack()}>
                            <img src={backbtn} alt="Back" width="30px"/>
                        </button>
                        <h1 className="text-center mb-0 " style={{color:"#191b1c"}}>TGE&Claim</h1>
                        <button className="notification-btn">

                        </button>
                    </div>

                    <div className="main-content px-4 py-3">
                        <h6 className="mt-4" style={{color:"#191b1c"}}>Explore Your Options</h6>

                        <div className='d-flex flex-column'>
                            <div className='d-flex justify-content-between align-items-center' style={{background: "#E0EDF6", padding: "20px", borderRadius: "10px", marginTop: "20px"}}>
                                <div className='d-flex align-items-center' style={{columnGap:"10px"}}>
                                    <img src={tgeclaimdark} alt="Airdrop" width="40px" height="40px"/>
                                    <div style={{lineHeight: "1.2"}}>
                                        <h5 style={{color: "#022F64", fontWeight: "initial", marginBottom: 0, fontSize: "1.1rem"}}>Choose Your CEX</h5>
                                        <p style={{fontWeight: "lighter", marginBottom: 0, marginTop: 0, fontSize: "14px"}}>(Choose Your Next Step)</p>
                                    </div>
                                </div>
                                <div>
                                    <Link 
                                        to="/choose-your-cex" 
                                        className="btn" 
                                        style={{
                                            border: "1px solid #022F64", 
                                            color: "#022F64", 
                                            padding: "3px 18px", 
                                            borderRadius: "5px",
                                            transition: "all 0.3s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = "#022F64";
                                            e.target.style.color = "#fff";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = "transparent";
                                            e.target.style.color = "#022F64";
                                        }}
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>

                            <div className='d-flex justify-content-between align-items-center' style={{background: "#E0EDF6", padding: "20px", borderRadius: "10px", marginTop: "20px"}}>
                                <div className='d-flex align-items-center' style={{columnGap:"10px"}}>
                                    <img src={zerosWalletIcon} alt="Airdrop" width="40px" height="40px"/>
                                    <div style={{lineHeight: "1.2"}}>
                                        <h5 style={{color: "#022F64", fontWeight: "initial", marginBottom: 0, fontSize: "1.1rem"}}>Check Your Allocation</h5>
                                        <p style={{fontWeight: "lighter", marginBottom: 0, marginTop: 0, fontSize: "14px"}}>(Check Eligibility)</p>
                                    </div>
                                </div>
                                <div>
                                    <Link 
                                        to="/allocation" 
                                        className="btn" 
                                        style={{
                                            border: "1px solid #022F64", 
                                            color: "#022F64", 
                                            padding: "3px 18px", 
                                            borderRadius: "5px",
                                            transition: "all 0.3s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = "#022F64";
                                            e.target.style.color = "#fff";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = "transparent";
                                            e.target.style.color = "#022F64";
                                        }}
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <img src={preSale} alt="Pre Sale" className='img-fluid' style={{borderRadius: "10px", marginTop: "20px", cursor: "pointer"}} onClick={() => this.props.history.push("/pre-sale")}/>
                            </div>
                        </div>
                        <div className='p-2 mt-4'>
                            <p className='fs-5 fw-semibold'>Description</p>
                            <p>Take The Next Steps After The TGE (Token Generation Event) For Zeros Token With The Following Options:</p>
                            <ol style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                                <li><b>Select Your CEX:</b><br/>Choose From The Available Centralized Exchanges (CEX). More Exchanges Will Be Integrated Soon To Give You Even Greater Flexibility.</li>
                                <li><b>Check Your Allocation:</b><br/>View Your Zeros Token Distribution. This Feature Is Currently Under Development And Will Be Available Soon.</li>
                                <li><b>More Features Coming:</b>Post-TGE Upgrades Are On The Way — Including Expanded Exchange Support, Enhanced Wallet Integration, And Detailed Allocation Tracking Via Zeros Wallet.</li>
                            </ol>
                        </div>
                    </div>
                    <br/><br/><br/><br/><br/>
                </div>
                <Footer/>
            </>
        )
    }
}

export default TgeAndClaim;