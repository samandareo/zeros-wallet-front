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

class Allocation extends Component {
    constructor() {
        super();
        this.state={
            token:"",isEligible: false, allocation: 0, loading:true,
            taskSectionLoading: false,  // Add this line
            tasks: [
                {id:1, name: "500 Points", icon: zpointsIcon, redirect: "/airdrop", status: false, desc: null},
                {id:2, name: "5 Zeros Token", icon: ztokenIcon, redirect: "/quiz", status: false, desc: null},
                {id:3, name: "200 XZeros", icon: xzerosIcon, redirect: "/badge", status: false, desc: null},
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

                    const taskUpdates = [
                        { id: 1, status: response.data.data.points >= 500 },
                        { id: 2, status: response.data.data.zeros_token >= 5 },
                        { id: 3, status: response.data.data.xzeros >= 200 },
                        { id: 4, status: response.data.data.badge },
                        { id: 5, status: response.data.data.nft }
                    ];

                    taskUpdates.forEach(({ id, status }) => {
                        this.setState((prevState) => ({
                            tasks: prevState.tasks.map((task) =>
                                task.id === id ? { ...task, status } : task
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
    }

    refreshAllocation = () => {
        this.setState({ taskSectionLoading: true });  // Only set task section loading
        const params = {
            token: this.state.token
        }
        
        Axios.get(ApiUrl.baseurl+"allocation", {params})
            .then((response) => {
                if(response.data.status === "success"){
                    this.setState({
                        allocation: response.data.data.total_token,
                        taskSectionLoading: false  // Reset loading state
                    });

                    const taskUpdates = [
                        { id: 1, status: response.data.data.points >= 500 },
                        { id: 2, status: response.data.data.zeros_token >= 5 },
                        { id: 3, status: response.data.data.xzeros >= 200 },
                        { id: 4, status: response.data.data.badge },
                        { id: 5, status: response.data.data.nft }
                    ];

                    taskUpdates.forEach(({ id, status }) => {
                        this.setState((prevState) => ({
                            tasks: prevState.tasks.map((task) =>
                                task.id === id ? { ...task, status } : task
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
                    taskSectionLoading: false,
                    error: error.response?.data?.message || 'Failed to fetch allocation data'
                });
            });
            
    }

    render() {
        return(
            <>
                <title>Allocation</title>
                <RouteCheck/>
                <div className="mobile-container earn" style={{background:"#D0E1F1"}}>
                    <div className="wallet-headerearn" style={{background:"#D0E1F1"}}>
                        <button className="back-btn" onClick={() => this.props.history.goBack()}>
                            <img src={backbtn} alt="Back" width="30px"/>
                        </button>
                        <h1 className="text-center mb-0 " style={{color:"#191b1c"}}>Allocation</h1>
                        <button className="notification-btn">

                        </button>
                    </div>

                    {this.state.loading ? (
                        <AllocationSkeleton />
                    ) : (
                        <div className="main-content px-4 py-3">
                            <div className='d-flex flex-column gap-3'>
                                <div className='d-flex flex-column justify-content-center align-items-center' style={{borderRadius: "25%"}}>
                                    <img src={zerosWalletIcon} alt="Zeros Wallet Img" width="220px" height="220px"/>
                                    <h5 style={{fontSize: "36px", fontWeight: "500"}}>Check Eligibility</h5>
                                    <p style={{fontSize: "14px", color:"#022F64"}}>Eligible requirements must be met before June 4th.</p>
                                </div>
                                <div className='d-flex justify-content-between align-items-center px-5 mt-4' style={{position: "relative"}}>
                                    <div className='d-flex flex-column align-items-center' style={{rowGap:"5px", color:"#022F64"}}>
                                        {this.state.isEligible ? (
                                            <img src={tickIcon} width={20} height={20}/>
                                        ):(
                                            <img src={cancelIcon} width={20} height={20}/>
                                        )}
                                        <h6 style={{fontSize: "12px"}}>Mandatory task</h6>
                                    </div>
                                    {this.state.isEligible ? (
                                        <div style={{height: "2px", backgroundColor: "#20C17B", position: "absolute", top: "10px", left: "110px", right: "110px", zIndex: 0}}></div>
                                    ):(
                                        <div style={{height: "2px", backgroundColor: "#C34254", position: "absolute", top: "10px", left: "110px", right: "110px", zIndex: 0}}></div>
                                    )}
                                    <div className='d-flex flex-column align-items-center' style={{rowGap:"5px", color:"#022F64"}}>
                                        {this.state.isEligible ? (
                                            <img src={tickIcon} width={20} height={20}/>
                                        ):(
                                            <img src={cancelIcon} width={20} height={20}/>
                                        )}
                                        <h6 style={{fontSize: "12px"}}>You are Eligible</h6>
                                    </div>
                                </div>
                                <div style={{height: "1px", backgroundColor: "#022F64", marginTop: "10px"}}></div>
                                <div className='d-flex flex-column gap-2'>
                                    <div className='d-flex flex-column align-items-center justify-content-center gap-3'>
                                        <div className='d-flex justify-content-center align-items-center gap-1'>
                                            {this.state.isEligible ? (
                                                <>
                                                    <h6 style={{marginBottom: 0}}>You Are Eligible</h6>
                                                    <img src={tickIcon} width={20} height={20}/> 
                                                </>
                                            ):(
                                                <>
                                                    <h6 style={{marginBottom: 0}}>You Are Not Eligible</h6>
                                                    <img src={cancelIcon} width={20} height={20}/>
                                                </>
                                            )}
                                        </div>
                                        <h5 style={{fontWeight: 600, color: "#1877D1", marginBottom: 0}}>Allocation Available Soon</h5>
                                        <h5 style={{fontWeight: 600, color: "#1877D1", marginBottom: 0}}>{this.state.allocation}</h5>
                                    </div>
                                    <p style={{textAlign: "center", fontSize: "14px", padding: "5px", color:"#C34254", marginTop: "10px"}}>Note: To Be Eligible For The Airdrop, You Must Complete All Mandatory Tasks Listed Above. Make Sure All Tasks Show A✅Before Proceeding.</p>
                                </div>
                            </div>

                            <div className='d-flex flex-column gap-3 mt-4'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h5 style={{fontWeight: 600, color: "#1877D1", marginBottom: 0}}>Mandatory Task</h5>
                                    <span 
                                        className={`d-flex gap-2 px-2 py-1 ${this.state.taskSectionLoading ? 'disable-btn' : ''}`}
                                        style={{
                                            cursor: this.state.taskSectionLoading ? 'not-allowed' : 'pointer',
                                            opacity: this.state.taskSectionLoading ? 0.6 : 1
                                        }}
                                        onClick={this.state.taskSectionLoading ? null : this.refreshAllocation}
                                        title={this.state.taskSectionLoading ? 'Refreshing...' : 'Refresh'}
                                    >
                                        <h6 style={{
                                            color: "#1877D1", 
                                            marginBottom: 0, 
                                            fontWeight: 600,
                                            opacity: this.state.taskSectionLoading ? 0.6 : 1
                                        }}>refresh</h6>
                                        <img 
                                            src={refreshIcon}
                                            width={20}
                                            height={20}
                                            alt="refresh"
                                            className={this.state.taskSectionLoading ? 'refresh-icon-spin' : ''}
                                        />
                                    </span>
                                </div>
                                
                                <div className={`d-flex flex-column gap-3 ${this.state.taskSectionLoading ? 'task-section-loading' : ''}`}
                                    style={{borderRadius: "5px", border: "1px solid #1877D1", backgroundColor: "#E0EDF6", padding: "20px"}}
                                >
                                    {this.state.tasks.map((task) => (
                                        <>
                                            <div className='d-flex justify-content-between align-items-center' key={task.id}>
                                                <div className='d-flex justify-content-center align-items-center gap-2'>
                                                    <img src={task.icon} width={55} height={55} style={{borderRadius: "50%"}}/>
                                                    <div className='d-flex flex-column justify-content-between gap-1'>
                                                        <h6 style={{fontWeight: 600, color: "#1877D1", marginBottom: 0, fontSize: "20px"}}>{task.name}</h6>
                                                        {task.desc !== null && (
                                                            <p style={{fontSize: "12px", color:"#022F64", marginBottom: 0}}>{task.desc}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {task.status ? (
                                                    <div className='d-flex justify-content-center align-items-center gap-2'>
                                                        <h6 style={{fontWeight: 600, color: "#1877D1", marginBottom: 0}}>Completed</h6>
                                                        <img src={tickIcon} width={20} height={20}/>
                                                    </div>
                                                ):(
                                                    <div className='d-flex justify-content-center align-items-center gap-2'>
                                                        {task.id === 1 ? (
                                                            <h6 style={{fontWeight: 600, color: "#1877D1", marginBottom: 0, fontSize: "15px", cursor: "pointer"}} onClick={() => this.props.history.push(task.redirect)}>Claim</h6>
                                                        ) : (
                                                            <h6 style={{fontWeight: 600, color: "#1877D1", marginBottom: 0, fontSize: "15px", cursor: "pointer"}} onClick={() => this.props.history.push(task.redirect)}>Click to Claim</h6>
                                                        )}
                                                        <img src={cancelIcon} width={20} height={20}/>
                                                    </div>
                                                )}
                                            </div>
                                            {task.id !== this.state.tasks.length && (
                                                <div style={{height: "1px", backgroundColor: "#1877D1", width: "100%"}}></div>
                                            )}
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <br/><br/><br/><br/><br/>
                </div>
            </>
        )
    }
}

export default Allocation;