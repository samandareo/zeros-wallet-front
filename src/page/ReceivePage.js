import React, {Component} from 'react';
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png"
import copy from "../images/copy-solid.svg"
import share from "../images/share-nodes-solid.svg"
import QRCode from "react-qr-code";
import { ToastContainer, toast } from 'react-toastify';
import ApiUrl from "../AppUrl/ApiUrl";
import {ethers} from "ethers";
import TronWeb from "tronweb"
import jwtDecode from "jwt-decode";
import RouteCheck from "../components/routeCheck";

class ReceivePage extends Component {
    constructor({match}) {
        super();
        this.state={
            id:match.params.id,token:"",
            address:"",coin_symbol:"",logo:"",coin_name:"",
            price:"",day_change:"",platform:"",bal:"",type:"",contract:""
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            var decoded = jwtDecode(token)
            var key = decoded.key1
            //console.log(key)
            var dwallet = JSON.parse(localStorage.getItem("dwallet"))
            if(dwallet){
                dwallet.filter((res)=>{
                    if(this.state.id==res.id){
                        this.setState({coin_symbol:res.coin_symbol,logo:res.logo,
                            price:res.price,day_change:res.day_change,
                            platform:res.platform,bal:res.bal,type:res.coin_type,
                            contract:res.contract,coin_name:res.coin_name
                        })
                        if(res.platform!=="Tron"){
                            const provider = new ethers.providers.InfuraProvider("homestead")
                            let wallet = new ethers.Wallet(key);
                            var address = wallet.address
                            this.setState({address:address})
                        }else{
                            const tronWeb = new TronWeb({
                                fullHost: 'https://api.trongrid.io',
                                eventServer: 'https://api.someotherevent.io', privateKey: key}
                            )
                            this.setState({address:tronWeb.defaultAddress["base58"]})
                        }
                    }
                })
            }
        }else {
            this.props.history.push("/home")
        }
    }

    onCopyClipboard=()=>{
        navigator.clipboard.writeText(this.state.address)
        toast.success(this.state.address, {
            theme: "colored",
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        });
    }

    render() {
        return (
            <>
                <title>Receive {this.state.coin_symbol}</title>
                <RouteCheck/>
                <div className="container-fluid wallet-container receivepage" style={{minHeight:"800x",height:"auto"}}>
                    <br/>
                    <div className="header">
                        <Link onClick={()=>this.props.history.go(-1)} to="#" className="back-button">
                            <img src={backbtn} alt="Back" className="back-icon"/>
                        </Link>
                        <h1>Receive {this.state.coin_symbol}</h1>
                    </div>
                    <ToastContainer
                        theme="colored"
                        position="top-right"
                        autoClose={1000}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    <br/><br/>
                    <div className="warning-text">
                        Send Only {this.state.coin_symbol} {this.state.type} In {this.state.platform=="Binance"?"BSC Smart Chain":this.state.platform} Network To This Address,<br/>
                        Or You Might Lose Your Funds.
                    </div>

                    <div className="qr-container">
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "200px", width: "150px",textAlign:'center' }}
                            value={this.state.address}
                            viewBox={`0 0 256 256`}
                        />
                    </div>

                    <div className="crypto-info">
                        {this.state.logo?<img src={this.state.logo} alt="Bitcoin"
                                              className="crypto-icon"/>:""}
                            <span className="crypto-name">{this.state.coin_name} ({this.state.coin_symbol})</span>
                    </div>

                    <div className="address" style={{fontSize:"13px"}}>{this.state.address}</div>

                    <div className="button-group">
                        <button onClick={this.onCopyClipboard} className="btn btn-outline-primary copy-btn shadow-none">
                            Copy
                            <img src={copy} alt="Copy" className="btn-icon"/>
                        </button>
                        <button onClick={this.onCopyClipboard} className="btn btn-outline-primary share-btn shadow-none">
                            Share
                            <img src={share} alt="Share" className="btn-icon"/>
                        </button>
                    </div>
                    <br/><br/><br/><br/><br/><br/>
                </div>
            </>
        );
    }
}

export default ReceivePage;