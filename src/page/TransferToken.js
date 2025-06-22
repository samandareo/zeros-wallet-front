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
import tickIcon from "../images/tick-icon.png"
import cancelIcon from "../images/cancel-icon.png"
import zpointsIcon from "../images/zpoints.png"
import xzerosIcon from "../images/xzeros.png"
import ztokenIcon from "../images/ztoken.png"
import nftIcon from "../images/nft-icon.png"
import badgeIcon from "../images/badge.png"
import refreshIcon from "../images/refresh.png"
import AllocationSkeleton from '../components/AllocationSkeleton';
import '../style/AllocationSkeleton.css';
import { toast } from 'react-toastify';

class TransferToken extends Component {
    constructor() {
        super();
        this.state={
            token:"",
            isEligible: false, 
            allocation: 0, 
            bnb:0, 
            loading:true,
            transferLoading: false,
            taskSectionLoading: false,
            isTransferred: false,
            tasks: [
                {id:1, name: "500 Points", icon: zpointsIcon, redirect: "/airdrop", status: false, desc: null, amount: 0},
                {id:2, name: "5 Zeros Token", icon: ztokenIcon, redirect: "/quiz", status: false, desc: null, amount: 0},
                {id:3, name: "100 XZeros", icon: xzerosIcon, redirect: "/badge", status: false, desc: null, amount: 0},
                {id:4, name: "Badge Claim", icon: badgeIcon, redirect: "/badge", status: false, desc: "Badge allocation 299"},
                {id:5, name: "NFT Claim", icon: nftIcon, redirect: "/claim", status: false, desc: "NFT allocation 299"},
            ]
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

        const params = {
            token: token
        }

        Axios.get(ApiUrl.baseurl+"allocation", {params})
            .then((response) => {
                if(response.data.status === "success"){
                    this.setState({allocation: response.data.data.total_token, loading: false})
                    this.setState({bnb: response.data.data.bnb});

                    const taskUpdates = [
                        { id: 1, status: true, amount: response.data.data.points},
                        { id: 2, status: true, amount: response.data.data.zeros_token},
                        { id: 3, status: true, amount: response.data.data.xzeros},
                        { id: 4, status: response.data.data.badge, amount: null},
                        { id: 5, status: response.data.data.nft, amount: null}
                    ];


                    taskUpdates.forEach(({ id, status, amount}) => {
                        this.setState((prevState) => ({
                            tasks: prevState.tasks.map((task) =>
                                task.id === id ? {...task, status: status, amount: amount} : task
                            )
                        }));
                    });

                    const isEligible = taskUpdates.every(task => task.status);
                    this.setState({ isEligible:isEligible});

                }
            })
            .catch((error) => {
                console.error('API Error:', error);
                this.setState({ 
                    loading: false,
                    error: error.response?.data?.message || 'Failed to fetch allocation data'
                });
            });
        
        Axios.get(ApiUrl.baseurl+"check-transfer", {params})
            .then((response) => {
                if(response.data){
                    this.setState({isTransferred: response.data.transferred}); // Remove .data
                } else {
                    this.setState({isTransferred: false});
                }
            })
            .catch((error) => {
                console.error('API Error:', error);
                this.setState({ 
                    error: error.response?.data?.message || 'Failed to check transfer'
                });
            });
    }

    transferToken = () => {
        const token = localStorage.getItem("authtoken");
        if (!token) {
            this.props.history.push("/home");
            return;
        }

        if (this.state.bnb < 0.0015) {
            toast.error("Insufficient BNB balance. Please add at least 0.0015 BNB to cover gas fees.");
            return;
        }

        this.setState({ transferLoading: true });

        const formData = new FormData();
        formData.append("token", token);
        formData.append("points", this.state.tasks[0].amount);
        formData.append("ztoken", this.state.tasks[1].amount);
        formData.append("xzeros", this.state.tasks[2].amount);
        formData.append("token_amount", this.state.allocation);

        console.log("Sending transfer request with data:", {
            points: this.state.tasks[0].amount,
            zeros_token: this.state.tasks[1].amount,
            xzeros: this.state.tasks[2].amount,
            token_amount: this.state.allocation
        });

        Axios.post(ApiUrl.baseurl + "transfer", formData)
            .then((response) => {
                console.log("Transfer response:", response);
                this.setState({ transferLoading: false });
                if (response.data.success) {
                    toast.success("Transfer Successful");
                    this.props.history.push("/wallet");
                } else {
                    toast.error("Transfer Failed: " + (response.data.message || "Unknown error"));
                }
            })
            .catch((error) => {
                this.setState({ transferLoading: false });
                console.error('Transfer Error:', error);
                console.error('Error response:', error.response);
                
                if (error.response) {
                    toast.error("Transfer Failed: " + (error.response.data?.message || `Server Error ${error.response.status}`));
                } else if (error.request) {
                    toast.error("Network Error: Unable to connect to server");
                } else {
                    toast.error("Transfer Failed: " + error.message);
                }
            });
    }


    render() {
        return(
            <>
                <title>Claim Zeros</title>
                <style>
                    {`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>
                <RouteCheck/>
                <div className="mobile-container earn" style={{background:"#D0E1F1"}}>
                    <div className="wallet-headerearn" style={{background:"#D0E1F1"}}>
                        <button className="back-btn" onClick={() => this.props.history.goBack()}>
                            <img src={backbtn} alt="Back" width="30px"/>
                        </button>
                        <h1 className="text-center mb-0 " style={{color:"#191b1c"}}>Claim Zeros</h1>
                        <button className="notification-btn">

                        </button>
                    </div>

                    {this.state.loading ? (
                        <AllocationSkeleton />
                    ) : this.state.isTransferred ? (
                        <div className='main-content px-4 py-3' style={{marginTop: "50px"}}>
                            <div className='d-flex flex-column justify-content-center align-items-center mb-3'>
                                <img src={zerosWalletIcon} alt="Zeros Wallet Img" width="220px" height="220px"/>
                                <h5 style={{color: "#1877D1", fontWeight: 600, marginBottom: "15px", textAlign: "center"}}>
                                    Transfer Already Completed
                                </h5>
                                <p style={{color: "#022F64", textAlign: "center", fontSize: "16px"}}>
                                    You have already claimed Zeros allocation, check your airdrop wallet.
                                </p>
                            </div>

                            <div style={{
                                borderRadius: "5px", 
                                padding: "15px", 
                                backgroundColor: "#E0EDF6", 
                                textAlign: "center",
                                border: "1px solid #1877D1"
                            }}>
                                <h6 style={{fontWeight: 600, color: "#1877D1", marginBottom: "10px"}}>
                                    Your Allocation
                                </h6>
                                <h5 style={{fontWeight: 600, color: "#1877D1", marginBottom: 0}}>
                                    {this.state.allocation}
                                </h5>
                            </div>

                            <div style={{
                                display: "flex", 
                                justifyContent: "center", 
                                alignItems: "center", 
                                backgroundColor: "#1877D1", 
                                color: "#fff", 
                                padding: "12px", 
                                borderRadius: "5px",
                                marginTop: "20px",
                                cursor: "pointer"
                            }} onClick={() => this.props.history.push("/wallet")}>
                                <span style={{marginRight: "8px"}}>↗️</span>
                                View Wallet
                            </div>
                        </div>
                    ) : this.state.isEligible ? (
                        <div className="main-content px-4 py-3">
                            <div className='d-flex  flex-column justify-content-between align-items-center mb-3' style={{marginTop: "50px"}}>
                                <h5 style={{color: "#1877D1", fontWeight: 600, marginBottom: "15px"}}>Claim Your Zeros Tokens</h5>
                                <p style={{fontWeight: 600, textAlign:"center"}}>Make Sure Your Airdrop Wallet Has 0.0015 BNB To Cover Gas Fees.</p>
                            </div>

                            <div className='d-flex flex-column justify-content-between align-items-center mb-3 px-3 py-2 gap-2' style={{backgroundColor: "#E0EDF6", borderRadius: "5px"}}>
                                <h5 style={{fontWeight: 600, color: "#1877D1", marginBottom: 0}}>Your Allocation</h5>
                                <h5 style={{fontWeight: 600, color: "#1877D1", marginBottom: 0}}>{this.state.allocation}</h5>
                            </div>
                            <div className='d-flex flex-column justify-content-center align items-center'>
                                <p style={{textAlign:"center", color: "rgb(195, 66, 84)", fontSize: "14px"}}>
                                    Note: To Successfully Transfer Your ZEROS Token Allocation, Your Airdrop Wallet Must Contain At Least 0.0015 BNB. Without It, The Transaction Will Fail Due To Insufficent Network Fees.
                                </p>
                            </div>

                            <div className='d-flex flex-column gap-3 mt-4'>
                                <h6 style={{fontWeight: 700}}>How To Claim & Transfer ZEROS Tokens</h6>
                                <ul style={{listStyleType: "number", paddingLeft: "20px"}}>
                                    <li>Click The "Claim" Button You'll Be Redirected To The Transfer Page.</li>
                                    <li>Click The "Transfer" Button Initiate The Token Transfer To Your Airdrop Wallet.</li>
                                    <li>Transaction Outcome</li>
                                    <ul style={{listStyleType: "disc", paddingLeft: "20px"}}>
                                        <li>✅If You Have 0.0015 BNB: Transfer Will Be Completed, And Your ZEROS Tokens Will Arrive.</li>
                                        <li>❌If You Don't: You'll See An Error - Please Fund Your Wallet With BNB And Try Again.</li>
                                    </ul>
                                </ul>
                            </div>
                            <br/><br/><br/>
                            <div style={{
                                display: "flex", 
                                justifyContent: "center", 
                                alignItems: "center", 
                                backgroundColor: this.state.transferLoading ? "#ccc" : "#1877D1",  // Use transferLoading
                                color: "#fff", 
                                padding: "10px", 
                                borderRadius: "5px", 
                                cursor: this.state.transferLoading ? "not-allowed" : "pointer",  // Use transferLoading
                                opacity: this.state.transferLoading ? 0.7 : 1,  // Use transferLoading
                                transition: "all 0.3s ease"
                            }} onClick={this.state.transferLoading ? null : this.transferToken}>  {/* Use transferLoading */}
                                {this.state.transferLoading ? (  /* Use transferLoading */
                                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                        <div style={{
                                            width: "20px",
                                            height: "20px",
                                            border: "2px solid #fff",
                                            borderTop: "2px solid transparent",
                                            borderRadius: "50%",
                                            animation: "spin 1s linear infinite"
                                        }}></div>
                                        Processing...
                                    </div>
                                ) : (
                                    "Transfer"
                                )}
                            </div>
                        </div>
                    ): !this.state.isTransferred && (
                        <div className='main-content px-4 py-3' style={{marginTop: "50px"}}>
                            <div className='d-flex  flex-column justify-content-between align-items-center mb-3'>
                                <img src={zerosWalletIcon} alt="Zeros Wallet Img" width="220px" height="220px"/>
                                <h5 style={{color: "#000", fontWeight: 600, marginBottom: "15px"}}>You Are Not Eligible For Claim</h5>
                            </div>

                            <div style={{
                                display: "flex", 
                                justifyContent: "center", 
                                alignItems: "center", 
                                backgroundColor: "#1877D1", 
                                color: "#fff", 
                                padding: "10px", 
                                borderRadius: "5px",
                                position: "fixed",
                                bottom: "20px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "calc(100% - 40px)",
                                maxWidth: "400px",
                                zIndex: 1000,
                                cursor: "pointer"
                            }} onClick={() => this.props.history.push("/allocation")}>
                                Check Eligibility
                            </div>
                        </div>
                    )}
                    <br/><br/><br/><br/><br/>
                </div>
            </>
        )
    }
}

export default TransferToken;