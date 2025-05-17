import React, {Component} from 'react';
import {toast, ToastContainer} from "react-toastify";
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png";
import QRCode from "react-qr-code";
import copy from "../images/copy-solid.svg";
import share from "../images/share-nodes-solid.svg";
import ApiUrl from "../AppUrl/ApiUrl";
import RouteCheck from "../components/routeCheck";

class Deposit extends Component {
    constructor({match}) {
        super();
        this.state={
            id:match.params.id,token:"",
            address:"",copyad:false,coin_symbol:"",wallet:[],name:"",
            coin_name:"",balance:"0",logo_img:"",fee:"0",coin_id:"",platform:"",
            fee_coin:"",deposit:"",withdrew:"",fee_symbol:""
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
        console.log(this.state.wallet)
        var coin = this.state.wallet.filter((val)=>{
            if(val.coin_symbol.toLowerCase()==this.state.id.toLowerCase()){
                return val;
            }
        })
        console.log(coin)
        if(coin.length>0){
            var coins = coin[0]
            var feecoin=coins["fee_coin"]
            this.setState({
                coin_symbol:coins["coin_symbol"],coin_name:coins["coin_name"],logo_img:coins["logo"],fee:coins["fee"],fee_coin:coins["fee_coin"],
                deposit:coins["deposit"],withdrew:coins["withdrew"],address:coins["address"],balance:coins["balance"],coin_id:coins["coin_id"],
                platform:coins["platform"]
            })
            if(coins["deposit"]=="0"){
                this.errorMsg(coins["coin_symbol"]+" Deposit not available")
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
                <title>Deposit {this.state.id}</title>
                <RouteCheck/>
                <div className="container-fluid wallet-container receivepage">
                    <br/>
                    <div className="header">
                        <Link onClick={()=>this.props.history.go(-1)} to="#" className="back-button">
                            <img src={backbtn} alt="Back" className="back-icon"/>
                        </Link>
                        <h1>Deposit {this.state.id}</h1>
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
                        Send Only {this.state.id} Tokens In {this.state.platform} Network To This Address,<br/>
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
                        <img src={this.state.logo_img} alt="Bitcoin"
                             className="crypto-icon"/>
                        <span className="crypto-name">{this.state.coin_name} ({this.state.id})</span>
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
                </div>
            </>
        );
    }
}

export default Deposit;