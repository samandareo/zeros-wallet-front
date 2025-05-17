import React, {Component} from 'react';
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png";
import receive from "../images/receive.png";
import deposit from "../images/deposit.png";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import moment from "moment";
import RouteCheck from "../components/routeCheck";

class History extends Component {
    constructor() {
        super();
        this.state={
            token:"",limit:"100",data:[],loading:true
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        var mytrx = JSON.parse(localStorage.getItem("mytrx"))
        if(mytrx){
            this.setState({data:mytrx,loading:false})
        }
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            var formd = new FormData()
            formd.append("token",token)
            formd.append("limit",this.state.limit)
            Axios.post(ApiUrl.baseurl+"auth/payments",formd)
                .then(res=>{
                    console.log(res.data.data,"My TRX")
                    if (res.data.success){
                        this.setState({data:res.data.data,loading:false})
                        localStorage.setItem("mytrx",JSON.stringify(res.data.data))
                    }
                })
                .catch(err=>{
                    //localStorage.removeItem("authtoken")
                    this.componentDidMount()
                })
        }else {
            this.props.history.push("/home")
        }
    }

    render() {
        var trx=this.state.data.map(res=>{
            return(
                <div style={{padding:"20px 30px"}} className="transaction-item transaction-item2 receive">
                    <div className="transaction-info">


                        <div className="transaction-details" style={{paddingLeft:"5px"}}>
                            <div className="address">
                                ID
                            </div>
                            <div className="address">
                                {res.trx=="N/A"?"Hash N/A":
                                <a href={res.explorer+"/tx/"+res.trx} target="_blank">
                                    {res.trx.substring(0,20)+"..."}
                                </a>
                                }
                            </div>
                            <div className="type" style={{fontSize:"14px",color:"black"}}>{res.type}</div>
                            <div className="type" style={{fontSize:"14px",color:"black"}}>Status</div>
                        </div>
                    </div>
                    <div className={res.type=="Withdrew"?"transaction-amount negative":"transaction-amount positive"}>
                        <div className="time" style={{fontSize:"14px",color:"black"}}>{res.id}</div>
                        <div className="amount">{res.type=="Withdrew"?"-"+res.amount:"+"+res.amount} {res.coin_symbol}</div>
                        <div className="time" style={{fontSize:"14px",color:"black"}}>{moment(res.created_at).format('L')}</div>
                        <div className="time" style={{fontSize:"14px",color:res.status=="Success"?"green":"black"}}>{res.status}</div>
                    </div>
                </div>
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
                        <h1 className="text-center mb-0">My History</h1>
                        <button className="notification-btn">

                        </button>
                    </div>
                    <br/>

                    <div className="transaction-list"
                         style={{height:"auto",minHeight:"700px",
                             borderBottomLeftRadius:"0px", borderBottomRightRadius:"0px"
                         }}>
                        <h1>Transaction</h1>
                        {
                            this.state.loading==true?
                                <div style={{textAlign:"center",marginTop:"50px"}}>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                                :
                                ""
                        }
                        {trx}
                        {this.state.data.length==0 && this.state.loading==false?
                            <div className="text-center" role="status">
                                <p style={{marginTop:"100px",marginBottom:"200px"}}>Transactions not available</p>
                            </div>
                            :""

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

export default History;