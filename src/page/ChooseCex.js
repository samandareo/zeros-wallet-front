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
import bitmartIcon from "../images/bitmart.png"
import mexcIcon from "../images/mexc.png"
import grovexIcon from "../images/grovex.png"
import solanaIcon from "../images/solana.png"
import { toast } from 'react-toastify';
import loadingSpinner from '../images/loading.gif';
import CexSkeleton from '../components/CexSkeleton';


class ChooseCex extends Component {
    constructor() {
        super();
        this.state = {
            token: "", 
            loading: true, 
            selectedCex: "",
            isFollowed: false,
            cexOptions: [
                { id: "bitmart", name: "Bitmart", logo: bitmartIcon, available: true},
                { id: "mexc", name: "Mexc", logo: mexcIcon, available: true },
                { id: "grovex", name: "Grovex", logo: grovexIcon, available: true },
                { id: "onclain", name: "Onchain Claim", logo: solanaIcon, available: true }
            ],
            tasks : [
                { id: "telegram", name: "Telegram Username", link: "https://t.me/zeroswallet", desc: "Enter your Telegram username" },
                { id: "twitter", name: "Twitter Username", link: "https://x.com/Zeros_wallet", desc: "Enter your Twitter username" },
                { id: "discord", name: "Discord Username", link: "https://discord.gg/TEuH75pA", desc: "Enter your Discord username" },
            ],
            tg_username: "",
            tw_username: "",
            dc_username: "",
            checks: {
                twitter: false,
                telegram: false,
                discord: false
            },
            inpt_states: {
                twitter: true,
                telegram: false,
                discord: true
            },
            telegram_flow : {
                follow: false,
                check: false
            },
            twitter_flow : {
                follow: false,
                check: false
            },
            discord_flow : {
                follow: false,
                check: false
            },
            timers: {
                telegram: 0,
                twitter: 0,
                discord: 0
            },
            showCheck: {
                telegram: false,
                twitter: false,
                discord: false
            },
            followDisabled: {
                telegram: false,
                twitter: false,
                discord: false
            },
            verificationLoading: {
                telegram: false,
                twitter: false,
                discord: false
            },
            isSubmitting: false,
            tooltips: {
                telegram: "",
                twitter: "Please complete the Telegram task first",
                discord: "Please complete the Twitter task first"
            }
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        const token = localStorage.getItem("authtoken");
        
        sessionStorage.setItem("submission_count", 0);

        if(!token) {
            this.props.history.push("/home");
            return;
        }

        // Set loading state first
        this.setState({ loading: true }, () => {
            const params = { token: token };
            
            Axios.get(ApiUrl.baseurl + "isfollowed", {params})
                .then((response) => {
                    console.log("API Response:", response.data);
                    // If user has already followed/completed tasks
                    if (response.data.is_followed) {
                        this.setState({
                            loading: false,
                            token: token,
                            isFollowed: true,
                            selectedCex: response.data.cex || "" // Store selected CEX if available
                        });
                    } else {
                        // User hasn't completed tasks yet
                        this.setState({
                            loading: false,
                            token: token,
                            isFollowed: false,
                            selectedCex: "" // Reset selected CEX
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching follow status:", error);
                    this.setState({ 
                        loading: false,
                        token: token,
                        isFollowed: false
                    });
                    toast.error("Error loading data. Please try again.");
                    window.location.reload();
                });
        });
    }

    handleCexChange = (cexName) => {
        this.setState({ selectedCex: cexName });
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "telegram") {
            this.setState({ tg_username: value });
        } else if (name === "twitter") {
            this.setState({ tw_username: value });
        } else if (name === "discord") {
            this.setState({ dc_username: value });
        } 
    }

    checkTelegram = () => {
        // const token = localStorage.getItem("authtoken");
        // const formData = new FormData();
        // formData.append("token", token);
        // formData.append("username", this.state.tg_username);
        
        // Start loading
        this.setState(prevState => ({
            verificationLoading: {
                ...prevState.verificationLoading,
                telegram: true
            }
        }));
        
        this.setState({ 
            checks: { ...this.state.checks, telegram: true },
            inpt_states: { ...this.state.inpt_states, telegram: true, twitter: false },
            verificationLoading: { ...this.state.verificationLoading, telegram: false }
        });

        // Axios.post(ApiUrl.checkTelegram, formData, {
        //     mode: 'cors',
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // })
        //     .then((response) => {
        //         console.log(response.data);
        //         if (response.data.is_subscribed === true && response.data.status === "member") {
        //             this.setState({ 
        //                 checks: { ...this.state.checks, telegram: true },
        //                 inpt_states: { ...this.state.inpt_states, telegram: true, twitter: false },
        //                 verificationLoading: { ...this.state.verificationLoading, telegram: false }
        //             });
        //         } else {
        //             // Reset states and show check button again
        //             this.setState({ 
        //                 checks: { ...this.state.checks, telegram: false },
        //                 showCheck: { ...this.state.showCheck, telegram: true }, // Changed to true
        //                 followDisabled: { ...this.state.followDisabled, telegram: false },
        //                 verificationLoading: { ...this.state.verificationLoading, telegram: false }
        //             });
        //             toast.error("Telegram verification failed. Please try again.");
        //         }
        //     })
        //     .catch((error) => {
        //         console.error("Error checking Telegram subscription:", error);
        //         // Reset states and show check button again
        //         this.setState({ 
        //             checks: { ...this.state.checks, telegram: false },
        //             showCheck: { ...this.state.showCheck, telegram: true }, // Changed to true
        //             followDisabled: { ...this.state.followDisabled, telegram: false },
        //             verificationLoading: { ...this.state.verificationLoading, telegram: false }
        //         });
        //         toast.error("Verification failed. Please try again.");
        //     });
    }
    checkTwitter = () => {
        this.setState({ 
            checks: { ...this.state.checks, twitter: true },
            inpt_states: { ...this.state.inpt_states, twitter: true, discord: false }
        });
    }
    checkDiscord = () => {
        this.setState({ 
            checks: { ...this.state.checks, discord: true },
            inpt_states: { ...this.state.inpt_states, discord: true }
        });
    }

    handleFollowClick = (taskId) => {
        // Disable input when follow is clicked
        this.setState(prevState => ({
            followDisabled: {
                ...prevState.followDisabled,
                [taskId]: true
            },
            timers: {
                ...prevState.timers,
                [taskId]: 15
            }
        }));

        // Start countdown
        const timer = setInterval(() => {
            this.setState(prevState => {
                const newTime = prevState.timers[taskId] - 1;
                
                if (newTime <= 0) {
                    clearInterval(timer);
                    // Show check button when timer reaches 0
                    return {
                        timers: {
                            ...prevState.timers,
                            [taskId]: 0
                        },
                        showCheck: {
                            ...prevState.showCheck,
                            [taskId]: true
                        }
                    };
                }

                return {
                    timers: {
                        ...prevState.timers,
                        [taskId]: newTime
                    }
                };
            });
        }, 1000);
    }

    submitData = () => {
        // Set submitting state to true
        this.setState({ isSubmitting: true });

        const submission_count = sessionStorage.getItem("submission_count");
        sessionStorage.setItem("submission_count", submission_count + 1);
        const token = localStorage.getItem("authtoken");
        const formData = new FormData();

        formData.append("token", token);
        formData.append("cex_type", this.state.selectedCex);
        formData.append("x_username", this.state.tw_username.replace("@", ""));
        formData.append("tg_username", this.state.tg_username.replace("@", ""));
        formData.append("dd_username", this.state.dc_username.replace("@", ""));

        // Add validation
        if (!token || !this.state.selectedCex || !this.state.tw_username || 
            !this.state.tg_username || !this.state.dc_username) {
            toast.error("Please fill in all required fields");
            this.setState({ isSubmitting: false });
            return;
        }

        // Send FormData
        Axios.post(ApiUrl.baseurl + "follow", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                if (response.data.message === "Followed successfully") {
                    toast.success("Submission successful!");
                    setTimeout(() => {
                        this.props.history.push("/wallet/view/POINT");
                    }, 2000);
                } else {
                    if (response.data.error === "One or more usernames already exist" && submission_count >= 2) {
                        toast.success("Submission successful!");
                        setTimeout(() => {
                            this.props.history.push("/wallet/view/POINT");
                        }, 2000);
                    }

                    toast.error(response.data.message || "Submission failed. Please try again.");
                    this.setState({ isSubmitting: false });
                }
            })
            .catch((error) => {
                console.error("Error submitting data:", error);
                toast.error(error.response?.data?.error || "Error submitting data. Please try again.");
                this.setState({ isSubmitting: false });
            });
    }


    render() {
            
            return (
                <>
                    <title>Choose Cex</title>
                    <RouteCheck/>
                    <div className="mobile-container earn" style={{background:"#D0E1F1"}}>
                        <div className="wallet-headerearn" style={{background:"#D0E1F1"}}>
                            <button className="back-btn" onClick={() => this.props.history.goBack()}>
                                <img src={backbtn} alt="Back" width="30px"/>
                            </button>
                            <h1 className="text-center mb-0 " style={{color:"#191b1c"}}>Choose Cex</h1>
                            <button className="notification-btn">
                            </button>
                        </div>
                        {this.state.loading ? (
                            <CexSkeleton/>
                        ) : this.state.isFollowed ? (
                            // Shows when user has already completed tasks
                            <div className="main-content px-4 py-3">
                                <h6 className="mt-4">You have already chosen and completed tasks</h6>
                                <div className='d-flex flex-column'>
                                    <div className='d-flex align-items-center'
                                        style={{
                                            background: "#E0EDF6", 
                                            padding: "10px", 
                                            borderRadius: "5px", 
                                            marginTop: "20px",
                                        }}>
                                        {this.state.selectedCex && (
                                            <img 
                                                src={this.state.cexOptions.find(cex => cex.id === this.state.selectedCex)?.logo || ''} 
                                                alt={`${this.state.selectedCex} Logo`}
                                                width="50px" 
                                                height="50px" 
                                                style={{border: "1px solid #022F64", borderRadius: "50%"}}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'default-cex-logo.png'; // Add a default logo image
                                                }}
                                            />
                                        )}
                                        <div style={{lineHeight: "1.2", marginLeft: "10px"}}>
                                            <h5 style={{color: "#022F64", fontWeight: "initial", marginBottom: 0, fontSize: "18px"}}>
                                                {this.state.cexOptions.find(cex => cex.id === this.state.selectedCex)?.name || this.state.selectedCex}
                                            </h5>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        ) : (
                            // Shows main content with CEX selection and tasks
                            <div className="main-content px-4 py-3">
                                <h6 className="mt-4">Select a Centralized Exchange</h6>

                                <div className='d-flex flex-column'>
                                    {this.state.cexOptions.map((cex) => (
                                        <div key={cex.id}
                                            className='d-flex justify-content-between align-items-center' 
                                            style={{
                                                background: "#E0EDF6", 
                                                padding: "10px", 
                                                borderRadius: "5px", 
                                                marginTop: "20px",
                                                cursor: cex.available ? "pointer" : "not-allowed",
                                                opacity: cex.available ? 1 : 0.6
                                            }}
                                            onClick={() => cex.available && this.handleCexChange(cex.id)}
                                        >
                                            <div className='d-flex align-items-center' style={{columnGap:"10px"}}>
                                                <img src={cex.logo} alt="Airdrop" width="50px" height="50px" style={{border: "1px solid #022F64", borderRadius: "50%"}}/>
                                                <div style={{lineHeight: "1.2"}}>
                                                    <h5 style={{color: "#022F64", fontWeight: "initial", marginBottom: 0, fontSize: "18px"}}>
                                                        {cex.name}
                                                    </h5>
                                                    {cex.name !== "Onclain Claim" && (
                                                        <p style={{fontWeight: "lighter", marginBottom: 0, marginTop: 0, fontSize: "12px"}}>
                                                            {cex.available ? "Choose your CEX" : "Coming Soon"}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <input 
                                                type="radio" 
                                                name="cex" 
                                                value={cex.id}
                                                checked={this.state.selectedCex === cex.id}
                                                onChange={() => this.handleCexChange(cex.id)}
                                                disabled={!cex.available}
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    accentColor: "#022F64",
                                                    cursor: cex.available ? "pointer" : "not-allowed",
                                                    marginRight: "15px"
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-4" style={{color:"red", fontSize: "12px", paddingLeft: "20px", paddingRight: "20px", textAlign: "center"}}>Note: More CEXs will be added soon for even greater flexibility in trading your 
                                    Zeros tokens.
                                </p>

                                {this.state.selectedCex && (
                                    <div className="mt-5 d-flex flex-column row-gap-3" style={{padding: "0px 20px"}}>
                                        <div className='d-flex flex-column'>
                                            <h5 style={{fontWeight: "600", fontSize: "24px"}}>Required Task</h5>
                                            <p style={{fontSize: "16px", color: "#666"}}>
                                                First enter the username and then complete the task.
                                            </p>
                                        </div>
                                        {this.state.tasks.map((task) => (
                                            <div className="d-flex flex-column row-gap-2" key={task.id}>
                                                <div className='d-flex justify-content-start align-items-center'>
                                                    <span>{task.name}</span>
                                                </div>
                                                <div className='d-flex gap-2'>
                                                    <input 
                                                        type="text" 
                                                        name={task.id}
                                                        placeholder={task.desc} 
                                                        className="form-control" 
                                                        style={{
                                                            border: "1px solid #022F64", 
                                                            borderRadius: "25px", 
                                                            padding: "10px 20px", 
                                                            background: this.state.followDisabled[task.id] ? "#f5f5f5" : "None", 
                                                            color: "#022F64"
                                                        }} 
                                                        onChange={this.handleInputChange}
                                                        value={task.id === "telegram" ? this.state.tg_username : task.id === "twitter" ? this.state.tw_username : this.state.dc_username}
                                                        disabled={this.state.followDisabled[task.id] || this.state.inpt_states[task.name.toLowerCase().split(" ")[0]]}
                                                    />
                                                    {this.state.showCheck[task.id] ? (
                                                        <button 
                                                            className={`text-decoration-none btn ${this.state.checks[task.id] ? 'btn-success' : 'btn-primary'} d-flex justify-content-center align-items-center`}
                                                            style={{
                                                                borderRadius: "25px", 
                                                                padding: "10px 20px", 
                                                                color: "#fff",
                                                                cursor: this.state.checks[task.id] ? "not-allowed" : "pointer",
                                                                minWidth: "100px"
                                                            }}
                                                            onClick={() => this[`check${task.id.charAt(0).toUpperCase() + task.id.slice(1)}`]()}
                                                            disabled={this.state.checks[task.id] || this.state.verificationLoading[task.id]}
                                                        >
                                                            {this.state.verificationLoading[task.id] ? (
                                                                <div className="spinner-border spinner-border-sm" role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                            ) : this.state.checks[task.id] ? (
                                                                <span>Completed</span>
                                                            ) : (
                                                                <span>Check</span>
                                                            )}
                                                        </button>
                                                    ) : this.state.timers[task.id] > 0 ? (
                                                        <button 
                                                            className="text-decoration-none btn btn-secondary" 
                                                            style={{
                                                                borderRadius: "25px", 
                                                                padding: "10px 20px", 
                                                                color: "#fff"
                                                            }}
                                                            disabled
                                                        >
                                                            {this.state.timers[task.id]}s
                                                        </button>
                                                    ) : (
                                                        <div className="position-relative" style={{ display: 'inline-block' }}>
                                                            <a 
                                                                href={task.link} 
                                                                target="_blank" 
                                                                className={`text-decoration-none btn ${
                                                                    (task.id === 'telegram' && this.state.tg_username) || 
                                                                    (task.id === 'twitter' && this.state.tw_username && this.state.checks.telegram) || 
                                                                    (task.id === 'discord' && this.state.dc_username && this.state.checks.twitter) 
                                                                        ? 'btn-primary' 
                                                                        : 'btn-secondary'
                                                                }`}
                                                                style={{
                                                                    background: (task.id === 'telegram' && this.state.tg_username) || 
                                                                              (task.id === 'twitter' && this.state.tw_username && this.state.checks.telegram) || 
                                                                              (task.id === 'discord' && this.state.dc_username && this.state.checks.twitter) 
                                                                                  ? "#022F64" 
                                                                                  : "#ccc", 
                                                                    borderRadius: "25px", 
                                                                    padding: "10px 20px", 
                                                                    color: "#fff",
                                                                    cursor: (task.id === 'telegram' && this.state.tg_username) || 
                                                                           (task.id === 'twitter' && this.state.tw_username && this.state.checks.telegram) || 
                                                                           (task.id === 'discord' && this.state.dc_username && this.state.checks.twitter) 
                                                                               ? "pointer" 
                                                                               : "not-allowed"
                                                                }}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    const isEnabled = 
                                                                        task.id === 'telegram' ? this.state.tg_username :
                                                                        task.id === 'twitter' ? (this.state.tw_username && this.state.checks.telegram) :
                                                                        task.id === 'discord' ? (this.state.dc_username && this.state.checks.twitter) :
                                                                        false;

                                                                    if (isEnabled) {
                                                                        window.open(task.link, '_blank');
                                                                        this.handleFollowClick(task.id);
                                                                    } else if (task.id !== 'telegram' && !this.state.checks.telegram) {
                                                                        toast.info(this.state.tooltips.twitter);
                                                                    } else if (task.id === 'discord' && !this.state.checks.twitter) {
                                                                        toast.info(this.state.tooltips.discord);
                                                                    }
                                                                }}
                                                            >
                                                                {task.name === "Telegram Username" ? "Follow" : task.name === "Twitter Username" ? "Follow" : "Join"}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <p style={{fontSize: "16px", color: "#666", marginTop: "10px"}}>
                                            For completing 3 tasks, you will receive <b>1,500 points</b> in your airdrop wallet.
                                        </p>
                                        
                                        {/* Add alert text */}
                                        <p style={{
                                            textAlign: "center",
                                            color: "#666",
                                            fontSize: "14px",
                                            marginTop: "20px",
                                            fontStyle: "italic"
                                        }}>
                                            Note: Submission process might take a little bit of time... Thank you for your patience!
                                        </p>

                                        <button
                                            className="d-flex justify-content-center align-items-center w-100"
                                            style={{
                                                background: this.state.checks.twitter && 
                                                        this.state.checks.telegram && 
                                                        this.state.checks.discord 
                                                    ? "#1877D1" 
                                                    : "#ccc",
                                                color: "#fff",
                                                fontSize: "18px",
                                                padding: "20px",
                                                border: "none",
                                                borderRadius: "10px",
                                                marginTop: "5px",
                                                cursor: this.state.checks.twitter && 
                                                        this.state.checks.telegram && 
                                                        this.state.checks.discord && 
                                                        !this.state.isSubmitting
                                                    ? "pointer" 
                                                    : "not-allowed"
                                            }}
                                            onClick={() => {
                                                if (!this.state.isSubmitting &&
                                                    this.state.checks.twitter && 
                                                    this.state.checks.telegram && 
                                                    this.state.checks.discord) {
                                                    this.submitData();
                                                }
                                            }}
                                            disabled={!this.state.checks.twitter || 
                                                    !this.state.checks.telegram || 
                                                    !this.state.checks.discord ||
                                                    this.state.isSubmitting}
                                        >
                                            {this.state.isSubmitting ? (
                                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            ) : (
                                                "Submit"
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    <br/><br/><br/><br/><br/><br/>
                    </div>
                    <Footer/>
                </>
            );
        }
}

export default ChooseCex;