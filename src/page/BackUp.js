import React, {Component} from 'react';
import {toast, ToastContainer} from "react-toastify";
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png";
import QRCode from "react-qr-code";
import copy from "../images/copy-solid.svg";
import share from "../images/share-nodes-solid.svg";
import jwtDecode from "jwt-decode";
import RouteCheck from "../components/routeCheck";

class BackUp extends Component {
    constructor({match}) {
        super();
        this.state={
            id:match.params.id,
            address:"",
            token:"",key1:"",password:"",verify:false,passworddd:""
        }
    }


    componentDidMount() {
        window.scrollTo(0, 0);
        var password = localStorage.getItem("password")
        if(password){
            this.setState({password:password,verify:true})
        }
        var token = localStorage.getItem("authtoken")
        if(token){
            var decoded = jwtDecode(token)
            //console.log(decoded)
            var key1 = decoded.key1
            this.setState({token:token,address:decoded.uid,key1:key1})
        }else {
            this.props.history.push("/home")
        }
    }

    onCopyClipboard=()=>{
        navigator.clipboard.writeText(this.state.address)
        toast.success(this.state.address, {
            theme: "colored",
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        });
        localStorage.setItem("backup",true)
    }

    onCopyPrivate=()=>{
        navigator.clipboard.writeText(this.state.key1)
        toast.success(this.state.key1, {
            theme: "colored",
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        });
        localStorage.setItem("backup",true)
    }

    err=(val)=>{
        toast.error(val, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    success=(val)=>{
        toast.success(val, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    passworddd=(e)=>{
        this.setState({passworddd:e.target.value})
    }

    submitD=()=>{
        if(this.state.passworddd==""){
            this.err("Password required")
        }

        if(this.state.passworddd!=="" && this.state.passworddd!==this.state.password ){
            this.err("Ivalid Password")
        }
        if(this.state.passworddd!=="" && this.state.passworddd==this.state.password ){
            this.setState({verify:false})
        }

    }

    render() {
        return (
            <>
                <title>Backup Wallet Key</title>
                <RouteCheck/>
                {this.state.verify==true?
                    <div className="container-fluid wallet-container" style={{minHeight: "800px", height: "auto"}}>
                        <title>Password</title>
                        <div className="wallet-header2" style={{background: "#D0E2F1"}}>
                            <button className="back-btn" style={{background: "transparent", border: "none"}}>
                                <Link onClick={()=>this.props.history.go(-1)} to="#">
                                    <img src={backbtn} style={{marginLeft: "-20px"}} alt="Back" width="30px"/>
                                </Link>
                            </button>
                            <h3 className="text-center mb-0 " style={{color: "#000000"}}>Password</h3>
                            <button className="notification-btn">

                            </button>
                        </div>
                        <br/><br/>
                        <div className="password-setup">
                            <h2 className="text-center mb-3">Verify Your Password</h2>
                            <br/><br/>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-group">
                                    <input onChange={this.passworddd} type="password" className="form-control shadow-none"
                                           id="password"
                                           placeholder=""/>
                                </div>
                            </div>


                            <button onClick={this.submitD} type="submit"
                                    className="btn btn-primary w-100 py-2 shadow-none">Submit
                            </button>
                        </div>
                    </div>
                    :
                    <div className="container-fluid wallet-container receivepage" style={{height:"auto"}}>
                        <br/>
                        <div className="header">
                            <Link to={"/"} className="back-button">
                                <img src={backbtn} alt="Back" className="back-icon"/>
                            </Link>
                            <h1>Backup Wallet </h1>
                        </div>
                        <ToastContainer
                            theme="colored"
                            position="top-right"
                            autoClose={1000}
                            hideProgressBar
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                        <br/>
                        <div className="warning-text">
                            Save your wallet recovery key keep safe place

                            Don’t share your wallet key. If you share your

                            wallet key you can lose your funds
                        </div>

                        <h1>Zeros wallet Secret key</h1>
                        <div className="qr-container">
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "200px", width: "150px",textAlign:'center' }}
                                value={this.state.address}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <p style={{textAlign:"center",color:"red"}}>
                            Note: This Secret key is only for use with the
                            Zeros Wallet.
                        </p>
                        <div className="address" style={{fontSize:"13px"}}>{this.state.address} <img onClick={this.onCopyClipboard} src={copy} alt="Copy" className="btn-icon"/></div>

                        <h1>Your wallet private key</h1>
                        <div className="qr-container">
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "200px", width: "150px",textAlign:'center' }}
                                value={this.state.key1}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <p style={{textAlign:"center",color:"red"}}>
                            Note: This private key can only be imported into
                            a decentralized wallet.
                        </p>
                        <div className="address" style={{fontSize:"13px"}}>{this.state.key1} <img onClick={this.onCopyPrivate} src={copy} alt="Copy" className="btn-icon"/></div>



                    </div>
                }
            </>
        );
    }
}

export default BackUp;