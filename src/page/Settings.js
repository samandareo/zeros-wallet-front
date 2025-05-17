import React, {Component} from 'react';
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png";
import announce from "../images/announce-icon-01.png";
import {toast} from "react-toastify";
import RouteCheck from "../components/routeCheck";

class Settings extends Component {
    constructor() {
        super();
        this.state={
            token:"",backup:false,password:""
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem("authtoken")
        if(token){
            var backup = localStorage.getItem("backup")
            if(backup){
                this.setState({backup:backup})
            }
            var password = localStorage.getItem("password")
            if(password){
                this.setState({password:password})
            }
            this.setState({token:token})
        }else {
            this.props.history.push("/home")
        }
    }

    successMsg=(val)=>{
        toast.success(val,  {
            theme: "colored",
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    logOut=()=>{
        localStorage.removeItem("authtoken")
        localStorage.removeItem("dwallet")
        localStorage.removeItem("wallet")
        localStorage.removeItem("task")
        localStorage.removeItem("taskpay")
        localStorage.removeItem("hide")
        localStorage.removeItem("backup")
        localStorage.removeItem("password")
        localStorage.removeItem("signup")
        localStorage.removeItem("badge")
        this.successMsg("Successfully Logout")
        setTimeout(()=>{
            this.props.history.push("/home")
        },500)
    }


    setPass=()=>{
        this.successMsg("Password Already setup")
    }

    render() {
        var val = this.state
        return (
            <div style={{background:"#D0E2F1",width:"100%",height:"100%"}}>
                <title>Settings - Zeros Wallet </title>
                <RouteCheck/>
                <div className="container-fluid wallet-container" style={{background:"#D0E2F1"}}>
                    <div className="wallet-header2" style={{background:"#D0E2F1"}}>
                        <button className="back-btn" style={{background:"transparent",border:"none"}}>
                            <Link onClick={()=>this.props.history.go(-1)} to="#">
                                <img src={backbtn} style={{marginLeft:"-20px"}} alt="Back" width="30px"/>
                            </Link>
                        </button>
                        <h3 className="text-center mb-0 " style={{color:"#000000"}}>Setting</h3>
                        <button className="notification-btn">

                        </button>
                    </div>
                    <br/>
                    <p className="text-muted mb-3">General</p>

                    <div className="settings-group mb-4">
                        <Link to="/support" className="setting-item">
                            <i className="bi bi-headset"></i>
                            <span>Support</span>
                        </Link>

                        <Link to="/about" className="setting-item">
                            <i className="bi bi-question-circle"></i>
                            <span>About us</span>
                        </Link>

                        <Link to="/terms" className="setting-item">
                            <i className="bi bi-question-circle"></i>
                            <span>Terms & Condition</span>
                        </Link>

                        {
                            this.state.password==""?
                                <Link to="/password" className="setting-item">
                                    <i className="bi bi-shield-lock"></i>
                                    <span>Security</span>
                                </Link>:
                                <Link to="#" onClick={this.setPass} className="setting-item">
                                    <i className="bi bi-shield-lock"></i>
                                    <span>Security</span>
                                </Link>
                        }
                        <Link to="/backup" className="setting-item">
                            <i className="bi bi-shield-lock"></i>
                            <span>Backup Wallet</span>
                        </Link>
                        {
                            this.state.backup=="true"?""
                                :""
                        }

                    </div>

                    <p className="text-muted mb-3">Our Channels</p>

                    <div className="settings-group">
                        <a target="_blank" href="https://t.me/ZerosWallet" className="channel-item">
                            <i className="bi bi-telegram"></i>
                            <span>Telegram</span>
                        </a>

                        <a target="_blank" href="https://x.com/Zeros_wallet" className="channel-item">
                            <i className="bi bi-twitter-x"></i>
                            <span>Twitter</span>
                        </a>

                        <a target={"_blank"} href="https://discord.gg/BAYJdJKWPn" className="channel-item">
                            <i className="bi bi-discord"></i>
                            <span>Discord</span>
                        </a>
                    </div>

                    <div className="logout-container">
                        <button onClick={this.logOut} className="logout-btn">Log Out</button>
                    </div>
                    <br/><br/><br/><br/><br/><br/><br/><br/>
                </div>
            </div>
        );
    }
}

export default Settings;