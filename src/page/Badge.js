import React, {Component} from 'react';
import {Link} from "react-router-dom";
import jwtDecode from "jwt-decode";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import {toast} from "react-toastify";

class Badge extends Component {
    constructor() {
        super();
        this.state={
            amount:"1.20",wallet:[],
            trx:[],loading:true,loadsubmit:false,badge:"",
            coin_id:"6",name:"BNB",logo:"https://zeroswallet.com/images/jjhRo0zmewY0Gg.png"
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var badge = localStorage.getItem("badge")
        if(badge){
            this.setState({badge:badge})
        }
        Axios.get(ApiUrl.baseurl+"all-badge")
            .then(res=>{
                if(res.data.success){
                    console.log(res.data.data)
                    this.setState({trx:res.data.data})
                }
                this.setState({loading:false})
            })
            .catch(err=>{
                //this.setState({loading:false})
                this.componentDidMount()
            })
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            var decoded = jwtDecode(token)
            var formD = new FormData()
            formD.append("id",decoded.user_id)
            Axios.post(ApiUrl.baseurl+"get/mywallet",formD)
                .then(res=>{
                    console.log(res.data, decoded.user_id)
                })
                .catch(err=>{
                    this.setState({loading:false})
                })
            var walletdata = JSON.parse(localStorage.getItem("wallet"))
            if(walletdata){
                this.setState({wallet:walletdata,loading:false})
            }

            var formD1 = new FormData()
            formD1.append("token",token)
            Axios.post(ApiUrl.baseurl+"mybadge",formD1)
                .then(res=>{
                    this.setState({badge:res.data.badge})
                    localStorage.setItem("badge",res.data.badge)
                    console.log(res.data.badge)
                })
                .catch(err=>{
                    //
                })

        }else {
            this.props.history.push("/home")
        }
    }

    amount=(e)=>{
        this.setState({amount:e.target.value})
    }

    onName=(val)=>{
        this.setState({amount:"0"})
        this.state.wallet.filter((v)=>{
            if(v.coin_id==val){
                this.setState({name:v.coin_symbol,logo:v.logo,coin_id:v.coin_id
                })
            }
        })
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

    submit=()=>{
        var val = this.state
        if(val.amount==""){
            this.errorMsg("Amount is required")
        }
        if(val.coin_id==""){
            this.errorMsg("Coin is required")
        }
        if(parseFloat(val.amount)<1){
            this.errorMsg("Minimum amount is $1")
        }
        if(parseFloat(val.amount)>500){
            this.errorMsg("Maximum amount is $500")
        }
        if(val.amount!=="" && parseFloat(val.amount)>=1 && parseFloat(val.amount)<=500 && val.coin_id!==""){
            this.setState({loadsubmit:true})
            var formD = new FormData()
            formD.append("token",val.token)
            formD.append("amount",val.amount)
            formD.append("coin_id",val.coin_id)
            Axios.post(ApiUrl.baseurl+"addbadge",formD)
                .then(res=>{
                    if(res.data.error){
                        this.errorMsg(res.data.error)
                    }else{
                        this.successMsg(res.data.success)
                        this.componentDidMount()
                        setTimeout(()=>{
                            this.props.history.push("/")
                        },10000)
                    }
                    this.setState({loadsubmit:false})
                })
                .catch(err=>{
                    this.setState({loadsubmit:false})
                })
        }

    }



    render() {
        var val = this.state
        var trx = val.trx.map((res,idx)=>{
            var ids = idx+1
            console.log(ids)
            return(
                <div className="badge-table-row">
                        {ids==1?
                            <div className="badge-rank rank-1">
                              <img src="https://cdn-icons-png.flaticon.com/512/2583/2583344.png" alt="First Place"
                                 className="rank-badge"/>
                            </div>
                                :""}
                        {ids==2?
                            <div className="badge-rank rank-1">
                             <img src="https://cdn-icons-png.flaticon.com/512/2583/2583319.png"
                                 alt="Second Place" className="rank-badge"/>
                            </div>
                                :""}
                        {ids==3?
                            <div className="badge-rank rank-1">
                               <img src="https://cdn-icons-png.flaticon.com/512/2583/2583434.png" alt="Third Place"
                                 className="rank-badge"/>
                            </div>:""}
                    {
                        ids!==1 && ids!==2 && ids!==3?
                            <div className="badge-rank-bg">
                                {ids}
                            </div>
                            :""
                    }
                    <div>{res.address.substring(0,4)+".."+res.address.substring(res.address.length -2)}</div>
                    <div>${parseFloat(res.amount).toFixed(2)}</div>
                    <div>{parseFloat(res.xzeros).toFixed(2)}</div>
                </div>
            )
        })

        var coin = val.wallet.filter((v)=>{
            if(v.coin_symbol=="BNB"){
                return v
            }
        }).map(res=>{
            return(

                <div onClick={this.onName.bind(this,res.coin_id)}  style={{background:"transparent"}}
                     className={"select-mainnet-item"} data-dismiss="modal">
                    <img src={res.logo} alt=""/>
                    <span style={{color:"#00182C",marginLeft:"-5px"}}>{res.coin_name} </span>
                </div>
            )
        })

        return (
            <>
                <title>Premium Badge</title>

                <body className="badge-body">
                <div className="badge-container">
                    <div className="badge-header">
                        <Link to="/airdrop" className="badge-back">
                            <img src="/backbutton.png" alt="Back" className="badge-back-icon"/>
                        </Link>
                        <h1 className="badge-title text-center w-100">Badge</h1>
                    </div>

                    <div className="badge-icon-wrapper">
                        <img src="/bluebadge.png" alt="Badge Icon" className="badge-icon"/>
                    </div>

                    <div className="badge-content">
                        <h2 className="badge-heading">Claim Your<br/>Premium Badge</h2>
                        <p className="badge-description">Select How Much You Want To Spend And Earn XZeros, Which Will
                            Later Be Converted To Zero Tokens!</p>

                        {
                            val.badge=="No"?
                                <>

                                    <div className="modal fade show"   id="exampleModal" tabIndex="-1" role="dialog"
                                         aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header" style={{borderBottom:"none"}}>
                                                    <h5 className="modal-title"
                                                        id="exampleModalLabel" style={{fontSize:"16px"}}>Select Coin</h5>
                                                    <button type="button shadow-none"
                                                            style={{background:"transparent",border:"none",fontSize:"20px"}} className="close" data-dismiss="modal"
                                                            aria-label="Close">
                                                        <span style={{color:"#00182C!important"}} aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body" style={{textAlign:"left"}}>
                                                    {coin}
                                                    <br/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="badge-input-group">
                                        <label className="d-block text-center">Enter Amount ($1.20 - $500)</label>
                                        <div style={{border:"1px solid black",
                                            width:"100%",height:"45px",display:"flex",borderRadius:"10px",overflow:"hidden"}}>
                                            <p style={{padding:"7px",width:"30%",height:"40px",display:"flex",paddingLeft:"15px"}}
                                               data-toggle="modal"  data-target="#exampleModal" >
                                                <img style={{height:"25px",marginRight:"10px"}} src={val.logo}/>
                                                <span style={{marginTop:"2px",marginRight:"5px"}}>{val.name}</span>
                                                <i className="fas fa-caret-down" style={{marginTop:"8px"}}></i>
                                            </p>

                                            <input style={{width:"70%",height:"40px",border:"none",
                                                marginTop:"0px",outline:"none"}} type="number" className="badge-input text-center" onChange={this.amount}
                                                   id="amountInput" value={this.state.amount}
                                            />
                                        </div>
                                    </div>

                                    <div className="badge-xzeros">
                                        <span>XZeros You Will Receive:</span>
                                        {
                                            val.amount!==""?
                                                <span id="xzerosAmount">{(parseFloat(val.amount)*200).toFixed(2)}</span>:"0"
                                        }

                                    </div>

                                    <button disabled={val.loadsubmit} onClick={this.submit} className="badge-confirm-btn">
                                        {val.loadsubmit==true?"Submitting...":"Confirm Badge Claim"}</button>
                                </>:""
                        }

                    </div>

                    <div className="badge-leaderboard">
                        <div className="badge-leaderboard-header">
                            <img src="/badgecup.png" alt="Trophy" className="badge-trophy"/>
                                <h3>Premium Badge Leaderboard</h3>
                                <p>The Top Spenders Will Enjoy Exclusive Benefits!</p>
                        </div>

                        <div className="badge-table">
                            <div className="badge-table-header">
                                <div>Rank</div>
                                <div>User</div>
                                <div>Amount</div>
                                <div>XZeros</div>
                            </div>

                            {
                                this.state.loading==true?
                                    <div style={{textAlign:"center",marginTop:"50px"}}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    :""
                            }
                            {trx}


                        </div>
                    </div>
                </div>


                </body>


            </>
        );
    }
}

export default Badge;