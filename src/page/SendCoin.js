import React, {Component} from 'react';
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png";
import sentTocrypto from "../components/sentTocrypto";
import {toast} from "react-toastify";
import cryptoBalanceCheck from "../components/cryptoBalanceCheck";
import closebtn from "../images/close-button.png"
import ApiUrl from "../AppUrl/ApiUrl";
import jwtDecode from "jwt-decode";
import {ethers} from "ethers";
import TronWeb from "tronweb";
import RouteCheck from "../components/routeCheck";


class SendCoin extends Component {
    constructor({match}) {
        super();
        this.state={
            id:match.params.id,token:"",amount:"",rpc:"",chain:"",
            address:"",coin_symbol:"",logo:"",coin_name:"",decimal:"",
            price:"",day_change:"",platform:"",bal:"",type:"",contract:"",type1:"",
            sendtrx:false,coin_type:"",gasfee:"0",confirm:false,fromaddress:"",
            password:"",verify:false,form:false,feecoin:"",price1:"0",day_change1:"0"
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        var password = localStorage.getItem("password")
        if(password){
            this.setState({password:password,verify:true})
        }
        var dwallet = JSON.parse(localStorage.getItem("dwallet"))
        if(dwallet){
            dwallet.filter((res)=>{
                if(this.state.id==res.id){
                    this.setState({coin_symbol:res.coin_symbol,logo:res.logo,
                        price:res.price,day_change:res.day_change,coin_type:res.coin_type,
                        platform:res.platform,bal:res.bal,type:res.coin_type,type1:res.coin_type,
                        contract:res.contract,coin_name:res.coin_name,rpc:res.rpc,chain:res.chain,
                    })
                    dwallet.filter((res1)=>{
                        if(res.platform==res1.platform && res1.coin_type=="Coin"){
                            this.setState({feecoin:res1.coin_symbol,price1:res1.price,day_change1:res1.day_change})
                        }
                    })
                }
            })
            setTimeout(()=>{
                var val =this.state
                cryptoBalanceCheck(val.coin_symbol,val.platform, val.coin_type,val.contract,val.coin_decimal,val.rpc,val.chain)
                    .then(rs=>{
                        console.log(rs)
                        dwallet.forEach(item=>{
                            if(this.state.id==item.id){
                                item.bal=rs.balance;
                                console.log(item.coin_name)
                                this.setState({gasfee:rs.fee})
                                this.setState({bal:rs.balance})
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
            var decoded = jwtDecode(token)
            var key = decoded.key1
            if(this.state.platform!=="Tron"){
                const provider = new ethers.providers.InfuraProvider("homestead")
                let wallet = new ethers.Wallet(key);
                var address = wallet.address
                this.setState({fromaddress:address})
            }else{
                const tronWeb = new TronWeb({
                    fullHost: 'https://api.trongrid.io',
                    eventServer: 'https://api.someotherevent.io', privateKey: key}
                )
                this.setState({fromaddress:tronWeb.defaultAddress["base58"]})
            }
        }else {
            this.props.history.push("/home")
        }
    }
    paste=async ()=>{
        const text =await navigator.clipboard.readText()
            .then(

            ).catch(
                //
            )
        this.setState({address:text})

    }

    max= ()=>{
        //console.log(this.state.coin_type)
        if(this.state.type=="Coin"){
            var val = (parseFloat(this.state.bal)-parseFloat(this.state.gasfee)).toFixed(8)
            this.setState({amount:val})
        }else{
            var val1 = (parseFloat(this.state.bal)).toFixed(8)
            this.setState({amount:val1})
        }
    }
    address=(e)=>{
        this.setState({address:e.target.value})
    }
    amount=(e)=>{
        this.setState({amount:e.target.value})
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

    submitD=()=>{
        var val =this.state
        cryptoBalanceCheck(val.coin_symbol,val.platform, val.coin_type,val.contract,val.coin_decimal,val.rpc,val.chain)
            .then(rs=>{
                console.log(rs)
                this.setState({bal:rs.balance})
                this.setState({gasfee:rs.fee})
            })
            .catch(err=>{
                console.log(err)
            })
        if(this.state.address==""){
            this.err("Reciever address is required")
        }
        if(this.state.amount==""){
            this.err("Send amount  is required")
        }
        if(this.state.address!=="" && this.state.amount!==""){
            this.setState({confirm:true})
        }
    }
    sentCoin=()=>{
        var val =this.state
        this.setState({sendtrx:true})
        sentTocrypto(val.coin_symbol,val.platform, val.coin_type,val.contract,val.coin_decimal,val.address,val.amount,val.rpc,val.chain)
            .then(res=>{
                this.setState({sendtrx:false})
                cryptoBalanceCheck(val.coin_symbol,val.platform, val.coin_type,val.contract,val.coin_decimal,val.rpc,val.chain)
                    .then(rs=>{
                        console.log(rs)
                        this.setState({bal:rs.balance})
                        this.setState({gasfee:rs.fee})
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            })
            .catch(err=>{
                //console.log(err)
                this.setState({sendtrx:false})
            })

    }

    cancel=()=>{
        this.setState({confirm:false})
    }
    passworddd=(e)=>{
        this.setState({passworddd:e.target.value})
    }

    render() {
        var val = this.state
        console.log(val.coin_type)
        var bb = parseFloat(this.state.amount)*parseFloat(this.state.price)
        return (
            <>
                <title>Send {this.state.coin_symbol}</title>
                <RouteCheck/>
                    {this.state.confirm==false?<>
                    <div className="container-fluid sendcoin" style={{height:"auto",minHeight:"900px"}}>
                        <div className="header">
                            <br/><br/>
                            <Link onClick={()=>this.props.history.go(-1)} to="#" className="back-button">
                                <img src={backbtn} alt="Back" className="back-icon"/>
                            </Link>
                            <h1>Send {this.state.coin_symbol}</h1>
                            <h1></h1>
                        </div>

                        <div className="balance-card mx-3 my-4 p-3 text-center text-white">
                            <p className="mb-2">Total Balance :</p>
                            <div className="d-flex align-items-center justify-content-center">
                                <h2 className="mb-0">{parseFloat(this.state.bal).toFixed(8)}</h2>
                                <button className="refresh-btn ms-2">
                                    <img src="https://cdn-icons-png.flaticon.com/512/126/126502.png" alt="Refresh"
                                         className="refresh-icon d-none"/>
                                </button>
                            </div>
                        </div>

                        <div className="form-container px-3">
                            <div className="mb-4">
                                <label className="form-label">Enter Your Address Here</label>
                                <div className="input-group">
                                    <input style={{borderRight:"none"}} onChange={this.address} type="text" value={this.state.address}
                                           className="form-control custom-input shadow-none" placeholder={this.state.coin_symbol+" address"}/>
                                    <button style={{borderLeft:"none"}} onClick={this.paste} className="btn btn-outline-secondary paste-btn shadow-none" type="button">Paste</button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Enter Your Amount Here</label>
                                <div className="input-group">
                                    <input style={{borderRight:"none"}} onChange={this.amount} type="number" value={this.state.amount}
                                           className="form-control custom-input shadow-none" placeholder={this.state.coin_symbol+" Amount"}/>
                                    <button style={{borderLeft:"none"}} onClick={this.max} className="btn btn-outline-secondary max-btn shadow-none" type="button">Max</button>
                                </div>
                            </div>
                        </div>
                        <div style={{paddingLeft:"30px"}}>
                            <p style={{marginBottom:"5px"}}>
                                {this.state.amount!==""?
                                    (parseFloat(this.state.amount)*parseFloat(this.state.price)).toFixed(bb>1?2:bb>0.00001?5:bb==0?2:8)+"$":""
                                }
                            </p>
                        </div>

                        <div style={{padding:"20px",marginTop:"50px"}}>
                            <p style={{marginBottom:"5px"}}>Gas Fee</p>
                            <p style={{background:"#EFF8FF",borderRadius:"10px",padding:"15px"}}>
                                {this.state.gasfee} {this.state.feecoin}<br/>
                                <span style={{fontSize:"13px"}}>{(parseFloat(this.state.gasfee)*parseFloat(this.state.price1)).toFixed(5)}$</span>
                            </p>
                        </div>

                        <div className="continue-btn-container px-3 " style={{marginTop:"10px"}}>
                            <button onClick={this.submitD}
                                    className="btn continue-btn w-100 shadow-none">Continue</button>
                        </div>
                    </div>
                    </>:

                        <div className="send-container" style={{minHeight:"800px",height:"auto"}}>
                            <div className="send-header">
                                <button onClick={this.cancel} className="close-btn">
                                    <img src={closebtn} alt="" width="20px"/>
                                </button>
                                <h2 className="text-center mb-4">You Will Send</h2>
                            </div>

                            <div className="crypto-amount text-center">
                                {this.state.logo?<img src={ApiUrl.baseurl+"static/images/"+this.state.logo} alt="Ethereum"
                                                      className="eth-logo"/>:""}
                                <div className="amount">-{this.state.amount} {this.state.coin_symbol}</div>
                                <div className="fiat-amount">≈${(parseFloat(this.state.amount)*parseFloat(this.state.price)).toFixed(4)}</div>
                            </div>

                            <div className="transaction-details mt-5">
                                <h3>Transaction Details</h3>

                                <div className="detail-row">
                                    <span className="label">From</span>
                                    <div className="value d-flex align-items-center" style={{fontSize:"10px"}}>
                                        {this.state.fromaddress}
                                    </div>
                                </div>

                                <div className="detail-row">
                                    <span className="label">To</span>
                                    <div className="value d-flex align-items-center" style={{fontSize:"10px"}}>
                                        {this.state.address}
                                    </div>
                                </div>

                                <div className="detail-row">
                                    <span className="label">Chain</span>
                                    <span className="value">{this.state.platform=="Binance"?"BSC Smart":this.state.platform} Chain</span>
                                </div>

                                <div className="detail-row">
                                    <span className="label">Gas Fee</span>
                                    <span className="value">{parseFloat(this.state.gasfee).toFixed(8)} {this.state.feecoin} ≈ ${(parseFloat(this.state.gasfee)*parseFloat(this.state.price1)).toFixed(4)}</span>
                                </div>
                            </div>

                            <div className="send-footer">
                                <button onClick={this.cancel} className="send-btn send-btn-secondary">Cancel</button>

                                <button onClick={this.sentCoin} disabled={this.state.sendtrx}
                                        className="send-btn send-btn-primary">{this.state.sendtrx==true?"Sending...":"Confirm"}</button>
                            </div>

                        </div>


                    }

            </>
        );
    }
};

export default SendCoin;