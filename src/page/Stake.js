import React, {Component} from 'react';
import {Link} from "react-router-dom";
import backbtn from "../images/Vector (2).svg";
import {Button} from "bootstrap";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import {toast} from "react-toastify";
import jwtDecode from "jwt-decode";
import RouteCheck from "../components/routeCheck";

class Stake extends Component {
    constructor() {
        super();
        this.state={
            tab:"stake",token:"",data:[],
            balance:"0",coin_raw_id:"",days:"",profit:"5,10,15",status:"",coin_name:"",
            coin_symbol:"ETH",logo_img:"",min_invest:"0",wallet:[],rate:"",
            amount:"",day:"1",pp:"",terms:"no",percent:"0",price:"0",
            loadsubmit:false,profitsymbol:"",id:"",profit_coin:"",mystake:[]
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        var stake = JSON.parse(localStorage.getItem("stake"))
        if(stake){
            this.setState({data:stake})
            stake.filter((v)=>{
                if(v.coin_symbol==this.state.coin_symbol){
                    this.setState({logo_img:v.logo,days:v.days,profit:v.profit,id:v.id,profit_coin:v.profit_coin,
                        rate:v.rate,min_invest:v.min_invest,status:v.status,profitsymbol:v.profitsymbol,price:v.price})
                    //console.log(v)
                }
            })
        }
        Axios.post(ApiUrl.baseurl+"allstake")
            .then(res=>{
                //console.log(res.data," Stake List")
                this.setState({data:res.data,loading:false})
                res.data.filter((v)=>{
                    if(v.coin_symbol==this.state.coin_symbol){
                        this.setState({logo_img:v.logo,days:v.days,profit:v.profit,id:v.id,profit_coin:v.profit_coin,
                            rate:v.rate,min_invest:v.min_invest,status:v.status,profitsymbol:v.profitsymbol,price:v.price})
                    }
                })
                localStorage.setItem("stake",JSON.stringify(res.data))
            })
            .catch(err=>{
                //
            })
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            setTimeout(()=>{
                this.mytrx()
            },500)
            var walletdata = JSON.parse(localStorage.getItem("wallet"))
            if(walletdata){
                this.setState({wallet:walletdata})
                walletdata.filter(res=>{
                    if(res.coin_symbol==this.state.coin_symbol){
                        this.setState({balance:res.balance})
                    }
                })
            }
            setTimeout(()=>{
                this.getWallet()
            },200)
        }else {
            this.props.history.push("/home")
        }
    }
    getWallet=()=>{
        var formD = new FormData()
        formD.append("token",this.state.token)
        Axios.post(ApiUrl.baseurl+"auth/mywallet",formD)
            .then(res=>{
                console.log(res.data.data)
                if (res.data.success){
                    this.setState({wallet:res.data.data})
                    localStorage.setItem("wallet",JSON.stringify(res.data.data))
                    res.data.data.filter(res=>{
                        if(res.coin_symbol==this.state.coin_symbol){
                            this.setState({balance:res.balance})
                        }
                    })
                }
            })
            .catch(err=>{
                this.getWallet()
            })

    }

    mytrx=()=>{
        var token = this.state.token
        var decoded = jwtDecode(token)
        Axios.post(ApiUrl.baseurl+"mystake/"+decoded.user_id+"/1000")
            .then(res=>{
                if(res.data.error){
                    //
                }else{
                    console.log(res.data," Stake History")
                    this.setState({mystake:res.data,loading:false})
                }
            })
            .catch(err=>{
                //
            })
    }

    tab=(val)=>{
        this.setState({tab:val})
    }
    amount=(e)=>{
        this.setState({amount:e.target.value})
    }
    day=(e)=>{
        var v = e.target.value
        if(v!==""){
            this.setState({day:v})
            console.log(e.target.value,"Day")
        }
    }
    max=()=>{
        var v=this.state
        this.setState({amount:v.balance})
    }

    onName=(val)=>{
        this.setState({amount:"0"})
        this.state.data.filter((v)=>{
            if(v.coin_raw_id==val){
                this.setState({coin_symbol:v.coin_symbol,logo_img:v.logo,days:v.days,profit:v.profit,profit_coin:v.profit_coin,
                    rate:v.rate,min_invest:v.min_invest,status:v.status,profitsymbol:v.profitsymbol,id:v.id,price:v.price
                })
            }
        })
        this.state.wallet.filter(res=>{
            if(res.coin_id==val){
                this.setState({balance:res.balance})
            }
        })
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

    onSubmit=()=>{
        var val = this.state
        if(this.state.token==""){
            this.errorMsg("Login is required")
        }
        if(this.state.amount==""){
            this.errorMsg("Amount is required")
        }
        if(this.state.day==""){
            this.errorMsg("Day is required")
        }
        if(parseFloat(this.state.amount)>parseFloat(this.state.balance)){
            this.errorMsg("Your balance not enough")
        }
        if(parseFloat(this.state.min_invest)>parseFloat(this.state.amount)){
            this.errorMsg("Minimum invest "+this.state.min_invest+" "+this.state.coin_symbol)
        }
        if(val.day!=="" && val.token!=="" && val.amount!=="" && parseFloat(val.balance)>=parseFloat(val.amount) && parseFloat(val.amount)>=parseFloat(val.min_invest)){
            this.setState({loadsubmit:true})
            var formD = new FormData()
            formD.append("token",val.token)
            formD.append("days",val.day)
            formD.append("percent",val.percent)
            formD.append("amount",val.amount)
            formD.append("stakeid",val.id)
            Axios.post(ApiUrl.baseurl+"addstaketrx",formD)
                .then(res=>{
                    //console.log(res)
                    if(res.data.success){
                        this.successMsg(res.data.success)
                        this.getWallet()
                        this.mytrx()
                    }
                    if(res.data.error){
                        this.errorMsg(res.data.error)
                    }
                    this.setState({loadsubmit:false})
                })
                .catch(err=>{
                    this.setState({loadsubmit:false})
                })
        }
    }

    render() {
        var val=this.state
        var pp = []
        var dd = []
        try {
            pp = this.state.profit.split(",")
            dd = this.state.days.split(",")
        }catch (e){
            console.log("")
        }
        //console.log(dd,"Day")
        var coin = val.data.map(res=>{
            return(

            <div onClick={this.onName.bind(this,res.coin_raw_id)}  style={{background:"transparent"}}
                 className={"select-mainnet-item"} data-dismiss="modal">
                <img src={res.logo} alt=""/>
                <span style={{color:"#00182C",marginLeft:"-5px"}}>{res.coin_name} </span>
            </div>
            )
        })
        var daysec = dd.map(res=>{
            //console.log(res)
            return(
                <option selected={val.day==res}  value={res}> {res} Day</option>
            )
        });

        return (
            <>

                <title>Stake Coin</title>
                <RouteCheck/>
                <div className="container-fluid p-0 stake" style={{background:"#D0E1F1"}}>

                    <div className="wallet-header2" style={{background:"#D0E1F1"}}>
                        <button className="back-btn">
                            <Link onClick={()=>this.props.history.go(-1)} to="#">
                                <img src={backbtn} alt="Back" width="30px"/>
                            </Link>
                        </button>
                        <h1 className="text-center mb-0 " style={{color:"black"}}>Stake</h1>
                        <button className="notification-btn">

                        </button>
                    </div>

                    <div className="main-content p-4">
                        <p className="text-center  mb-4">
                            Stake ETH or ZEROS POINt and recieve zeros while staking
                        </p>

                        <div className="toggle-container mb-4">
                            <button onClick={this.tab.bind(this,"stake")}
                                    className={val.tab=="stake"?"btn active shadow-none":"btn shadow-none"}>stake</button>
                            <button onClick={this.tab.bind(this,"ustake")}
                                    className={val.tab=="ustake"?"btn active shadow-none":"btn shadow-none"}>your staked</button>
                        </div>


                        {val.tab=="stake"?
                            <div className="stake-form">
                            <div className="balance-info text-end mb-2">
                                <small className="text-black-50">Balance</small>
                                <p className="text-black mb-0">{parseFloat(val.balance).toFixed(4)}</p>
                            </div>

                                <div className="modal fade show"   id="exampleModal" tabIndex="-1" role="dialog"
                                     aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header" style={{borderBottom:"none"}}>
                                                <h5 className="modal-title"
                                                    id="exampleModalLabel" style={{fontSize:"16px"}}>Select Coin</h5>
                                                <button type="button shadow-none"
                                                        style={{background:"transparent",border:"none",fontSize:"20px"}} className="close" data-dismiss="modal"
                                                        aria-label="Close">
                                                    <span style={{color:"#00182C!important"}} aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                {coin}
                                                <br/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            <div className="input-group mb-4">
                                <button className="btn btn-outline-light d-flex" type="button" data-toggle="modal"  data-target="#exampleModal">
                                    <img src={val.logo_img} alt={val.coin_symbol} width="20"/>
                                    <p style={{padding:"0px",marginBottom:"0px",marginLeft:"5px"}}>{val.coin_symbol}</p>
                                    <i className="fas fa-caret-down" style={{marginTop:"6px",marginLeft:"2px"}}></i>
                                </button>
                                <input onChange={this.amount} type="number" value={val.amount}
                                       className="form-control shadow-none" placeholder="Type amount"/>
                                <button onClick={this.max} className="btn btn-outline-light">Max</button>
                            </div>

                                {val.amount!==""?
                                    <p style={{marginTop:"-10px"}}>${(parseFloat(val.price)*parseFloat(val.amount)).toFixed(4)}</p>:""
                                }

                            <div className="duration-selector mb-4">
                                <button
                                    className="btn btn-outline-light w-100 d-flex justify-content-between align-items-center">
                                    Duration <input type="number" onChange={this.day}
                                                    placeholder={"Type days here"}
                                                    style={{width:"130px",background:"transparent",border:"none",outline:"none"}}/>
                                    {this.state.day} Day
                                </button>
                            </div>

                            <div className="transaction-details">
                                <h6>Transaction Details</h6>
                                <div className="d-flex justify-content-between">
                                    <span style={{fontSize:"12px"}}>Rate</span>
                                    <span style={{fontSize:"12px"}}>1 {val.coin_symbol} = {val.rate} {val.profitsymbol}</span>
                                </div>
                                {val.amount?
                                    <div className="d-flex justify-content-between">
                                    <span style={{fontSize:"12px"}}>You get</span>
                                    <span style={{fontSize:"12px"}}>
                                        {parseFloat(val.amount).toFixed(2)} {val.coin_symbol} = {(parseFloat(val.amount)*parseFloat(val.rate)*parseFloat(val.day)).toFixed(2)} {val.profitsymbol}</span>
                                    </div>:""
                                }
                                <div className="d-flex justify-content-between">
                                    <span style={{fontSize:"12px",marginTop:"15px"}}>Note : Minimum 1 Day Maximum 45 Days Staking</span>
                                </div>
                            </div>

                            <button disabled={val.loadsubmit} onClick={this.onSubmit} className="btn btn-primary w-100 py-3 shadow-none"
                                    style={{background:"#014E92",border:"1px solid #014E92"}} >
                                {val.loadsubmit==true?"Submitting...":"Stake Now"}
                            </button>
                        </div>
                        :""}{/*onClick="document.getElementById('successModal').classList.add('show')"*/}

                    </div>


                    {val.tab=="stake"?<div className="staking-policy" style={{color:"black"}}>
                        <h6 style={{color:"black"}}>Staking Policy:</h6>
                        <ol>
                            <li>Minimum Staking Amount: The minimum amount required to start staking is $1.</li>
                            <li>Rewards Calculation:
                                <ul>
                                    <li>Earn 50 points for every $1 staked in ETH staking.</li>
                                    <li>Earn 60 points for every $1 staked in Zero Points staking.</li>
                                </ul>
                            </li>
                            <li>Reward Distribution: Points will be credited to your account immediately upon successful
                                staking.
                            </li>
                            <li>Lock-In Period: Staked funds are subject to a lock-in period as per the staking terms
                                mentioned during the transaction.
                            </li>
                            <li>Withdrawal Policy: Withdrawal of staked funds may be subject to a cooldown period and
                                applicable fees.
                            </li>
                            <li>Changes to Policy: Staking rewards and policies are subject to change based on market
                                conditions and platform updates.
                            </li>
                        </ol>
                        <p className="policy-footer">
                            By participating in staking, users agree to abide by these terms and conditions. For
                            detailed information, please refer to our Staking Terms & Conditions.
                        </p>
                    </div>:""}


                    {val.tab=="ustake"?
                        <>
                            <div className="row" style={{paddingLeft:"25px",paddingRight:"25px",
                                borderBottom:"1px solid #075DFF",paddingBottom:"30px",marginTop:"-20px"}}>
                                <div className="col-6">
                                    <h5 style={{color:"black",fontWeight:"500"}}>Your Staking</h5>
                                </div>
                                <div className="col-6" style={{textAlign:"right"}}>
                                    <button style={{borderRadius:"25px",fontSize:"14px",padding:"10px 20px"}}
                                            className="btn btn-primary"
                                            onClick={this.tab.bind(this,"stake")}>New Stake</button>
                                </div>
                            </div>


                            {val.mystake.map(res=>{
                                return(
                                    <>
                                        <div className="card staking-card" style={{background:"transparent",borderBottom:"1px solid #075DFF"}}>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <div className="amount">
                                                        <img src={res.logo} alt=""
                                                             width="30px"/>
                                                        <span className="value" style={{color:"black"}}>{parseFloat(res.amount).toFixed(2)}</span>
                                                    </div>
                                                    <div style={{color:"black"}} className="date text-end">{res.created_at}</div>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="stake-info">
                                                        <div style={{color:"black"}} className="stake-label">Staking end</div>
                                                        <div style={{color:"black"}} className="time-left">Staking Bonus</div>
                                                        <div style={{color:"black"}} className="time-left">Status</div>
                                                    </div>
                                                    <div className="text-end">
                                                        <div style={{color:"black"}} className="time">{res.enddate}</div>
                                                        <div style={{color:"black"}} className="time">{parseFloat(res.ftotal).toFixed(2)} {res.profit_coin}</div>
                                                        <button className="your-stake-btn btn-primary-claim">{res.status}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                </>
                                )
                            })}

                        </>:""}


                    <div className="success-modal " id="successModal">
                        <div className="modal-content text-center">
                            <h2 className="mb-3">Success!</h2>
                            <p className="mb-4">Your stake has successfully been delegated to your chosen validator</p>
                            <button className="btn btn-primary w-100"
                                    onClick="document.getElementById('successModal').classList.remove('show')">
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>


            </>
        );
    }
}

export default Stake;