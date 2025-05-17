import React, {Component} from 'react';
import zeros from "../images/output-onlinegiftools.gif"
import {toast} from "react-toastify";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import RouteCheck from "../components/routeCheck";

class CreateWallet extends Component {
    constructor() {
        super();
        this.state={
            loading:true
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem("authtoken")
        if(token){
            this.props.history.push("/")
        }
        this.submitData()
    }

    errorMsg=(val)=>{
        toast.error(val, {
            theme: "colored",
            position: "bottom-center",
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
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    submitData=()=>{
        this.setState({loading:true})
        Axios.post(ApiUrl.baseurl+"createwallet")
            .then(res=>{
                if(res.data.success){
                    //console.log(res.data.token)
                    this.successMsg("Wallet Created and "+res.data.success)
                    localStorage.setItem("authtoken",res.data.token)
                    localStorage.setItem("signup","1")
                    setTimeout(()=>{
                        this.props.history.push("/")
                    },5000)
                }else{
                    this.errorMsg("Try Again Something wrong")
                }
                this.setState({loading:false})
            })
            .catch(err=>{
                this.setState({loading:false})
            })

    }


    render() {
        return (
            <div className="container-fluid wallet-container" style={{minHeight:"800px",height:"auto"}}>
                <title>Create Wallet</title>
                <RouteCheck/>
                <div className="wallet-content text-center" style={{paddingTop:"80px"}}>
                    <div className="wallet-image mb-4" style={{padding:"40px"}}>
                        <img src={zeros} alt="Wallet Icon" className="img-fluid"/>
                    </div>
                    <div className="wallet-status mb-3">
                        <p className="text-muted mb-2">We are creating your wallet</p>
                        {this.state.loading==false?
                            <h2 className="wallet-title">Your wallet is now <span className="text-primary">Ready</span></h2>:""}
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateWallet;