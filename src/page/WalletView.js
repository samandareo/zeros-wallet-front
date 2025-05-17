import React, {Component} from 'react';
import cryptoBalanceCheck from "../components/cryptoBalanceCheck";
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png";
import ApiUrl from "../AppUrl/ApiUrl";
import arrow from "../images/arrows-rotate-solid-(1).png";
import sendicon from "../images/send-icon.png";
import receiveicon from "../images/receive-icon.png";
import earnwhite from "../images/earnwhite.png";
import historyicon from "../images/historyicon.png";
import Base from "../components/transactions/Base";
import Eth from "../components/transactions/Eth";
import Bnb from "../components/transactions/Bnb";
import Avax from "../components/transactions/Avax";
import Matic from "../components/transactions/Matic";
import Fantom from "../components/transactions/Fantom";
import Tron from "../components/transactions/Tron";
import moment from "moment";
import Axios from "axios";
import RouteCheck from "../components/routeCheck";

class WalletView extends Component {
    constructor({match}) {
        super();
        this.state={
            id:match.params.id,token:"",amount:"",rpc:"",chain:"",
            address:"",coin_symbol:"",logo:"",coin_name:"",decimal:"",
            price:"",day_change:"",platform:"",bal:"",type:"",contract:"",
            sendtrx:false,coin_type:"",deposit:"0",withdrew:"0",data:[],loading:true
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var dwallet = JSON.parse(localStorage.getItem("wallet"))
        if(dwallet){
            dwallet.filter((res)=>{
                if(this.state.id==res.coin_symbol){
                    this.setState({coin_symbol:res.coin_symbol,logo:res.logo,
                        price:res.price,day_change:res.day_change,coin_type:res.coin_type,
                        platform:res.platform,bal:res.balance,type:res.coin_type,
                        contract:res.contract,coin_name:res.coin_name,deposit:res.deposit,withdrew:res.withdrew,
                    })
                }
            })
        }
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            var formd = new FormData()
            formd.append("token",token)
            formd.append("limit","500")
            Axios.post(ApiUrl.baseurl+"auth/payments",formd)
                .then(res=>{
                    console.log(res.data.data,"My TRX")
                    if (res.data.success){
                        this.setState({data:res.data.data,loading:false})
                        localStorage.setItem("mytrx",JSON.stringify(res.data.data))
                    }
                })
                .catch(err=>{
                    //localStorage.removeItem("authtoken")
                    this.componentDidMount()
                })
        }else {
            this.props.history.push("/home")
        }
    }

    render() {
        var val = this.state
        var d = this.state.data.filter((v)=>{
            if(v.coin_symbol==val.coin_symbol){
               return v
            }
        })
        var trx=d.map(res=>{
            return(
                <div style={{padding:"20px 30px"}} className="transaction-item transaction-item2 receive">
                    <div className="transaction-info">

                        <div className="transaction-details" style={{paddingLeft:"5px"}}>
                            <div className="address">
                                ID
                            </div>
                            <div className="address">
                                {res.trx=="N/A"?"Hash N/A":
                                    <a href={res.explorer+"/tx/"+res.trx} target="_blank">
                                        {res.trx.substring(0,20)+"..."}
                                    </a>
                                }
                            </div>
                            <div className="type" style={{fontSize:"14px",color:"black"}}>{res.type}</div>
                            <div className="type" style={{fontSize:"14px",color:"black"}}>Status</div>
                        </div>
                    </div>
                    <div className={res.type=="Withdrew"?"transaction-amount negative":"transaction-amount positive"}>
                        <div className="time" style={{fontSize:"14px",color:"black"}}>{res.id}</div>
                        <div className="amount">{res.type=="Withdrew"?"-"+res.amount:"+"+res.amount} {res.coin_symbol}</div>
                        <div className="time" style={{fontSize:"14px",color:"black"}}>{moment(res.created_at).format('L')}</div>
                        <div className="time" style={{fontSize:"14px",color:res.status=="Success"?"green":"black"}}>{res.status}</div>
                    </div>
                </div>
            )
        })

        return (
            <>
                <title>{this.state.coin_name}</title>
                <RouteCheck/>
                <div className="mobile-container coindetails">
                    <div className="wallet-header">
                        <Link onClick={()=>this.props.history.go(-1)} to="#" className="back-btn">
                            <img src={backbtn} alt="Back" width="30px"/>
                        </Link>
                        <h1 className="text-center mb-0">{this.state.coin_name}</h1>
                        <button className="notification-btn">

                        </button>
                    </div>
                    <br/>
                    <div className="wallet-card">
                        <div className="coin-info">
                            {val.logo?
                                <img src={val.logo} alt=""
                                     className="coin-logo"/>:""
                            }
                            <div className="coin-details">
                                <span className="coin-label">{val.type}</span>
                                <span className="coin-name">{val.coin_name}</span>
                                <span className="coin-label">{val.platform=="Binance"?"BSC Smart Chain":val.platform} Network</span>
                            </div>
                        </div>
                        <div className="balance">
                            <h2>{parseFloat(val.bal).toFixed(8)} {val.coin_symbol}</h2>
                            <p className="fiat-value">${(parseFloat(val.bal)*parseFloat(val.price)).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="action-grid">
                        {
                            this.state.deposit=="1"?
                                <Link to={"/wallet/withdrew/"+this.state.coin_symbol}
                                      style={{padding:"10px",width:"130px",
                                          background:"#2168AA",color:"#ffffff",
                                          textDecoration:"none",borderRadius:"10px",height:"45px",
                                          textAlign:"center"
                                      }}  className="">
                                    <div>Withdrew</div>
                                </Link>:""
                        }
                        {
                            this.state.deposit=="1"?
                                <Link disabled={this.state.withdrew=="0"}
                                      to={"/wallet/deposit/"+this.state.coin_symbol}
                                      style={{padding:"10px",width:"130px",
                                          background:"#2168AA",color:"#ffffff",
                                          textDecoration:"none",borderRadius:"10px",height:"45px",
                                          textAlign:"center"
                                      }}
                                      className="">
                                    <div>Deposit</div>
                                </Link>:""
                        }

                    </div>


                    {/*
                    <div className="price-chart">
                        <div className="price-header">
                            <div>
                                <div className="current-price">Current BTC Price</div>
                                <div className="btc-amount">0.02 BTC</div>
                            </div>
                            <span className="percentage-change">+2%</span>
                        </div>
                        <div className="chart-line">
                            <svg viewBox="0 0 100 20">
                                <path d="M0,10 Q25,5 50,10 T100,10" fill="none" stroke="#28a745" stroke-width="2"/>
                            </svg>
                        </div>
                    </div>
                    */}

                    <br/>
                    <div className="transaction-list">
                        <h1>Transaction</h1>
                        {
                            val.loading==true?
                                <div style={{textAlign:"center",marginTop:"50px"}}>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                                :
                        trx
                        }
                        {d.length==0 && val.loading==false?
                            <div className="text-center" role="status">
                                <p style={{marginTop:"100px",marginBottom:"200px"}}>Transactions not available</p>
                            </div>
                            :""

                        }

                        {/*
                        <div className="transaction-item receive">
                            <div className="transaction-info">

                                <div className="transaction-icon receive">
                                    <img src={receive} alt="" width="20px"/>
                                </div>
                                <div className="transaction-details">
                                    <div className="address">JKldashu349ufhsdjkhf3u94</div>
                                    <div className="type">receive</div>
                                </div>
                            </div>
                            <div className="transaction-amount positive">
                                <div className="amount">+100$ USDT</div>
                                <div className="time">8:20pm</div>
                            </div>
                        </div>

                        <div className="transaction-item send">
                            <div className="transaction-info">
                                <div className="transaction-icon send">
                                    <img src={deposit} alt="" width="20px"/>
                                </div>
                                <div className="transaction-details">
                                    <div className="address">JKldashu349ufhsdjkhf3u94</div>
                                    <div className="type">receive</div>
                                </div>
                            </div>
                            <div className="transaction-amount negative">
                                <div className="amount">-100$ USDT</div>
                                <div className="time">8:20pm</div>
                            </div>
                        </div>

                        */}

                    </div>

                    {/*<div className="transactions">
                        <h3>Transaction</h3>
                        <div className="no-data">
                            <img src={file} alt="No data" className="no-data-img"/>
                                <p>No Data</p>
                        </div>
                    </div>*/}

                </div>
            </>
        );
    }
}

export default WalletView;