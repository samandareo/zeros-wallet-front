import React, {Component} from 'react';
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png";
import ApiUrl from "../AppUrl/ApiUrl";
import RouteCheck from "../components/routeCheck";

class DepositList extends Component {
    constructor() {
        super();
        this.state={
            token:"",wallet:[],name:""
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
        }else {
            this.props.history.push("/home")
        }
    }
    name=(e)=>{
        this.setState({name:e.target.value})
    }

    render() {
        var data1=this.state.wallet.filter((val)=>{
            if(val.deposit=="1"){
                return val
            }
        })
        var data = data1.filter((val)=>{
            if(this.state.name==""){
                return val;
            }else if(val.coin_name.toLowerCase().includes(this.state.name.toLowerCase()) || val.coin_symbol.toLowerCase().includes(this.state.name.toLowerCase())){
                return val;
            }
        }).map(res=>{
            var bal=parseFloat(res.balance)
            var ch = parseFloat(res.day_change)
            return(
                <>
                    <Link to={"/wallet/deposit/"+res.coin_symbol} style={{textDecoration:"none"}}>
                        <div className="crypto-item d-flex align-items-center justify-content-between"
                             style={{padding:"5px 20px"}}>
                            <div className="d-flex align-items-center">
                                <div className="crypto-icon ">
                                    <img src={res.logo} alt="" width="40px"/>
                                </div>
                                <div className="ms-3">
                                    <div className="crypto-name text-black fw-bold">{res.coin_symbol}
                                        <span className={ch>0?"text-success fw-normal":ch=="0"?"text-black fw-normal":"text-danger fw-normal"}
                                              style={{fontSize:"14px"}}> {parseFloat(res.day_change)>0?"+"+res.day_change:res.day_change}
                                        </span>
                                    </div>
                                    <div className="crypto-balance">{parseFloat(res.price).toFixed(2)}$</div>
                                </div>
                            </div>
                            <div className="text-end">
                                <div className="crypto-price text-black fw-bold">{parseFloat(res.balance).toFixed(bal>0?bal<1?8:2:0)}</div>
                                <div className="crypto-price-secondary text-black">{(parseFloat(res.price)*parseFloat(res.balance)).toFixed(2)}$</div>
                            </div>
                        </div>
                    </Link>

                </>
            )
        })

        return (
            <>
                <title>Deposit Coin</title>
                <RouteCheck/>
                <div className="row m-0 "style={{background:"#D0E1F1"}}>
                    <div className="col-md-4"></div>
                    <div className="col-md-4 col-12 sendlist ">
                        <div className="wallet-header2" style={{background:"#D0E2F1"}}>
                            <button className="back-btn" style={{background:"transparent",border:"none"}}>
                                <Link onClick={()=>this.props.history.go(-1)} to="#">
                                    <img src={backbtn} style={{marginLeft:"-10px"}} alt="Back" width="30px"/>
                                </Link>
                            </button>
                            <h3 className="text-center mb-0 " style={{color:"#000000"}}>Deposit</h3>
                            <button className="notification-btn">
                            </button>
                        </div>

                        <div className="row" style={{marginTop:"40px",marginBottom:"10px"}}>
                            <div className="col-12">
                                <input onChange={this.name} placeholder="search"/>
                            </div>
                         <br/><br/>
                        </div>
                        {data}

                    </div>
                </div>
            </>
        );
    }
}

export default DepositList;