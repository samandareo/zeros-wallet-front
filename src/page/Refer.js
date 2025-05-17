import React, {Component} from 'react';
import backbtn from "../images/Vector (2).svg"
import {Link} from "react-router-dom";
import jwtDecode from "jwt-decode";
import {toast} from "react-toastify";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import RouteCheck from "../components/routeCheck";

class Refer extends Component {
    constructor() {
        super();
        this.state={
            token:"",refcode:"",refer_by:"",setrefer:"",loading:true
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            var decoded = jwtDecode(token)
            //console.log(decoded)
            this.setState({token:token,refcode:decoded.refcode})
            setTimeout(()=>{
                this.getData()
            },500)
        }else {
            this.props.history.push("/home")
        }
    }

    getData=()=>{
        var formD = new FormData()
        formD.append("token",this.state.token)
        Axios.post(ApiUrl.baseurl+"myreferral",formD)
            .then(res=>{
                if(res.data.success){
                    //console.log(res.data)
                    this.setState({refer_by:res.data.refer_by,loading:false})
                }
            })
            .catch(err=>{
                this.submitData()
            })

    }

    onCopyClipboard=()=>{
        navigator.clipboard.writeText(this.state.refcode)
        toast.success(this.state.refcode, {
            theme: "colored",
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        });
    }


    refer_by=(e)=>{
        this.setState({setrefer:e.target.value})
    }

    errorMsg=(val)=>{
        toast.error(val, {
            theme: "colored",
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
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

    submitData=()=>{
        var val = this.state
        if(val.setrefer=="" || val.setrefer==val.refcode){
            this.errorMsg("Referral code  is required")
        }else{
            var formD = new FormData()
            formD.append("refcode",val.setrefer)
            formD.append("token",val.token)
            Axios.post(ApiUrl.baseurl+"/addreferral",formD)
                .then(res=>{
                    if(res.data.error){
                        this.errorMsg(res.data.error)
                    }else{
                        //console.log(res.data.token)
                        this.successMsg(res.data.success)
                        this.getData()
                    }
                })
                .catch(err=>{
                    this.setState({loading:false})
                })
        }

    }

    render() {
        var val=this.state
        return (
            <>
                <title>Referral</title>
                <RouteCheck/>
                <div className="refer p-0" style={{background:"#D0E1F1"}}>
                    <div className="wallet-header2" style={{background:"#D0E1F1"}}>
                        <button className="back-btn" style={{border:"none",background:"transparent"}}>
                            <Link onClick={()=>this.props.history.go(-1)} to="#">
                                <img src={backbtn} alt="Back" width="30px"/>
                            </Link>
                        </button>
                        <h3 className="text-center mb-0 ">Refer</h3>
                        <button className="notification-btn">

                        </button>
                    </div>
                    <br/>

                    <div className="main-content text-center  p-4">
                        <h2 className="mb-3">Get 20 Points Instantly + 7% Commission on Every Referral!</h2>

                        <div className="how-to-start mt-4">
                            <h3>How to Start:</h3>
                            <ol className="text-start ps-4">
                                <li>Submit your friend's refer code.</li>
                                <li>Share your unique referral code with friends.</li>
                                <li>Watch your rewards grow as they join!</li>
                            </ol>
                            <p className="mt-3">Don't miss out on this easy way to earn! </p>
                        </div>
                    </div>

                    <div className="referral-section p-4">
                        <div className="code-box mb-4">
                            <label style={{color:"black"}}>your refer code</label>
                            <div className="input-group">
                                <input style={{background:"#024E91",color:"white"}} type="text" className="form-control shadow-none" value={val.refcode} readOnly/>
                                    <button onClick={this.onCopyClipboard} className="btn btn-primary shadow-none" type="button">
                                        <i className="bi bi-files"></i> copy
                                    </button>
                            </div>
                        </div>

                        {val.loading==false?<>
                            <div className="submit-code">
                                <label style={{color:"black"}}>submit friend's refer code</label>
                                <div className="code-input-group">
                                    {val.refer_by==""?
                                        <input style={{background:"#024E91",color:"white"}} type="text" onChange={this.refer_by} value={val.setrefer}  className="form-control w-100 shadow-none"/>
                                        :<input style={{background:"#024E91",color:"white"}} type="text" readOnly={true}  value={val.refer_by}  className="form-control w-100 shadow-none"/>
                                    }
                                </div>
                            </div>

                            <button onClick={this.submitData} disabled={val.refer_by?true:false}
                                    className="btn btn-primary w-100 mt-4 shadow-none">{val.refer_by?"Done":"Submit"}</button>
                        </>:""}
                    </div>
                </div>
            </>
        );
    }
}

export default Refer;