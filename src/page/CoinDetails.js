import React, {Component} from 'react';
import backbtn from "../images/back-button.png"
import {Link} from "react-router-dom";
import arrow from "../images/arrows-rotate-solid-(1).png"
import sendicon from "../images/send-icon.png"
import receiveicon from "../images/receive-icon.png"
import earnwhite from "../images/earnwhite.png"
import historyicon from "../images/historyicon.png"
import file from "../images/file.svg"
import receive from "../images/receive.png"
import deposit from "../images/deposit.png"
import ApiUrl from "../AppUrl/ApiUrl";
import cryptoBalanceCheck from "../components/cryptoBalanceCheck";
import Base from "../components/transactions/Base";
import Eth from "../components/transactions/Eth";
import Bnb from "../components/transactions/Bnb";
import Avax from "../components/transactions/Avax";
import Matic from "../components/transactions/Matic";
import Fantom from "../components/transactions/Fantom";
import Tron from "../components/transactions/Tron";
import RouteCheck from "../components/routeCheck";

class CoinDetails extends Component {
    constructor({match}) {
        super();
        this.state={
            id:match.params.id,
            token:"",
            amount:"",
            rpc:"",
            chain:"",
            address:"",
            coin_symbol:"",
            logo:"",
            coin_name:"",
            decimal:"",
            price:"",
            day_change:"",
            platform:"",
            bal:"",
            type:"",
            contract:"",
            sendtrx:false,
            coin_type:"",
            data: [] // Add this line
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var dwallet = JSON.parse(localStorage.getItem("dwallet"))
        if(dwallet){
            dwallet.filter((res)=>{
                if(this.state.id==res.id){
                    this.setState({coin_symbol:res.coin_symbol,logo:res.logo,
                        price:res.price,day_change:res.day_change,coin_type:res.coin_type,
                        platform:res.platform,bal:res.bal,type:res.coin_type,
                        contract:res.contract,coin_name:res.coin_name,rpc:res.rpc,chain:res.chain,
                    })
                }
            })
            setTimeout(()=>{
                var val =this.state
                cryptoBalanceCheck(val.coin_symbol,val.platform, val.coin_type,val.contract,val.coin_decimal,val.rpc,val.chain)
                    .then(rs=>{
                        console.log(rs)
                        this.setState({bal:rs.balance})
                        dwallet.forEach(item=>{
                            if(this.state.id==item.id){
                                item.bal=rs.balance;
                                console.log(item.coin_name)
                            }
                        })
                        setTimeout(()=>{
                            this.setState({dwallet:dwallet})
                            localStorage.setItem("dwallet",JSON.stringify(dwallet))
                        },500)
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },100)
        }
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
        }else {
            this.props.history.push("/home")
        }
    }

    render() {
        var val = this.state
        var bb = parseFloat(val.bal)*parseFloat(val.price)
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
                                <img src={val.logo} alt="Bitcoin"
                                     className="coin-logo"/>:""
                            }
                                <div className="coin-details">
                                    <span className="coin-label">{val.type}</span>
                                    <span className="coin-name">{val.coin_name}</span>
                                    <span className="coin-label">{val.platform=="Binance"?"BSC Smart Chain":val.platform} Network</span>
                                </div>
                                <div className="refresh-btn d-none">
                                    <img src={arrow} alt="" width="20px"/>
                                </div>
                        </div>
                        <div className="balance">
                            <h2>{parseFloat(val.bal).toFixed(8)} {val.coin_symbol}</h2>
                            <p className="fiat-value">${(parseFloat(val.bal)*parseFloat(val.price)).toFixed(bb>1?2:bb>0.00001?5:bb==0?2:8)}</p>
                        </div>
                    </div>

                    <div className="action-grid" style={{padding:"0px 10px",paddingTop:"10px",
                        margin: "1rem 2rem 1rem 2rem"}}>
                        <div style={{textAlign:"center"}}>
                            <Link to={"/send/"+this.state.id} className="action-item" style={{padding:"18px 15px"}}>
                                <img src={sendicon} alt="" width="30px" height="30px"/>
                            </Link>
                            <div style={{color:"#07335B",marginTop:"10px"}}>Send</div>
                        </div>
                        <div style={{textAlign:"center"}}>
                            <Link to={"/receive/"+this.state.id} className="action-item" style={{padding:"18px 15px"}}>
                                <img src={receiveicon} alt="" width="30px" height="30px"/>
                            </Link>
                            <div style={{color:"#07335B",marginTop:"10px"}}>Receive</div>
                        </div>
                        <div style={{textAlign:"center"}}>
                            <Link to="/earn" className="action-item" style={{padding:"18px 15px"}}>
                                <img src={earnwhite} alt="" width="30px" height="30px"/>
                            </Link>
                            <div style={{color:"#07335B",marginTop:"10px"}}>Earn</div>
                        </div>
                        <div style={{textAlign:"center"}}>
                            <Link to="/allhistory" className="action-item" style={{padding:"18px 15px"}}>
                                <img src={historyicon} alt="" width="30px" height="30px"/>
                            </Link>
                            <div style={{color:"#07335B",marginTop:"10px"}}>History</div>
                        </div>


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
                            this.state.platform=="Base"?
                                <Base id={this.state.id} symbol={this.state.coin_symbol} platform={this.state.platform} price={this.state.price}
                                      type={this.state.coin_type} contractAddress={this.state.contract}
                                      decimal={this.state.coin_decimal} address={this.state.address}/> :""
                        }
                        {
                            this.state.platform=="Ethereum"?
                                <Eth id={this.state.id} symbol={this.state.coin_symbol} platform={this.state.platform} price={this.state.price}
                                      type={this.state.coin_type} contractAddress={this.state.contract}
                                      decimal={this.state.coin_decimal} address={this.state.address}/> :""
                        }
                        {
                            this.state.platform=="Binance"?
                                <Bnb id={this.state.id} symbol={this.state.coin_symbol} platform={this.state.platform} price={this.state.price}
                                     type={this.state.coin_type} contractAddress={this.state.contract}
                                     decimal={this.state.coin_decimal} address={this.state.address}/> :""
                        }
                        {
                            this.state.platform=="Avalanche"?
                                <Avax id={this.state.id} symbol={this.state.coin_symbol} platform={this.state.platform} price={this.state.price}
                                     type={this.state.coin_type} contractAddress={this.state.contract}
                                     decimal={this.state.coin_decimal} address={this.state.address}/> :""
                        }
                        {
                            this.state.platform=="Polygon"?
                                <Matic id={this.state.id} symbol={this.state.coin_symbol} platform={this.state.platform} price={this.state.price}
                                      type={this.state.coin_type} contractAddress={this.state.contract}
                                      decimal={this.state.coin_decimal} address={this.state.address}/> :""
                        }
                        {
                            this.state.platform=="Fantom"?
                                <Fantom id={this.state.id} symbol={this.state.coin_symbol} platform={this.state.platform} price={this.state.price}
                                       type={this.state.coin_type} contractAddress={this.state.contract}
                                       decimal={this.state.coin_decimal} address={this.state.address}/> :""
                        }
                        {
                            this.state.platform=="Tron"?
                                <Tron id={this.state.id} symbol={this.state.coin_symbol} platform={this.state.platform} price={this.state.price}
                                        type={this.state.coin_type} contractAddress={this.state.contract}
                                        decimal={this.state.coin_decimal} address={this.state.address}/> :""
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

export default CoinDetails;