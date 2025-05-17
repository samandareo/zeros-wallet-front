import React, {Component} from 'react';
import backbtn from "../images/Vector (2).svg"
import {Link} from "react-router-dom";
import jwtDecode from "jwt-decode";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import RouteCheck from "../components/routeCheck";

class Wallet extends Component {

    constructor() {
        super();
        this.state={
            token:"",wallet:[],loading:true
        }
        this.interval=null
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            var decoded = jwtDecode(token)
            setTimeout(()=>{
                this.getWallet()
            },500)
            var formD = new FormData()
            var walletdata = JSON.parse(localStorage.getItem("wallet"))
            if(walletdata){
                this.setState({wallet:walletdata,loading:false})
            }
            formD.append("id",decoded.user_id)
            Axios.post(ApiUrl.baseurl+"get/mywallet",formD)
                .then(res=>{
                    console.log(res.data, decoded.user_id)
                })
                .catch(err=>{
                    this.setState({loading:false})
                })

            var formDd = new FormData()
            formDd.append("token",token)
            Axios.post(ApiUrl.baseurl+"auth/deposit",formDd)
                .then(res=>{
                    console.log(res.data)
                })
                .catch(err=>{
                    //
                })

            this.interval= setInterval(()=>{
                var formDd = new FormData()
                formDd.append("token",token)
                Axios.post(ApiUrl.baseurl+"auth/deposit",formDd)
                    .then(res=>{
                        console.log(res.data)
                        setTimeout(()=>{
                            this.getWallet()
                        },1000)
                    })
                    .catch(err=>{
                        //
                    })
            },15000)
        }else {
            this.props.history.push("/home")
        }
    }

    getWallet=()=>{
        var formd = new FormData()
        formd.append("token",this.state.token)
        Axios.post(ApiUrl.baseurl+"auth/mywallet",formd)
            .then(res=>{
                console.log(res.data.data)
                if (res.data.success){
                    if(res.data.data.length>0){
                        this.setState({wallet:res.data.data,loading:false})
                        localStorage.setItem("wallet",JSON.stringify(res.data.data))
                    }
                }
            })
            .catch(err=>{
                this.getWallet()
                //localStorage.removeItem("authtoken")
            })
    }

    gotoDeposit=(val)=>{
        this.props.history.push(val)
    }
    gotoWithdrew=(val)=>{
        this.props.history.push(val)
    }

    componentWillUnmount(){
        try{
            clearInterval(this.interval)
            this.interval=null
            console.log("clear interval wallet")
        }catch(err){
            console.log(err)
        }
    }

    render() {
        var usd=0
        var data=this.state.wallet.map(res=>{
            var value =(parseFloat(res.balance)*parseFloat(res.price))
            usd+=value
            var bal=parseFloat(res.balance)
            var ch = parseFloat(res.day_change)
            return(
                <>

                    <Link to={"/wallet/view/"+res.coin_symbol} style={{textDecoration:"none"}}>
                        <div className="asset-item" data-toggle="modal">
                            <div className="asset-info">
                                <img src={res.logo} alt={res.coin_symbol}
                                     className="asset-icon"/>
                                <div style={{marginLeft:"-10px"}}>
                                    <h4 style={{color:"black"}}>{res.coin_symbol}{res.coin_symbol=="ETH"?" ("+res.platform+" Network)":""} <span style={{fontSize:"12px"}}
                                                                className={ch>0?"change positive":ch=="0"?"change text-black":"change text-danger"}>
                                    {parseFloat(res.day_change)>0?"+"+res.day_change:res.day_change}
                                </span></h4>
                                    <p style={{color:"black"}}>{(parseFloat(res.price)).toFixed(2)}$ </p>

                                </div>
                            </div>
                            <div className="asset-value">
                                <p className="" style={{color:"black"}}>
                                    {parseFloat(res.balance).toFixed(bal>0?bal<1?8:2:0)}
                                </p>
                                <p className="amount" style={{color:"black"}}>{(parseFloat(res.price)*parseFloat(res.balance)).toFixed(2)}$</p>
                            </div>
                        </div>
                    </Link>

                </>
            )
        })

        return (
            <>
                <title>Airdrop Wallet</title>
                <RouteCheck/>
                <div className="mobile-container wallet" style={{background:"#D0E1F1"}}>
                    <div className="wallet-header" style={{background:"#D0E1F1"}}>
                        <button className="back-btn">
                            <Link onClick={()=>this.props.history.go(-1)} to="#">
                                <img src={backbtn} alt="Back" width="30px"/>
                            </Link>
                        </button>
                        <h1 className="text-center mb-0 text-black">Airdrop</h1>
                        <Link to="/history" className="notification-btn text-black">
                            History
                        </Link>
                    </div>

                    <div className="wallet-balance">
                        <p className="wallet-label" style={{color:"black"}}>Airdrop Wallet</p>
                        <p className="balance-label" style={{color:"black"}}>Total Balance :</p>
                        <h2 className="balance-amount text-center" style={{color:"black"}}>$ {usd.toFixed(usd>1?2:4)}</h2>

                        <div className="action-buttons">
                            <Link to={"/wallet/depositlist"} style={{color:"black"}} className="btn action-btn deposit shadow-none">Deposit <span>+</span></Link>
                            <Link to={"/wallet/withdrewlist"} style={{color:"black"}} className="btn action-btn withdraw shadow-none">Withdraw <span>—</span></Link>
                            <button style={{color:"black"}} className="btn action-btn transfer shadow-none d-none">Transfer <span>↓</span></button>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3"
                         style={{borderBottom:"1px solid #024E91",
                             paddingBottom:"10px",paddingLeft:"35px",paddingRight:"30px"}}>
                        <h3 style={{color:"black"}}>Assets</h3>
                        <a href="#" className="view-all" style={{color:"black"}}>View All</a>
                    </div>
                    <div className="assets-section" style={{paddingTop:"0px"}}>

                        <div className="asset-list">
                            {data}
                            {
                                this.state.loading==true?
                                    <div style={{textAlign:"center",marginTop:"50px"}}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    :""
                            }

                        </div>
                    </div>
                </div>

            </>
        );
    }
}

export default Wallet;