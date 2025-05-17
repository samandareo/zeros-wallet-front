import React, {Component} from 'react';
import TronWeb from "tronweb";
import jwtDecode from "jwt-decode";
import axios from "axios";
import moment from "moment";
import receive from "../../images/receive.png"
import deposit from "../../images/deposit.png"
import {Link} from "react-router-dom";

class Tron extends Component {
    constructor() {
        super();
        this.state={
            loading:true,address:'',privatekey:"",data:[],platform:"",type:"",
            contractAddress:"",decimal:"",price:"0",
            name:"",id:""
        }
    }
    async componentDidMount() {
        this.setState({
            platform:this.props.platform,type:this.props.type,price:this.props.price,
            contractAddress:this.props.contractAddress,decimal:this.props.decimal,
            address:this.props.address,data:[],name:this.props.symbol,
            id:this.props.id
        })
        var token = localStorage.getItem("authtoken")
        var decoded = jwtDecode(token)
        //console.log(decoded)
        const key1 =await decoded.key1
        await this.setState({privatekey:key1})
        const tronWeb = new TronWeb({
            fullHost: 'https://api.trongrid.io',
            eventServer: 'https://api.someotherevent.io', privateKey: key1}
        )
        const address =await tronWeb.defaultAddress["base58"];
        this.setState({address:address})
        //console.log(address)

        //var address ="TE4BvrRhajKr2EGeZjBCcQe2FnFaAr5HU9"
        if(this.props.type=="Token"){
            axios.get("https://api.trongrid.io/v1/accounts/"+address+"/transactions/trc20?limit=100&contract_address="+this.state.contractAddress)
                .then(res=>{
                    //console.log(res.data.data)
                    this.setState({data:res.data.data,loading:false})
                })
                .catch(err=>{
                    this.setState({loading:false})
                })
        }else{
            axios.get("https://api.trongrid.io/v1/accounts/"+address+"/transactions")
                .then(res=>{
                    //console.log(res.data.data)
                    this.setState({data:res.data.data,loading:false})
                })
                .catch(err=>{
                    this.setState({loading:false})
                })
        }
    }

    render() {
        const tronWeb = new TronWeb({
            fullHost: 'https://api.trongrid.io',
            eventServer: 'https://api.someotherevent.io', privateKey: this.state.privatekey}
        )
        const dataval = this.state.data.map(res=>{
            if(this.state.type=="Token"){
                var ttype="";
                var mul=1;
                for (let i = 1; i <=res.token_info.decimals; i++) {
                    mul=mul+"0";
                }
                //console.log(mul)
                if(res.from==this.state.address){
                    ttype="Sent"
                }
                if(res.to==this.state.address){
                    ttype="Received"
                }
                //console.log(res.transaction_id)
                var valu = res.value/mul;
                return(
                    <Link to={"/trx/"+this.state.id+"/"+res.transaction_id} style={{textDecoration:"none"}}>
                    <div className="transaction-item receive">
                        <div className="transaction-info">

                            <div className={ttype=="Sent"?"transaction-icon send":"transaction-icon receive"}>
                                <img src={ttype=="Sent"?receive:deposit} alt="" width="20px"/>
                            </div>
                            <div className="transaction-details">
                                <div className="address">{res.transaction_id.substring(0,20)}..</div>
                                <div className="type">{ttype}</div>
                            </div>
                        </div>
                        <div className={ttype=="Sent"?"transaction-amount negative":"transaction-amount positive"}>
                            <div className="amount">{ttype=="Sent"?"-":"+"}{parseFloat(valu).toFixed(6)} {this.state.name}</div>
                            <div className="time">{moment(res.block_timestamp).format('L')}</div>
                        </div>
                    </div>
                    </Link>

                )
            }else{
                var rs = res.raw_data.contract[0]["parameter"].value
                console.log(rs)
                var ttype=""
                var valu=rs.amount/1000000
                console.log(tronWeb.address.fromHex(rs.owner_address))
                if(tronWeb.address.fromHex(rs.owner_address)==this.state.address){
                    ttype="Sent"
                }
                if(tronWeb.address.fromHex(rs.to_address)==this.state.address){
                    ttype="Received"
                }
                var to = tronWeb.address.fromHex(rs.to_address)
                var from = tronWeb.address.fromHex(rs.owner_address)
                return(
                    <Link to={"/trx/"+this.state.id+"/"+res.txID} style={{textDecoration:"none"}}>
                    <div className="transaction-item receive">
                        <div className="transaction-info">

                            <div className={ttype=="Sent"?"transaction-icon send":"transaction-icon receive"}>
                                <img src={ttype=="Sent"?receive:deposit} alt="" width="20px"/>
                            </div>
                            <div className="transaction-details">
                                <div className="address">{res.txID.substring(0,20)}..</div>
                                <div className="type">{ttype}</div>
                            </div>
                        </div>
                        <div className={ttype=="Sent"?"transaction-amount negative":"transaction-amount positive"}>
                            <div className="amount">{ttype=="Sent"?"-":"+"}{parseFloat(valu).toFixed(6)} {this.state.name}</div>
                            <div className="time">{moment(res.block_timestamp).format('L')}</div>
                        </div>
                    </div>
                    </Link>

                )
            }
        });
        return (
            <>
                {
                    this.state.loading==true?
                        <div style={{textAlign:"center",marginBottom:"300px"}}>
                            <div className="spinner-border text-primary text-center" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>:
                        this.state.data.length>0?
                            <>
                                {dataval}
                            </>
                            :""
                }
                {this.state.data.length>0 ?<></>:
                    <div className="text-center" role="status">
                        <p style={{marginTop:"100px",marginBottom:"200px"}}>Transactions not available</p>
                    </div>
                }
            </>
        );
    }
}

export default Tron;