import React, {Component} from 'react';
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png";
import {toast} from "react-toastify";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import RouteCheck from "../components/routeCheck";

class Withdrew extends Component {
    constructor({match}) {
        super();
        this.state={
            id:match.params.id,token:"",
            address:"",amount:"",coin_symbol:"",wallet:[],name:"",
            coin_name:"",balance:"0",logo_img:"",fee:"0",coin_id:"",platform:"",
            fee_coin:"",deposit:"",withdrew:"",fee_symbol:"",loading:false
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            var walletdata = JSON.parse(localStorage.getItem("wallet"))
            if(walletdata){
                this.setState({wallet:walletdata,loading:false})
            }
            setTimeout(()=>{
                this.getCurrentCoin()
            },100)
        }else {
            this.props.history.push("/home")
        }
    }

    getCurrentCoin=()=>{
        console.log(this.state.id)
        var coin = this.state.wallet.filter((val)=>{
            if(val.coin_symbol.toLowerCase()==this.state.id.toLowerCase()){
                return val;
            }
        })
        console.log(coin,"Withdrew")
        if(coin){
            var coins = coin[0]
            var feecoin=coins["fee_coin"]
            console.log("bal :",coin["balance"])
            console.log("id :",coins["coin_id"])
            this.setState({
                coin_symbol:coins["coin_symbol"],coin_name:coins["coin_name"],logo_img:coins["logo"],fee:coins["fee"],fee_coin:coins["fee_coin"],
                deposit:coins["deposit"],withdrew:coins["withdrew"],balance:coins["balance"],coin_id:coins["coin_id"],
                platform:coins["platform"]
            })
            if(coins["withdrew"]=="0"){
                this.errorMsg(coins["coin_symbol"]+" Withdrew not available")
                setTimeout(()=>{
                    this.props.history.push("/wallet")
                },2000)
            }
            var feecoinget = this.state.wallet.filter((val)=>{
                if(val.coin_id.includes(feecoin)){
                    return val;
                }
            })
            if(feecoinget.length>0){
                this.setState({fee_symbol:feecoinget[0]["coin_symbol"]})
            }else{
                this.setState({fee_symbol:this.state.id})
            }
        }
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
        const text =await navigator.clipboard.readText();
        this.setState({address:text})
    }
    max=()=>{
        this.setState({amount:this.state.balance})
    }
    address=(e)=>{
        this.setState({address:e.target.value})
    }
    amount=(e)=>{
        this.setState({amount:e.target.value})
    }

    onSubmit=()=>{
        var val = this.state
        if(parseFloat(val.balance)<parseFloat(val.amount)){
            this.errorMsg("Balance not enough")
        }
        if(parseFloat(val.balance)>parseFloat(val.amount)){
            this.setState({loading:true})
            var formd = new FormData()
            formd.append("token",val.token)
            formd.append("id",val.coin_id)
            formd.append("amount",val.amount)
            formd.append("toid",val.address)
            Axios.post(ApiUrl.baseurl+"auth/withdrew",formd)
                .then(res=>{
                    this.setState({loading:false})
                    if(res.data.error){
                        this.errorMsg(res.data.error)
                    }
                    if(res.data.success){
                        this.successMsg(res.data.success)
                        setTimeout(()=>{
                            this.props.history.push("/wallet")
                        },1000)
                    }
                })
                .catch(err=>{
                    //
                })
        }
    }


    render() {
        var val=this.state
        return (
            <>
                <title>Withdrew {this.state.id}</title>
                <RouteCheck/>
                <div className="container-fluid sendcoin" style={{height:"800px"}}>
                    <div className="header">
                        <br/><br/>
                        <Link onClick={()=>this.props.history.go(-1)} to="#" className="back-button">
                            <img src={backbtn} alt="Back" className="back-icon"/>
                        </Link>
                        <h1>Withdrew {this.state.id}</h1>
                        <h1></h1>
                    </div>

                    <div className="balance-card mx-3 my-4 p-3 text-center text-white">
                        <p className="mb-2">Total Balance :</p>
                        <div className="d-flex align-items-center justify-content-center">
                            <h2 className="mb-0">{parseFloat(this.state.balance)}</h2>
                        </div>
                    </div>

                    <div className="form-container px-3">
                        <div className="mb-4">
                            <label className="form-label">Enter Your Address Here</label>
                            <div className="input-group">
                                <input style={{borderRight:"0px"}} type="text" value={val.address} onChange={this.address}
                                       className="form-control custom-input shadow-none" placeholder={this.state.id+" address"}/>
                                <button style={{borderLeft:"0px"}} onClick={this.paste} className="btn btn-outline-secondary paste-btn shadow-none" type="button">Paste</button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Enter Your Amount Here</label>
                            <div className="input-group">
                                <input style={{borderRight:"0px"}} type="number" onChange={this.amount} value={val.amount}
                                       className="form-control custom-input shadow-none" placeholder={this.state.id+" Amount"}/>
                                <button style={{borderLeft:"0px"}} onClick={this.max} className="btn btn-outline-secondary max-btn shadow-none" type="button">Max</button>
                            </div>
                        </div>
                    </div>

                    <br/><br/>
                    <div className="detail-row" style={{padding:"0px 20px",marginTop:"20px",marginBottom:"20px"}}>
                        <span className="label">Withdrew Fee</span>
                        <span className="value">{parseFloat(this.state.fee).toFixed(8)} {this.state.fee_symbol} </span>
                    </div>

                    <div className="continue-btn-container px-3 mt-auto">
                        <button onClick={this.onSubmit} disabled={val.loading}
                                className="btn continue-btn w-100 shadow-none">{val.loading==true?"Loading...":"Withdrew"}</button>
                    </div>
                </div>
            </>
        );
    }
}

export default Withdrew;