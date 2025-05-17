import React, {Component} from 'react';
import logo from "../images/3d-3.png"
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png";
import {toast} from "react-toastify";
import RouteCheck from "../components/routeCheck";

class Password extends Component {
    constructor() {
        super();
        this.state={
            password:"",confirm:""
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        var password = localStorage.getItem("password")
        if(password){
            this.props.history.push("/settings")
        }
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
    password=(e)=>{
        this.setState({password:e.target.value})
    }
    confirm=(e)=>{
        this.setState({confirm:e.target.value})
    }

    submitD=()=>{
        var val =this.state
        if(val.password==""){
            this.err("Password required")
        }
        if(val.password!==val.confirm){
            this.err("Password don't match")
        }
        if(val.password!=="" && val.password==val.confirm){
            localStorage.setItem("password",val.password)
            this.success("Password set successfully")
            setTimeout(()=>{
                this.props.history.push("/settings")
            },1000)
        }

    }

    render() {
        return (
            <>
                <RouteCheck/>
            <div class="container-fluid wallet-container" style={{minHeight:"800px",height:"auto"}}>
                <title>Password</title>
                <div className="wallet-header2" style={{background:"#D0E2F1"}}>
                    <button className="back-btn" style={{background:"transparent",border:"none"}}>
                        <Link onClick={()=>this.props.history.go(-1)} to="#">
                            <img src={backbtn} style={{marginLeft:"-20px"}} alt="Back" width="30px"/>
                        </Link>
                    </button>
                    <h3 className="text-center mb-0 " style={{color:"#000000"}}>Password</h3>
                    <button className="notification-btn">

                    </button>
                </div>
                <br/><br/>
                <div class="password-setup">
                    <h2 class="text-center mb-3">Set Your Password</h2>
                    <p class="text-center text-muted mb-4">In order to keep your account safe you need to create a strong password.</p>
                    <br/><br/>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-group">
                            <input onChange={this.password} type="password" className="form-control shadow-none" id="password"
                                   placeholder=""/>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <div className="input-group">
                            <input onChange={this.confirm} type="password" className="form-control shadow-none" id="confirmPassword"
                                   placeholder=""/>
                        </div>
                    </div>

                    <button onClick={this.submitD} type="submit" className="btn btn-primary w-100 py-2 shadow-none">Set Up</button>
                </div>
            </div>


            </>
        );
    }
}

export default Password;