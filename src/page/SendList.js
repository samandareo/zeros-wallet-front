import React, {Component} from 'react';
import {Link} from "react-router-dom";
import ApiUrl from "../AppUrl/ApiUrl";
import backbtn from "../images/back-button.png"
import RouteCheck from "../components/routeCheck";

class SendList extends Component {
    constructor() {
        super();
        this.state={
            token:"",dwallet:[],name:"",platform:"",coin:[],select:false,name2:""
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        var coin = JSON.parse(localStorage.getItem("coin"))
        if(coin){
            this.setState({coin:coin})
        }
        var dwallet = JSON.parse(localStorage.getItem("dwallet"))
        if(dwallet){
            this.setState({dwallet:dwallet})
        }
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
        }else {
            this.props.history.push("/home")
        }
    }
    name=(e)=>{
        this.setState({name:e.target.value})
    }
    name2=(e)=>{
        this.setState({name2:e.target.value})
    }
    platform=(val)=>{
        this.setState({platform:val,select:false})
    }

    hideShow=()=>{
        if(this.state.select==false){
            this.setState({select:true})
        }else{
            this.setState({select:false})
        }
    }

    render() {
        var dwall = this.state.dwallet.sort(function(a, b){return b.bal-a.bal});
        var dd = dwall.filter((v)=>{
            if(v.status=="1"){
                if(this.state.platform==""){
                    return v
                }else if(v.platform.toLowerCase().includes(this.state.platform.toLowerCase())){
                    return v
                }
            }
        })
        var wallet=dd.filter((v)=>{
            if(this.state.name==""){
                return v
            }else if(v.coin_symbol.toLowerCase().includes(this.state.name.toLowerCase())){
                return v
            }
        }).map(res=>{
            var bal=parseFloat(res.bal)
            var ch = parseFloat(res.day_change)
            var price =parseFloat(res.price)
            var bbb = parseFloat(res.bal)*parseFloat(res.price)
            return(
                <Link to={"/send/"+res.id} style={{textDecoration:"none"}}>
                    <div className="crypto-item d-flex align-items-center justify-content-between"
                         style={{padding:"5px 20px"}}>
                        <div className="d-flex align-items-center">
                            <div className="crypto-icon bg-white">
                                {res.logo?
                                    <img src={res.logo} alt="" width="100px"
                                         height="30px"/>:
                                    ""}
                            </div>
                            <div className="ms-3">
                                <div className="crypto-name text-black fw-bold">{res.coin_symbol} <span
                                        style={{fontSize:"10px",background:"#ffffff",padding:"2px 5px",borderRadius:"10px"}}>{res.platform=="Binance"?"BSC Smart ":res.platform} Chain</span>
                                </div>
                                <div className="crypto-balance">{price.toFixed(price>1?2:price>0.00001?5:price==0?0:8)}$
                                    <span className={ch>0?"text-success fw-normal":ch=="0"?" fw-normal text-black":"text-danger fw-normal negative"}
                                                                                                          style={{fontSize:"14px"}}> { parseFloat(res.day_change)>0?"+"+res.day_change:res.day_change} %</span></div>
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="crypto-price text-black fw-bold">{bal.toFixed(bal>0?bal<1?8:4:0)}</div>
                            <div className="crypto-price-secondary text-black">{(parseFloat(res.bal)*parseFloat(res.price)).toFixed(bbb>1?2:bbb>0.00001?5:bbb==0?2:8)}$</div>
                        </div>
                    </div>
                </Link>
            )
        })

        return (
            <>
                <title>Send Coin</title>
                <RouteCheck/>
                {
                    this.state.select==false?
                        <div className="row m-0 "style={{background:"#D0E1F1"}}>
                            <div className="col-md-4"></div>
                            <div className="col-md-4 col-12 sendlist "style={{paddingTop:"0px"}}>
                                <div className="wallet-header2" style={{background:"#D0E2F1"}}>
                                    <button className="back-btn" style={{background:"transparent",border:"none"}}>
                                        <Link onClick={()=>this.props.history.go(-1)} to="#">
                                            <img src={backbtn} style={{marginLeft:"-10px"}} alt="Back" width="30px"/>
                                        </Link>
                                    </button>
                                    <h3 className="text-center mb-0 " style={{color:"#000000"}}>Send</h3>
                                    <button className="notification-btn">

                                    </button>
                                </div>

                                <div className="row" style={{marginTop:"40px",marginBottom:"10px"}}>
                                    <div className="col-6">
                                        <input onChange={this.name} value={this.state.name} placeholder="Search"/>
                                    </div>
                                    <div className="col-6">
                                        <div className="network-wrapper">
                                            <button onClick={this.hideShow} style={{background:"white",width:"100%",borderRadius:"25px"}}
                                                    className="btn dropdown-toggle shadow-none" type="button" data-bs-toggle="dropdown">
                                                {this.state.platform==""?"All Networks":this.state.platform=="Binance"?"BNB Smart Chain":this.state.platform}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {wallet}


                            </div>
                        </div>:
                        <div className="select-mainnet-container">
                            <div className="select-mainnet-header">
                                <button onClick={this.hideShow} className="select-mainnet-back-btn">
                                    <img src={backbtn} alt="" width="30px"/>
                                </button>
                                <h1>Select Network</h1>
                            </div>

                            <div className="select-mainnet-search">
                                <div className="input-group">
                <span className="input-group-text bg-white border-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                            stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                                    <input onChange={this.name2} type="text" className="form-control border-0" placeholder="search mainnet"/>
                                </div>
                            </div>

                            <div className="select-mainnet-list">

                                <div onClick={this.platform.bind(this,"")} className={"select-mainnet-item"}>
                                    <span>All Network </span>
                                    <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 6L9 17L4 12" stroke="#0066FF" stroke-width="2"
                                              stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>

                                {this.state.coin.filter((v)=>{
                                    if(this.state.name2==""){
                                        return v
                                    }else if(v.coin_symbol.toLowerCase().includes(this.state.name2.toLowerCase())){
                                        return v
                                    }
                                }).map(res=>{
                                    return(
                                            res.coin_type=="Coin"?
                                                <div onClick={this.platform.bind(this,res.platform)} className={res.platform==this.state.platform?"select-mainnet-item active":"select-mainnet-item"}>
                                                    <img src={res.logo} alt=""/>
                                                    <span>{res.platform=="Binance"?"BSC Smart":res.platform} Chain</span>
                                                    <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24"
                                                         fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M20 6L9 17L4 12" stroke="#0066FF" stroke-width="2"
                                                              stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                </div>:""
                                    )
                                })}

                            </div>

                        </div>
                }
            </>
        );
    }
}

export default SendList;