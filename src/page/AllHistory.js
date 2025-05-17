
import React, {Component} from 'react';
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png";
import receive from "../images/receive.png";
import deposit from "../images/deposit.png";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import moment from "moment";
import jwtDecode from "jwt-decode";
import {ethers} from "ethers";
import axios from "axios";
import TronWeb from "tronweb";
import RouteCheck from "../components/routeCheck";

class AllHistory extends Component {
    constructor() {
        super();
        this.state={
            token:"",limit:"100",data:[]
        }
    }
    async componentDidMount() {
        window.scrollTo(0, 0);
        var trxlist=[]
        var token =await localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            var decoded =await jwtDecode(token)
            var key1 =await decoded.key1
            const provider = new ethers.providers.EtherscanProvider()
            let wallet =await new ethers.Wallet(key1);
            var address =await wallet.address

            var dwallet =await JSON.parse(localStorage.getItem("dwallet"))
            if(dwallet){

                await dwallet.map(res=>{
                    //console.log(res)
                    if(res.platform=="Base"){
                        //console.log(res)
                        if(res.coin_type=="Token"){
                            axios.get("https://api.basescan.org/api?module=account&action=tokentx&contractaddress="+res.contract+"&address="+address+"&page=1&offset=100&startblock=0&endblock=2007025780&sort=desc&apikey=6V82VR9P838DBJUP2SRB56WBUHGHXRTEW5")
                                .then(res1=>{
                                    res1.data.result.map(rs=>{
                                        var ttype=""
                                        if(rs.from==address.toLowerCase()){
                                            ttype="Sent"
                                        }
                                        if(rs.to==address.toLowerCase()){
                                            ttype="Received"
                                        }
                                        var mul=1;
                                        for (let i = 1; i <=rs.tokenDecimal; i++) {
                                            mul=mul+"0";
                                        }
                                        var balance = rs.value/mul;
                                        var val ={amount:balance,
                                            created_at:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.hash,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }
                        if(res.coin_type=="Coin"){
                            axios.get("https://api.basescan.org/api?module=account&action=txlist&address="+address+"&startblock=0&endblock=9999999999&page=1&offset=100&sort=desc&apikey=6V82VR9P838DBJUP2SRB56WBUHGHXRTEW5")
                                .then(res1=>{

                                    res1.data.result.map(rs=>{
                                        var ttype=""
                                        if(rs.from==address.toLowerCase()){
                                            ttype="Sent"
                                        }
                                        if(rs.to==address.toLowerCase()){
                                            ttype="Received"
                                        }
                                        var val ={amount:ethers.utils.formatEther(rs.value),
                                            created_at:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.hash,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }
                    }
                    if(res.platform=="Ethereum"){
                        if(res.coin_type=="Token"){
                            axios.get("https://api.etherscan.io/api?module=account&action=tokentx&contractaddress="+res.contract+"&address="+address+"&page=1&offset=100&startblock=0&endblock=2007025780&sort=desc&apikey=GY9N4RUU89PUETADPZ8XZ4ZG6SJ6Y4PDE9")
                                .then(res1=>{
                                    res1.data.result.map(rs=>{
                                        var ttype=""
                                        if(rs.from==address.toLowerCase()){
                                            ttype="Sent"
                                        }
                                        if(rs.to==address.toLowerCase()){
                                            ttype="Received"
                                        }
                                        var mul=1;
                                        for (let i = 1; i <=rs.tokenDecimal; i++) {
                                            mul=mul+"0";
                                        }
                                        var balance = rs.value/mul;
                                        var val ={amount:balance,
                                            created_at:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.hash,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }
                        if(res.coin_type=="Coin"){
                            axios.get("https://api.etherscan.io/api?module=account&action=txlist&address="+address+"&startblock=0&endblock=9999999999&page=1&offset=100&sort=desc&apikey=8C7MFPJYA6BSGGZZDSA3YU4H9BT582VRSZ")
                                .then(res1=>{

                                    res1.data.result.map(rs=>{
                                        var ttype=""
                                        if(rs.from==address.toLowerCase()){
                                            ttype="Sent"
                                        }
                                        if(rs.to==address.toLowerCase()){
                                            ttype="Received"
                                        }
                                        var val ={amount:ethers.utils.formatEther(rs.value),
                                            created_at:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.hash,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }
                    }
                    if(res.platform=="Binance"){
                        if(res.coin_type=="Token"){
                            axios.get("https://api.bscscan.com/api?module=account&action=tokentx&contractaddress="+res.contract+"&address="+address+"&page=1&offset=100&startblock=0&endblock=2007025780&sort=desc&apikey=7IEVKBDRZ9IQZGX2A3I4JBR4SH3WD131B2")
                                .then(res1=>{
                                    res1.data.result.map(rs=>{
                                        var ttype=""
                                        if(rs.from==address.toLowerCase()){
                                            ttype="Sent"
                                        }
                                        if(rs.to==address.toLowerCase()){
                                            ttype="Received"
                                        }
                                        var mul=1;
                                        for (let i = 1; i <=rs.tokenDecimal; i++) {
                                            mul=mul+"0";
                                        }
                                        var balance = rs.value/mul;
                                        var val ={amount:balance,
                                            created_at:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.hash,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }
                        if(res.coin_type=="Coin"){
                            axios.get("https://api.bscscan.com/api?module=account&action=txlist&address="+address+"&startblock=0&endblock=9999999999&page=1&offset=100&sort=desc&apikey=E7I26FJ1SQ4HWDETKZ5ZC71M65D4B8Y3HS")
                                .then(res1=>{

                                    res1.data.result.map(rs=>{
                                        var ttype=""
                                        if(rs.from==address.toLowerCase()){
                                            ttype="Sent"
                                        }
                                        if(rs.to==address.toLowerCase()){
                                            ttype="Received"
                                        }
                                        var val ={amount:ethers.utils.formatEther(rs.value),
                                            created_at:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.hash,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }
                    }
                    if(res.platform=="Polygon"){
                        if(res.coin_type=="Token"){
                            axios.get("https://api.polygonscan.com/api?module=account&action=tokentx&contractaddress="+res.contract+"&address="+address+"&page=1&offset=100&startblock=0&endblock=2007025780&sort=desc&apikey=JFX22E3QI2CXZG4RJ7I38T9QJICDR8MSJE")
                                .then(res1=>{
                                    res1.data.result.map(rs=>{
                                        var ttype=""
                                        if(rs.from==address.toLowerCase()){
                                            ttype="Sent"
                                        }
                                        if(rs.to==address.toLowerCase()){
                                            ttype="Received"
                                        }
                                        var mul=1;
                                        for (let i = 1; i <=rs.tokenDecimal; i++) {
                                            mul=mul+"0";
                                        }
                                        var balance = rs.value/mul;
                                        var val ={amount:balance,
                                            created_at:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.hash,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }
                        if(res.coin_type=="Coin"){
                            axios.get("https://api.polygonscan.com/api?module=account&action=txlist&address="+address+"&startblock=0&endblock=9999999999&page=1&offset=100&sort=desc&apikey=8W4B2BWQTC4JG9ZP6JQUFIMVM986TPTNMF")
                                .then(res1=>{

                                    res1.data.result.map(rs=>{
                                        var ttype=""
                                        if(rs.from==address.toLowerCase()){
                                            ttype="Sent"
                                        }
                                        if(rs.to==address.toLowerCase()){
                                            ttype="Received"
                                        }
                                        var val ={amount:ethers.utils.formatEther(rs.value),
                                            created_at:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.hash,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }
                    }
                    if(res.platform=="Fantom"){
                        if(res.coin_type=="Token"){
                            axios.get("https://api.ftmscan.com/api?module=account&action=tokentx&contractaddress="+res.contract+"&address="+address+"&page=1&offset=100&startblock=0&endblock=2007025780&sort=desc&apikey=CH4EKY3AP752H57IK8B7QVY8GGWWMQY4RH")
                                .then(res1=>{
                                    res1.data.result.map(rs=>{
                                        var ttype=""
                                        if(rs.from==address.toLowerCase()){
                                            ttype="Sent"
                                        }
                                        if(rs.to==address.toLowerCase()){
                                            ttype="Received"
                                        }
                                        var mul=1;
                                        for (let i = 1; i <=rs.tokenDecimal; i++) {
                                            mul=mul+"0";
                                        }
                                        var balance = rs.value/mul;
                                        var val ={amount:balance,
                                            created_at:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.hash,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }
                        if(res.coin_type=="Coin"){
                            axios.get("https://api.ftmscan.com/api?module=account&action=txlist&address="+address+"&startblock=0&endblock=9999999999&page=1&offset=100&sort=desc&apikey=2QSIENUEBF5T9R75J4UWF6RI2XSYSKH13R")
                                .then(res1=>{

                                    res1.data.result.map(rs=>{
                                        var ttype=""
                                        if(rs.from==address.toLowerCase()){
                                            ttype="Sent"
                                        }
                                        if(rs.to==address.toLowerCase()){
                                            ttype="Received"
                                        }
                                        var val ={amount:ethers.utils.formatEther(rs.value),
                                            created_at:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.hash,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }
                    }
                    if(res.platform=="Avalanche"){
                        if(res.coin_type=="Token"){
                            axios.get("https://api.snowtrace.io/api?module=account&action=tokentx&contractaddress="+res.contract+"&address="+address+"&page=1&offset=100&startblock=0&endblock=2007025780&sort=desc&apikey=VBCFBYV5DZ8I6B4UQSXKIG46S5253ZNB2A")
                                .then(res1=>{
                                    res1.data.result.map(rs=>{
                                        var ttype=""
                                        if(rs.from==address.toLowerCase()){
                                            ttype="Sent"
                                        }
                                        if(rs.to==address.toLowerCase()){
                                            ttype="Received"
                                        }
                                        var mul=1;
                                        for (let i = 1; i <=rs.tokenDecimal; i++) {
                                            mul=mul+"0";
                                        }
                                        var balance = rs.value/mul;
                                        var val ={amount:balance,
                                            created_at:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.hash,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }
                        if(res.coin_type=="Coin"){
                            axios.get("https://api.snowtrace.io/api?module=account&action=txlist&address="+address+"&startblock=0&endblock=9999999999&page=1&offset=100&sort=desc&apikey=JNDGEE4V9GBS8TNQVYHPS7YQSTIYNHJ1ET")
                                .then(res1=>{

                                    res1.data.result.map(rs=>{
                                        var ttype=""
                                        if(rs.from==address.toLowerCase()){
                                            ttype="Sent"
                                        }
                                        if(rs.to==address.toLowerCase()){
                                            ttype="Received"
                                        }
                                        var val ={amount:ethers.utils.formatEther(rs.value),
                                            created_at:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.hash,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }
                    }

                    if(res.platform=="Tron"){
                        const tronWeb = new TronWeb({
                            fullHost: 'https://api.trongrid.io',
                            eventServer: 'https://api.someotherevent.io', privateKey: key1}
                        )
                        const address1 = tronWeb.defaultAddress["base58"];
                        if(res.coin_type=="Token"){
                            axios.get("https://api.trongrid.io/v1/accounts/"+address1+"/transactions/trc20?limit=100&contract_address="+res.contract)
                                .then(res1=>{
                                    console.log(res1.data.data,"Tron")
                                    res1.data.data.map(rs=>{
                                        var mul=1;
                                        for (let i = 1; i <=rs.token_info.decimals; i++) {
                                            mul=mul+"0";
                                        }
                                        var valu = rs.value/mul;
                                        console.log(valu)
                                        var ttype=""
                                        if(tronWeb.address.fromHex(rs1.owner_address)==address1){
                                            ttype="Sent"
                                        }
                                        if(tronWeb.address.fromHex(rs1.to_address)==address1){
                                            ttype="Received"
                                        }
                                        var val ={amount:valu,
                                            created_at:moment(rs.block_timestamp).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.txID,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }
                        if(res.coin_type=="Coin"){
                            axios.get("https://api.trongrid.io/v1/accounts/"+address1+"/transactions")
                                .then(res1=>{
                                    console.log(res1.data.data,"Tron")
                                    res1.data.data.map(rs=>{
                                        var rs1 = rs.raw_data.contract[0]["parameter"].value
                                        var valu=rs1.amount/1000000
                                        console.log(valu)
                                        var ttype=""
                                        if(tronWeb.address.fromHex(rs1.owner_address)==address1){
                                            ttype="Sent"
                                        }
                                        if(tronWeb.address.fromHex(rs1.to_address)==address1){
                                            ttype="Received"
                                        }
                                        var val ={amount:valu,
                                            created_at:moment(rs.block_timestamp).format("YYYY-MM-DD HH:mm:ss"),
                                            trx:rs.txID,coin_symbol:res.coin_symbol,platform:res.platform,type:ttype,
                                            id:res.id
                                        }
                                        trxlist.push(val)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        }

                    }
                })

            }

           setTimeout(()=>{
                //console.log(trxlist)
                this.setState({data:trxlist})
           },1000)


        }else {
            this.props.history.push("/home")
        }
    }

    render() {
        var tx = this.state.data.sort(function(a, b){return b.created_at-a.created_at});
        var trx=tx.map(res=>{
            var amount = parseFloat(res.amount)
            return(

                <Link to={"/trx/"+res.id+"/"+res.trx} style={{textDecoration:"none",height:"auto"}}>
                    <div className="transaction-item receive" style={{height:"70px"}}>
                        <div className="transaction-info">

                            <div className="transaction-icon receive">
                                <img src={res.type=="Sent"?receive:deposit} alt="" width="20px"/>
                            </div>
                            <div className="transaction-details">
                                <div className="address">
                                    {res.trx.substring(0,20)+"..."}
                                </div>
                                <div className="type" style={{fontSize:"14px"}}>{res.type}</div>
                            </div>
                        </div>
                        <div className={res.type=="Sent"?"transaction-amount negative":"transaction-amount positive"}>
                            <div className="amount">{res.type=="Sent"?"-"+amount.toFixed(amount>=1?2:6):"+"+amount.toFixed(amount>=1?2:6)} {res.coin_symbol}</div>
                            <div className="time">{moment(res.created_at).format('L')}</div>
                        </div>
                    </div>
                </Link>
            )
        })
        return (
            <>
                <title>Transactions History</title>
                <RouteCheck/>
                <div className="mobile-container coindetails">
                    <div className="wallet-header">
                        <Link onClick={()=>this.props.history.go(-1)} to="#" className="back-btn">
                            <img src={backbtn} alt="Back" width="30px"/>
                        </Link>
                        <h1 className="text-center mb-0">History</h1>
                        <button className="notification-btn">

                        </button>
                    </div>
                    <br/>

                    <div className="transaction-list"
                         style={{height:"auto",minHeight:"700px",
                             borderBottomLeftRadius:"0px", borderBottomRightRadius:"0px"
                         }}>
                        <h1>Transaction</h1>

                        {trx}
                        {this.state.data.length>0?<></>:
                            <div className="text-center" role="status">
                                <p style={{marginTop:"100px",marginBottom:"200px"}}>Transactions not available</p>
                            </div>
                        }

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

export default AllHistory;