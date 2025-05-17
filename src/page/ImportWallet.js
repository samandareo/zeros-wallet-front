import React, {Component} from 'react';
import backbtn from "../images/back-button.png"
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import RouteCheck from "../components/routeCheck";

class ImportWallet extends Component {

    constructor() {
        super();
        this.state={
            key:"",loading:false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem("authtoken")
        if(token){
            this.props.history.push("/")
        }
    }
    key=(e)=>{
        this.setState({key:e.target.value})
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

     paste=async ()=>{
        const text =await navigator.clipboard.readText()
            .then(

            ).catch(
                //
            )
         this.setState({key:text})

    }

    submitData=(event)=>{
        event.preventDefault()
        var val = this.state
        if(val.key==""){
            this.errorMsg("Key is required")
        }else{
            this.setState({loading:true})
            var formD = new FormData()
            formD.append("uid",val.key)
            Axios.post(ApiUrl.baseurl+"login",formD)
                .then(res=>{
                    if(res.data.error){
                      this.errorMsg(res.data.error)
                    }else{
                        //console.log(res.data.token)
                        this.successMsg(res.data.success)
                        localStorage.setItem("authtoken",res.data.token)
                        setTimeout(()=>{
                            this.props.history.push("/")
                        },1000)
                    }
                    this.setState({loading:false})
                })
                .catch(err=>{
                    this.setState({loading:false})
                })
        }

    }

    render() {
        return (
            <>
                <title>Import Wallet</title>
                <RouteCheck/>
            <div class="container-fluid wallet-container import" style={{minHeight:"800px",height:"auto"}}>
                <div class="header">
                    <Link to="/home" class="back-button">
                        <img src={backbtn} alt="Back" class="back-icon" width="30px"/>
                    </Link>
                    <h1>Import wallet</h1>
                </div>

                <br/><br/>
                <form onSubmit={this.submitData}>
                    <div class="mb-4">
                        <label class="form-label">RECOVERY KEY</label>
                        <div class="recovery-phrase-input">
                            <textarea onChange={this.key}
                                     value={this.state.key} class="form-control" rows="4" placeholder="type the recovery key"></textarea>
                            <button onClick={this.paste} type="button" class="paste-btn">paste</button>
                        </div>
                    </div>


                    <button type="submit" disabled={this.state.loading}
                            class="btn btn-import w-100 shadow-none">
                        {this.state.loading==true?"Loading Wallet ...":"Import"}
                    </button>
                </form>
            </div>


            </>
        );
    }
};

export default ImportWallet;