import React, {Component} from 'react';
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png"
import ApiUrl from "../AppUrl/ApiUrl";
import axios from "axios";
import moment from "moment";
import {ethers} from "ethers";
import TronWeb from "tronweb";
import jwtDecode from "jwt-decode";
import {toast} from "react-toastify";
import RouteCheck from "../components/routeCheck";

class TrxDetails extends Component {
    constructor({match}) {
        super();
        this.state={
            token:"",data:[],
            id:match.params.id,
            hash:match.params.hash,price:"",day_change:"",logo:"",symbol:"",
            platform:"",type:"",amount:"",time:"",from:"",to:"",coin_symbol:"",gasfee:"",
            loading:true,feecoin:"",price1:"0",day_change1:"0"
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            var decoded = jwtDecode(token)
            var key1 = decoded.key1
            const provider = new ethers.providers.EtherscanProvider()
            let wallet = new ethers.Wallet(key1);
            var address = wallet.address
            var dwallet = JSON.parse(localStorage.getItem("dwallet"))
            if(dwallet){
                dwallet.filter((res)=>{
                    if(this.state.id==res.id){
                        this.setState({coin_symbol:res.coin_symbol,logo:res.logo,
                            coin_type:res.coin_type,
                            platform:res.platform,type:res.coin_type,symbol:res.coin_symbol,
                            contract:res.contract,coin_name:res.coin_name,rpc:res.rpc,chain:res.chain,
                            price1:res.price,day_change1:res.day_change
                        })
                        dwallet.filter((res1)=>{
                            if(res.platform==res1.platform && res1.coin_type=="Coin"){
                                this.setState({feecoin:res1.coin_symbol,price:res1.price,day_change:res1.day_change})
                            }
                        })
                        if(res.platform=="Base"){
                            //console.log(res)
                            if(res.coin_type=="Token"){
                                axios.get("https://api.basescan.org/api?module=account&action=tokentx&contractaddress="+res.contract+"&address="+address+"&page=1&offset=100&startblock=0&endblock=2007025780&sort=desc&apikey=6V82VR9P838DBJUP2SRB56WBUHGHXRTEW5")
                                    .then(res1=>{
                                        res1.data.result.map(rs=>{
                                            if(rs.hash==this.state.hash){
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
                                                this.setState({
                                                    amount:balance,
                                                    time:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:rs.from,
                                                    to:rs.to,coin_symbol:"",gasfee:parseFloat(rs.gas)*parseFloat(rs.gasPrice)/ 1000000000000000000,
                                                    type:ttype,loading:false
                                                })
                                                //console.log(parseFloat(rs.gasPrice)/ 1000000000000000000,"Gas Fee")
                                            }
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
                                            if(rs.hash==this.state.hash){
                                                console.log(rs)
                                                var ttype=""
                                                if(rs.from==address.toLowerCase()){
                                                    ttype="Sent"
                                                }
                                                if(rs.to==address.toLowerCase()){
                                                    ttype="Received"
                                                }

                                                this.setState({
                                                    amount:ethers.utils.formatEther(rs.value),
                                                    time:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:rs.from,
                                                    to:rs.to,coin_symbol:"",gasfee:parseFloat(rs.gas)*parseFloat(rs.gasPrice)/ 1000000000000000000,
                                                    type:ttype,loading:false
                                                })
                                                //console.log(parseFloat(rs.gasPrice)/ 1000000000000000000,"Gas Fee")
                                            }
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
                                            if(rs.hash==this.state.hash){
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
                                                this.setState({
                                                    amount:balance,
                                                    time:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:rs.from,
                                                    to:rs.to,coin_symbol:"",gasfee:parseFloat(rs.gas)*parseFloat(rs.gasPrice)/ 1000000000000000000,
                                                    type:ttype,loading:false
                                                })
                                                //console.log(parseFloat(rs.gasPrice)/ 1000000000000000000,"Gas Fee")
                                            }
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
                                            if(rs.hash==this.state.hash){
                                                console.log(rs)
                                                var ttype=""
                                                if(rs.from==address.toLowerCase()){
                                                    ttype="Sent"
                                                }
                                                if(rs.to==address.toLowerCase()){
                                                    ttype="Received"
                                                }

                                                this.setState({
                                                    amount:ethers.utils.formatEther(rs.value),
                                                    time:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:rs.from,
                                                    to:rs.to,coin_symbol:"",gasfee:parseFloat(rs.gas)*parseFloat(rs.gasPrice)/ 1000000000000000000,
                                                    type:ttype,loading:false
                                                })
                                                //console.log(parseFloat(rs.gasPrice)/ 1000000000000000000,"Gas Fee")
                                            }
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
                                            if(rs.hash==this.state.hash){
                                                console.log(rs)
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
                                                this.setState({
                                                    amount:balance,
                                                    time:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:rs.from,
                                                    to:rs.to,coin_symbol:"",gasfee:parseFloat(rs.gas)*parseFloat(rs.gasPrice)/ 1000000000000000000,
                                                    type:ttype,loading:false
                                                })
                                                //console.log(parseFloat(rs.gasPrice)/ 1000000000000000000,"Gas Fee")
                                            }
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
                                            if(rs.hash==this.state.hash){
                                                console.log(rs)
                                                var ttype=""
                                                if(rs.from==address.toLowerCase()){
                                                    ttype="Sent"
                                                }
                                                if(rs.to==address.toLowerCase()){
                                                    ttype="Received"
                                                }

                                                this.setState({
                                                    amount:ethers.utils.formatEther(rs.value),
                                                    time:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:rs.from,
                                                    to:rs.to,coin_symbol:"",gasfee:parseFloat(rs.gas)*parseFloat(rs.gasPrice)/ 1000000000000000000,
                                                    type:ttype,loading:false
                                                })
                                                //console.log(parseFloat(rs.gasPrice)/ 1000000000000000000,"Gas Fee")
                                            }
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
                                            if(rs.hash==this.state.hash){
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
                                                this.setState({
                                                    amount:balance,
                                                    time:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:rs.from,
                                                    to:rs.to,coin_symbol:"",gasfee:parseFloat(rs.gas)*parseFloat(rs.gasPrice)/ 1000000000000000000,
                                                    type:ttype,loading:false
                                                })
                                                //console.log(parseFloat(rs.gasPrice)/ 1000000000000000000,"Gas Fee")
                                            }
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
                                            if(rs.hash==this.state.hash){
                                                console.log(rs)
                                                var ttype=""
                                                if(rs.from==address.toLowerCase()){
                                                    ttype="Sent"
                                                }
                                                if(rs.to==address.toLowerCase()){
                                                    ttype="Received"
                                                }

                                                this.setState({
                                                    amount:ethers.utils.formatEther(rs.value),
                                                    time:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:rs.from,
                                                    to:rs.to,coin_symbol:"",gasfee:parseFloat(rs.gas)*parseFloat(rs.gasPrice)/ 1000000000000000000,
                                                    type:ttype,loading:false
                                                })
                                                //console.log(parseFloat(rs.gasPrice)/ 1000000000000000000,"Gas Fee")
                                            }
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
                                            if(rs.hash==this.state.hash){
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
                                                this.setState({
                                                    amount:balance,
                                                    time:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:rs.from,
                                                    to:rs.to,coin_symbol:"",gasfee:parseFloat(rs.gas)*parseFloat(rs.gasPrice)/ 1000000000000000000,
                                                    type:ttype,loading:false
                                                })
                                                //console.log(parseFloat(rs.gasPrice)/ 1000000000000000000,"Gas Fee")
                                            }
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
                                            if(rs.hash==this.state.hash){
                                                console.log(rs)
                                                var ttype=""
                                                if(rs.from==address.toLowerCase()){
                                                    ttype="Sent"
                                                }
                                                if(rs.to==address.toLowerCase()){
                                                    ttype="Received"
                                                }

                                                this.setState({
                                                    amount:ethers.utils.formatEther(rs.value),
                                                    time:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:rs.from,
                                                    to:rs.to,coin_symbol:"",gasfee:parseFloat(rs.gas)*parseFloat(rs.gasPrice)/ 1000000000000000000,
                                                    type:ttype,loading:false
                                                })
                                                //console.log(parseFloat(rs.gasPrice)/ 1000000000000000000,"Gas Fee")
                                            }
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
                                            if(rs.hash==this.state.hash){
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
                                                this.setState({
                                                    amount:balance,
                                                    time:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:rs.from,
                                                    to:rs.to,coin_symbol:"",gasfee:parseFloat(rs.gas)*parseFloat(rs.gasPrice)/ 1000000000000000000,
                                                    type:ttype,loading:false
                                                })
                                                //console.log(parseFloat(rs.gasPrice)/ 1000000000000000000,"Gas Fee")
                                            }
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
                                            if(rs.hash==this.state.hash){
                                                console.log(rs)
                                                var ttype=""
                                                if(rs.from==address.toLowerCase()){
                                                    ttype="Sent"
                                                }
                                                if(rs.to==address.toLowerCase()){
                                                    ttype="Received"
                                                }

                                                this.setState({
                                                    amount:ethers.utils.formatEther(rs.value),
                                                    time:moment(rs.timeStamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:rs.from,
                                                    to:rs.to,coin_symbol:"",gasfee:parseFloat(rs.gas)*parseFloat(rs.gasPrice)/ 1000000000000000000,
                                                    type:ttype,loading:false
                                                })
                                                //console.log(parseFloat(rs.gasPrice)/ 1000000000000000000,"Gas Fee")
                                            }
                                        })
                                    })
                                    .catch(err=>{
                                        console.log(err)
                                    })
                            }
                        }

                        if(res.platform=="Tron") {
                            const tronWeb = new TronWeb({
                                    fullHost: 'https://api.trongrid.io',
                                    eventServer: 'https://api.someotherevent.io', privateKey: key1
                                }
                            )
                            const address1 = tronWeb.defaultAddress["base58"];
                            if (res.coin_type == "Token") {
                                axios.get("https://api.trongrid.io/v1/accounts/" + address1 + "/transactions/trc20?limit=100&contract_address=" + res.contract)
                                    .then(res1 => {
                                        console.log(res1.data.data, "Tron")
                                        res1.data.data.map(rs => {
                                            if(this.state.hash==rs.txID){
                                                var mul = 1;
                                                for (let i = 1; i <= rs.token_info.decimals; i++) {
                                                    mul = mul + "0";
                                                }
                                                var valu = rs.value / mul;
                                                console.log(valu)
                                                var ttype = ""
                                                if (tronWeb.address.fromHex(rs1.owner_address) == address1) {
                                                    ttype = "Sent"
                                                }
                                                if (tronWeb.address.fromHex(rs1.to_address) == address1) {
                                                    ttype = "Received"
                                                }
                                                this.setState({
                                                    amount:valu,
                                                    time:moment(rs.block_timestamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:rs.from,
                                                    to:rs.to,gasfee:parseFloat(rs.energy_fee)/ 1000000,
                                                    type:ttype,loading:false
                                                })
                                            }

                                        })
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                            }
                            if (res.coin_type == "Coin") {
                                axios.get("https://api.trongrid.io/v1/accounts/" + address1 + "/transactions")
                                    .then(res1 => {
                                        console.log(res1.data.data, "Tron")
                                        res1.data.data.map(rs => {

                                            if(this.state.hash==rs.txID){
                                                var rs1 = rs.raw_data.contract[0]["parameter"].value
                                                var valu = rs1.amount / 1000000
                                                console.log(valu)
                                                var ttype = ""
                                                if (tronWeb.address.fromHex(rs1.owner_address) == address1) {
                                                    ttype = "Sent"
                                                }
                                                if (tronWeb.address.fromHex(rs1.to_address) == address1) {
                                                    ttype = "Received"
                                                }
                                                this.setState({
                                                    amount:rs1.amount/1000000,
                                                    time:moment(rs.block_timestamp*1000).format("YYYY-MM-DD HH:mm:ss"),from:tronWeb.address.fromHex(rs1.owner_address),
                                                    to:tronWeb.address.fromHex(rs1.to_address),gasfee:parseFloat(rs.energy_fee)/ 1000000,
                                                    type:ttype,loading:false
                                                })
                                            }

                                        })
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                            }
                        }

                    }
                })
            }
        }
    }

    onCopyFrom=()=>{
        navigator.clipboard.writeText(this.state.from)
        toast.success(this.state.from, {
            theme: "colored",
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        });
        localStorage.setItem("backup",true)
    }

    onCopyTo=()=>{
        navigator.clipboard.writeText(this.state.to)
        toast.success(this.state.to, {
            theme: "colored",
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        });
        localStorage.setItem("backup",true)
    }

    render() {
        var val = this.state
        //console.log(val)
        var bb = parseFloat(val.amount)*parseFloat(val.price1)
        return (
            <>
                <RouteCheck/>
                <div className="receive-eth-container">
                    <title>{val.type} {val.symbol}</title>
                    <div className="receive-eth-header">
                        <Link onClick={()=>this.props.history.go(-1)} to="#" className="receive-eth-back">
                            <img src={backbtn} alt="" width="30px"/>
                        </Link>
                        <h1>{val.type} {val.symbol}</h1>
                    </div>
                    {
                        val.loading==true?
                            <div style={{textAlign:"center",marginTop:"100px"}}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            :
                            <div className="receive-eth-content">
                                <div className="receive-eth-icon">
                                    {val.logo?<img src={val.logo} alt="ETH Logo" width="64"
                                                    height="64"/>:""}

                                </div>

                                <div className="receive-eth-amount">
                                    <h2>{val.type=="Sent"?"-":"+"} { parseFloat(val.amount).toFixed(8)} {val.symbol}</h2>
                                    <p className="receive-eth-usd">${(parseFloat(val.amount)*parseFloat(val.price1)).toFixed(bb>1?2:bb>0.00001?5:bb==0?2:8)}</p>
                                </div>

                                <div className="receive-eth-status">
                                    <span className="receive-eth-check">✓</span>
                                    Done
                                </div>

                                <div className="receive-transaction-details mt-5">
                                    <h3>Transaction Details</h3>

                                    <div className="receive-detail-row">
                                        <span className="receive-label">Time</span>
                                        <div className="receive-value d-flex align-items-center">
                                            {val.time}
                                        </div>
                                    </div>

                                    <div className="receive-detail-row">
                                        <span className="receive-label">From</span>
                                        <div className="receive-value d-flex align-items-center">
                                            {val.from.substring(0,20)}...
                                            <button onClick={this.onCopyFrom} className="receive-copy-btn ms-2 ">
                                                <img src="/copy-solid.svg" alt="Copy"/>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="receive-detail-row">
                                        <span className="receive-label">To</span>
                                        <div className="receive-value d-flex align-items-center">
                                            {val.to.substring(0,20)}...
                                            <button onClick={this.onCopyTo} className="receive-copy-btn ms-2">
                                                <img src="/copy-solid.svg" alt="Copy"/>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="receive-detail-row">
                                        <span className="receive-label">Chain</span>
                                        <span className="receive-value">{val.platform=="Binance"?"BSC Smart ":val.platform} Chain</span>
                                    </div>

                                    <div className="receive-detail-row">
                                        <span className="receive-label">Gas Fee</span>
                                        <span className="receive-value">{parseFloat(val.gasfee).toFixed(8)} {val.feecoin} ≈ ${(parseFloat(val.gasfee)*parseFloat(val.price)).toFixed(4)}</span>
                                    </div>
                                </div>

                            </div>
                    }
                </div>
            </>
        );
    }
}

export default TrxDetails;