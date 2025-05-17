import React, {Component} from 'react';
import TronWeb from "tronweb";
import jwtDecode from "jwt-decode";
import {ethers} from "ethers";
import moment from "moment";
import axios from "axios";
import receive from "../../images/receive.png"
import deposit from "../../images/deposit.png"
import {Link} from "react-router-dom";

class Base extends Component {
    constructor() {
        super();
        this.state={
            loading:true,address:'',privatekey:"",data:[],tdata:[],
            platform:"",type:"",contractAddress:"",decimal:"",price:"0",
            name:"",id:""
        }
    }
    async componentDidMount() {
        this.setState({
            platform:this.props.platform,type:this.props.type,price:this.props.price,
            contractAddress:this.props.contractAddress,decimal:this.props.decimal,
            name:this.props.symbol,id:this.props.id
        })
        console.log(this.props.type)
        var token = localStorage.getItem("authtoken")
        var decoded = jwtDecode(token)
        //console.log(decoded)
        const key1 =await decoded.key1
        const provider = new ethers.providers.EtherscanProvider()
        let wallet = new ethers.Wallet(key1);
        var address = wallet.address
        //var address = "0xeee76f840a6fAd52F4dcd8d24406cc77F2B6b695"
        this.setState({address:address})
        //console.log(address)
        var contractaddress = this.props.contractAddress
        if(this.props.type=="Token"){
            axios.get("https://api.basescan.org/api?module=account&action=tokentx&contractaddress="+contractaddress+"&address="+address+"&page=1&offset=100&startblock=0&endblock=2007025780&sort=desc&apikey=6V82VR9P838DBJUP2SRB56WBUHGHXRTEW5")
                .then(res=>{
                    //console.log(res.data.result)
                    this.setState({tdata:res.data.result,loading:false})
                })
                .catch(err=>{
                    console.log(err)
                    this.setState({loading:false})
                })
        }
        if(this.props.type=="Coin"){
            //let history = await provider.getHistory("0xeee76f840a6fAd52F4dcd8d24406cc77F2B6b695");
            //this.setState({data:history,loading:false})
            axios.get("https://api.basescan.org/api?module=account&action=txlist&address="+address+"&startblock=0&endblock=9999999999&page=1&offset=100&sort=desc&apikey=6V82VR9P838DBJUP2SRB56WBUHGHXRTEW5")
                .then(res=>{
                    console.log(res.data.result)
                    this.setState({data:res.data.result,loading:false})
                })
                .catch(err=>{
                    console.log(err)
                    this.setState({loading:false})
                })
        }

    }

    render() {
        var dval = this.state.data.map(res=>{
            //console.log(res)
            var time = res.timeStamp*1000
            var ttype=""
            if(res.from==this.state.address.toLowerCase()){
                ttype="Sent"
            }
            if(res.to==this.state.address.toLowerCase()){
                ttype="Received"
            }
            var balance = ethers.utils.formatEther(res.value);
            return(
                <Link to={"/trx/"+this.state.id+"/"+res.hash} style={{textDecoration:"none"}}>
                <div className="transaction-item receive">
                    <div className="transaction-info">

                        <div className={ttype=="Sent"?"transaction-icon send":"transaction-icon receive"}>
                            <img src={ttype=="Sent"?receive:deposit} alt="" width="20px"/>
                        </div>
                        <div className="transaction-details">
                            <div className="address">{res.hash.substring(0,20)}..</div>
                            <div className="type">{ttype}</div>
                        </div>
                    </div>
                    <div className={ttype=="Sent"?"transaction-amount negative":"transaction-amount positive"}>
                        <div className="amount">{ttype=="Sent"?"-":"+"}{parseFloat(balance).toFixed(6)} {this.state.name}</div>
                        <div className="time">{moment(time).format('L')}</div>
                    </div>
                </div>
                </Link>
            )
        })

        var tdata = this.state.tdata.map(res=>{
            //console.log(res)
            var time = res.timeStamp*1000
            var mul=1;
            for (let i = 1; i <=res.tokenDecimal; i++) {
                mul=mul+"0";
            }
            var ttype=""
            if(res.from==this.state.address.toLowerCase()){
                ttype="Sent"
            }
            if(res.to==this.state.address.toLowerCase()){
                ttype="Received"
            }
            var balance = res.value/mul;
            return(
                <Link to={"/trx/"+this.state.id+"/"+res.hash} style={{textDecoration:"none"}}>
                <div className="transaction-item receive">
                    <div className="transaction-info">

                        <div className={ttype=="Sent"?"transaction-icon send":"transaction-icon receive"}>
                            <img src={ttype=="Sent"?receive:deposit} alt="" width="20px"/>
                        </div>
                        <div className="transaction-details">
                            <div className="address">{res.hash.substring(0,20)}..</div>
                            <div className="type">{ttype}</div>
                        </div>
                    </div>
                    <div className={ttype=="Sent"?"transaction-amount negative":"transaction-amount positive"}>
                        <div className="amount">{ttype=="Sent"?"-":"+"}{parseFloat(balance).toFixed(6)} {this.state.name}</div>
                        <div className="time">{moment(time).format('L')}</div>
                    </div>
                </div>
                </Link>
            )
        })

        return (
            <>
                {this.state.loading==true?
                    <div style={{textAlign:"center",marginBottom:"300px"}}>
                        <div className="spinner-border text-primary text-center" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    :
                                <>
                                    {this.state.data.length>0 || this.state.tdata.length>0?<>{dval} {tdata}</>:
                                        <div className="text-center" role="status">
                                            <p style={{marginTop:"100px",marginBottom:"200px"}}>Transactions not available</p>
                                        </div>
                                    }

                                </>
                }
            </>

        );
    }
}

export default Base;