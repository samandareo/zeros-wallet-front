import React, {Component} from 'react';
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png";
import cryptoBalanceCheck from "../components/cryptoBalanceCheck";
import {toast} from "react-toastify";
import ApiUrl from "../AppUrl/ApiUrl";
import closebtn from "../images/close-button.png"
import RouteCheck from "../components/routeCheck";

class AddToken extends Component {
    constructor() {
        super();
        this.state={
            tab:"token",platform:"Ethereum",contract:"",coin_name:"",coin_symbol:"",bal:"0",
            rpc:"",chain:"",decimal:"",explorer:"",id:Math.floor(Math.random() * (100000 - 10000 + 1) + 10000),
            dwallet:[],coin_name2:"",coin_symbol2:"",coin:[],select:false,name2:""
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        var coin = JSON.parse(localStorage.getItem("coin"))
        if(coin){
            this.setState({coin:coin})
        }
        console.log(this.state.id)
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            var dwallet = JSON.parse(localStorage.getItem("dwallet"))
            if(dwallet){
                this.setState({dwallet:dwallet})
            }
        }else {
            this.props.history.push("/home")
        }
    }
    tab=(val)=>{
        this.setState({tab:val})
    }
    explorer=(e)=>{
        this.setState({explorer:e.target.value})
    }
    chain=(e)=>{
        this.setState({chain:e.target.value})
    }
    rpc=(e)=>{
        this.setState({rpc:e.target.value})
    }
    coin_symbol=(e)=>{
        this.setState({coin_symbol2:e.target.value})
    }
    coin_name=(e)=>{
        this.setState({coin_name2:e.target.value})
    }
    contract=async (e)=>{
        var res =this.state
        this.setState({contract:e.target.value})
        var contract = e.target.value
        if(contract.length>40 && this.state.platform!==""){
           await cryptoBalanceCheck(res.coin_symbol,res.platform, "Token",contract,"","","")
                .then(rs=>{
                    console.log(rs)
                    this.setState({bal:rs.balance,decimal:rs.decimals,coin_name:rs.name,coin_symbol:rs.symbol})
                })
                .catch(err=>{
                    console.log(err)
                })
        }else{
            this.setState({bal:"0",decimal:"",coin_name:"",coin_symbol:""})
        }
    }
    platform=(e)=>{
        this.setState({platform:e.target.value})
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


    addToken=()=>{
        var val=this.state
        var {dwallet}=this.state
        if(val.contract!=="" && val.coin_name!==""){
            const data= [{
                coin_name:val.coin_name,coin_symbol:val.coin_symbol,coin_decimal:val.decimal,
                coin_type:"Token",contract:val.contract,explorer:"",logo:"",
                platform:val.platform,id:val.id,price:"0",day_change:"0",
                status:"1",bal:val.bal
            }]
            this.setState({dwallet:[...dwallet,...data]})
            this.successMsg("Token added successfully")
            setTimeout(()=>{
                this.saveWallet()
            },100)
            setTimeout(()=>{
                this.props.history.push("/")
            },800)
        }else{
            this.errorMsg("Contract address required")
        }
    }

    saveWallet=()=>{
        localStorage.setItem("dwallet",JSON.stringify(this.state.dwallet))
        console.log("New Token Wallet Saved Localstorage ")
    }

    addCoin=()=>{
        var val=this.state
        var {dwallet}=this.state
        if(val.rpc!=="" && val.coin_name2!=="" && val.coin_symbol2!=="" && val.chain!==""){
            const data= [{
                coin_name:val.coin_name2,coin_symbol:val.coin_symbol2,coin_decimal:"",
                coin_type:"Coin",contract:"",explorer:val.explorer,logo:"",
                platform:"Custom",id:val.id,price:"0",day_change:"0",
                status:"1",bal:"0",chain: val.chain,rpc:val.rpc
            }]
            this.setState({dwallet:[...dwallet,...data]})
            this.successMsg("Coin added successfully")
            setTimeout(()=>{
                this.saveWallet()
            },100)
            setTimeout(()=>{
                this.props.history.push("/")
            },800)
        }else{
            this.errorMsg("All input is required")
        }
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
        var val=this.state
        console.log(val.coin_name)
        return (
            <>
                <title>Add Token</title>
                <RouteCheck/>
            <div class="container-fluid addtoken" style={{minHeight:"900px",height:"auto"}}>
                <div className="wallet-header2" style={{background:"#D0E2F1"}}>
                    <button className="back-btn" style={{background:"transparent",border:"none"}}>
                        <Link onClick={()=>this.props.history.go(-1)} to="#">
                            <img src={backbtn} style={{marginLeft:"0px"}} alt="Back" width="30px"/>
                        </Link>
                    </button>
                    <h3 className="text-center mb-0 " style={{color:"#000000"}}>Token</h3>
                    <button className="notification-btn">
                    </button>
                </div>

                <br/><br/>

                <div className="nav-tabs-custom mb-4">
                    <div className="btn-group w-100">
                        <button onClick={this.tab.bind(this,"token")} className={val.tab=="token"?"btn shadow-none active":"btn shadow-none"}>Token</button>
                        <button onClick={this.tab.bind(this,"network")} className={val.tab=="network"?"btn shadow-none active":"btn shadow-none"}>Network</button>
                    </div>
                </div>


                {val.tab=="token"?

                        this.state.select==false?
                    <div className="form-content">
                        <div className="mb-3">
                            <label className="form-label">Network</label>
                            <div className="network-wrapper">
                                <button onClick={this.hideShow} style={{background:"white",width:"100%",borderRadius:"5px"}}
                                        className="btn dropdown-toggle shadow-none" type="button" data-bs-toggle="dropdown">
                                    {this.state.platform==""?"All Networks":this.state.platform=="Binance"?"BNB Smart Chain":this.state.platform}
                                </button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contract Address</label>
                            <input onChange={this.contract} value={val.contract} type="text" className="form-control shadow-none"/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input value={val.coin_name} disabled={true} type="text" className="form-control shadow-none"/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Symbol</label>
                            <input value={val.coin_symbol} type="text" disabled={true} className="form-control shadow-none"/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Decimals</label>
                            <input value={val.decimal} disabled={true} type="number" className="form-control shadow-none"/>
                        </div>

                        <button disabled={val.coin_name==""} onClick={this.addToken}
                                className="btn btn-primary w-100 import-btn shadow-none">Import</button>
                    </div>:
                            <div className="select-mainnet-container" style={{boxShadow:"none",height:"auto"}}>
                                <div className="select-mainnet-header">
                                    <button onClick={this.hideShow} className="select-mainnet-back-btn">
                                        <img src={closebtn} alt="" width="20px"/>
                                    </button>
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
                                        <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24"
                                             fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="#0066FF" stroke-width="2"
                                                  stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>

                                    {this.state.coin.filter((v)=>{
                                        if(v.platform!=="Tron"){
                                            if(this.state.name2==""){
                                                return v
                                            }else if(v.coin_symbol.toLowerCase().includes(this.state.name2.toLowerCase())){
                                                return v
                                            }
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


                    :""}

                {val.tab=="network"?
                    <div className="form-content">

                        <div className="mb-3">
                            <label className="form-label">Network</label>
                            <input type="text" value={"Ethereum Base Coin"} disabled={true} className="form-control shadow-none"/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input value={val.coin_name2} onChange={this.coin_name} type="text" className="form-control shadow-none"/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Symbol</label>
                            <input onChange={this.coin_symbol} value={val.coin_symbol2} type="text" className="form-control shadow-none"/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Node URL</label>
                            <input onChange={this.rpc} value={val.rpc} type="text" className="form-control shadow-none"/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Explorer URL (Optional)</label>
                            <input type="text" value={val.explorer} onChange={this.explorer} className="form-control shadow-none"/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Chain ID</label>
                            <input type="text" value={val.chain} onChange={this.chain} className="form-control shadow-none"/>
                        </div>
                        <button disabled={val.rpc==""&&val.coin_symbol2==""&&val.coin_name2==""}
                            onClick={this.addCoin} className="btn btn-primary w-100 import-btn shadow-none">Import</button>
                    </div>:""}


            </div>

            </>
        );
    }
};

export default AddToken;