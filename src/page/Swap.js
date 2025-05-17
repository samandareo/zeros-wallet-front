import React, {Component} from 'react';
import backbtn from "../images/Vector (2).svg"
import {Link} from "react-router-dom";
import swapicon from "../images/swap icon.svg"
import jwtDecode from "jwt-decode";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import {toast} from "react-toastify";
import RouteCheck from "../components/routeCheck";

class Swap extends Component {
    constructor() {
        super();
        this.state={
            tab:"swap",wallet:[],token:"",amount:"0",total:"0",loading:false,
            fromid:"9",fromlogo:"",fromname:"ETH",frombal:"0",fromprice:"0",
            toid:"14",tologo:"",toname:"ZPOINT",tobal:"0",toprice:"0",
            loading1:false,swap:[],
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            var decoded = jwtDecode(token)
            var walletdata = JSON.parse(localStorage.getItem("wallet"))
            if(walletdata){
                this.setState({wallet:walletdata})
                setTimeout(()=>{
                    this.getWallet()
                },200)
                walletdata.filter(res=>{
                    if(res.coin_symbol==this.state.fromname){
                        this.setState({fromid:res.coin_id,
                            fromlogo:res.logo,
                            fromname:res.coin_symbol,
                            frombal:res.balance,fromprice:res.price})
                    }
                })
                walletdata.filter(res=>{
                    if(res.coin_symbol==this.state.toname){
                        this.setState({toid:res.coin_id,
                            tologo:res.logo,
                            toname:res.coin_symbol,
                            tobal:res.balance,toprice:res.price})
                    }
                })

                Axios.post(ApiUrl.baseurl+"my/convert/"+decoded.user_id+"/1000")
                    .then(res=>{
                        console.log(res.data.data," Swap History")
                        this.setState({swap:res.data.data,loading:false})
                    })
                    .catch(err=>{
                        //
                    })

            }
        }else {
            this.props.history.push("/home")
        }
    }

    getWallet=()=>{
        var formD = new FormData()
        formD.append("token",this.state.token)
        Axios.post(ApiUrl.baseurl+"auth/mywallet",formD)
            .then(res=>{
                console.log(res.data.data)
                if (res.data.success){
                    if(res.data.data.length>0){
                        this.setState({wallet:res.data.data})
                        localStorage.setItem("wallet",JSON.stringify(res.data.data))
                        res.data.data.filter(res=>{
                            if(res.coin_symbol==this.state.fromname){
                                this.setState({fromid:res.coin_id,
                                    fromlogo:res.logo,
                                    fromname:res.coin_symbol,
                                    frombal:res.balance,fromprice:res.price})
                            }
                        })
                        res.data.data.filter(res=>{
                            if(res.coin_symbol==this.state.toname){
                                this.setState({toid:res.coin_id,
                                    tologo:res.logo,
                                    toname:res.coin_symbol,
                                    tobal:res.balance,toprice:res.price})
                            }
                        })
                    }
                }
            })
            .catch(err=>{
                this.getWallet()
            })

    }

    fromc=(val)=>{
        this.state.wallet.filter(res=>{
            if(res.coin_symbol==val){
                this.setState({fromid:res.coin_id,
                    fromlogo:res.logo,
                    fromname:res.coin_symbol,amount:"0",total:"0",
                    frombal:res.balance,fromprice:res.price})
            }
        })
    }
    toc=(val)=>{
        this.state.wallet.filter(res=>{
            if(res.coin_symbol==val){
                this.setState({toid:res.coin_id,
                    tologo:res.logo,
                    toname:res.coin_symbol,
                    tobal:res.balance,toprice:res.price})
            }
        })
    }

    movech=()=>{
        var val=this.state
        setTimeout(()=>{
            this.setState({
                toid:val.fromid,
                tologo:val.fromlogo,
                toname:val.fromname,
                tobal:val.frombal,toprice:val.fromprice})

            this.setState({
                fromid:val.toid,
                fromlogo:val.tologo,
                fromname:val.toname,
                frombal:val.tobal,fromprice:val.toprice})
        },40)
        setTimeout(()=>{
            this.calamount()
        },50)
    }
    maxb=()=>{
        this.setState({amount:this.state.frombal})
        setTimeout(()=>{
            this.calamount()
        },50)
    }
    amount=(e)=>{
        this.setState({amount:e.target.value})
        setTimeout(()=>{
            this.calamount()
        },50)
    }
    total=(e)=>{
        this.setState({total:e.target.value})
        var val = this.state
        setTimeout(()=>{
            var rate = (parseFloat(val.fromprice)/parseFloat(val.toprice)*1)
            var amount = (parseFloat(e.target.value)/rate)
            console.log("Rate : ",rate)
            console.log("Amount : ",amount)
            this.setState({amount:amount.toFixed(4)})
        },50)
    }
    calamount=()=>{
        var val = this.state
        var rate = (parseFloat(val.fromprice)/parseFloat(val.toprice)*parseFloat(val.amount)).toFixed(4)
        console.log(rate)
        console.log("Amount : ",val.amount)
        console.log("From Price : ",val.fromprice)
        console.log("To Price : ",val.toprice)
        this.setState({total:rate})
    }
    errorMsg=(val)=>{
        toast.error(val, {
            theme: "colored",
            position: "bottom-right",
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
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    }

    tab=(val)=>{
        this.setState({tab:val})
    }
    convertSubmit=()=>{
        var val = this.state
        var amount = val.amount
        var bal = val.frombal
        if(val.amount=="" || parseFloat(val.amount)==0){
            this.errorMsg("Amount is required")
        }

        if(parseFloat(amount)>parseFloat(bal)){
            this.errorMsg("Balance not enough")
        }
        if(parseFloat(amount)<=parseFloat(bal) && val.amount!=="" && parseFloat(val.amount)!==0 ){
            this.setState({loading1:true})
            var formd = new FormData()
            formd.append("token",val.token)
            formd.append("fromid",val.fromid)
            formd.append("toid",val.toid)
            formd.append("amount",val.amount)
            Axios.post(ApiUrl.baseurl+"convert",formd)
                .then(res=>{
                    if(res.data.success){
                        this.successMsg(res.data.success)
                        this.getWallet()
                    }else {
                        this.errorMsg(res.data.error)
                    }
                    this.setState({loading1:false})
                })
                .catch(err=>{
                    //console.log(err)
                    this.setState({loading1:false})
                })
        }
    }

    render() {
        var val=this.state
        var fromw = this.state.wallet.filter(res1=>{
            //console.log(res1)
            if(res1.swap=="1"){
                if(res1.coin_symbol!==val.toname){
                    return res1
                }
            }
        }).map(res=>{
            return(
            <div onClick={this.fromc.bind(this,res.coin_symbol)}  style={{background:"transparent"}}
                 className={"select-mainnet-item"} data-dismiss="modal">
                <img src={res.logo} alt=""/>
                <span style={{color:"#00182C",marginLeft:"-5px"}}>{res.coin_name} </span>
            </div>
            )
        })

        var tow = this.state.wallet.filter(res1=>{
            if(res1.swap=="1"){
                if(res1.coin_symbol!==val.fromname){
                    return res1
                }
            }
        }).map(res=>{
            return(
            <div onClick={this.toc.bind(this,res.coin_symbol)}  style={{background:"transparent"}}
                 className={"select-mainnet-item"} data-dismiss="modal">
                <img src={res.logo} alt=""/>
                <span style={{color:"#00182C",marginLeft:"-5px"}}>{res.coin_name} </span>
            </div>
            )
        })

        var swaph = val.swap.map(res=>{
            return(
                <div className="card staking-card text-white" style={{background:"transparent",
                    border:"none",borderBottom:"1px solid #075DFF",borderRadius:"0px"}}>
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="stake-info">
                                <div className="time-left" style={{color:"black"}}>From Amount</div>
                                <div className="time-left" style={{color:"black"}}>Rate</div>
                                <div className="time-left" style={{color:"black"}}>To Receive</div>
                                <div className="time-left" style={{color:"black"}}>Status</div>
                                <div className="time-left" style={{color:"black"}}>Date</div>
                            </div>
                            <div className="text-end">
                                <div className="time" style={{color:"black"}}>{parseFloat(res.amount).toFixed(4)} {res.fromname}</div>
                                <div className="time" style={{color:"black"}}>1 {res.fromname} {parseFloat(res.rate).toFixed(4)} {res.toname}</div>
                                <div className="time" style={{color:"black"}}>{parseFloat(res.rcoin).toFixed(4)} {res.toname}</div>
                                <div className="time text-success">Success</div>
                                <div className="time" style={{color:"black"}}>{res.created_at}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })

        return (
            <body class="bg-primary-dark" style={{background:"#D0E1F1"}}>
                <title>Swap Coin</title>
                <RouteCheck/>
                <div className="container-fluid swap px-3" style={{background:"#D0E1F1"}}>
                    <div className="wallet-header2" style={{marginLeft:"-20px",background:"#D0E1F1"}}>
                        <button className="back-btn" style={{border:"none",background:"transparent"}}>
                            <Link onClick={()=>this.props.history.go(-1)} to="#">
                                <img src={backbtn} alt="Back" width="30px"/>
                            </Link>
                        </button>
                        <h1 className="text-center mb-0 ">Swap</h1>
                        <button className="notification-btn">

                        </button>
                    </div>
                    <p className=" text-center mt-2 mb-0">
                        Swap ETH or ZERPOS POINT and recieve airdrop point while swaping
                    </p>

                    <br/><br/>
                    <div className="toggle-container mb-4">
                        <button onClick={this.tab.bind(this,"swap")}
                                className={val.tab=="swap"?"btn active shadow-none":"btn shadow-none"}>Swap</button>
                        <button onClick={this.tab.bind(this,"uswap")}
                                className={val.tab=="uswap"?"btn active shadow-none":"btn shadow-none"}>Your swap</button>
                    </div>

                    {val.tab=="uswap"?
                        <>
                            {swaph}

                        </>:""
                    }

                    {val.tab=="swap"?
                        <>
                            <div className="swap-card mt-2">
                                <h2 className="mb-4">Swap</h2>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>You pay {val.amount!==""?
                                            <span style={{marginTop:"-10px"}}>${(parseFloat(val.fromprice)*parseFloat(val.amount)).toFixed(4)}</span>:""
                                        }</span>
                                        <span>Balance: {parseFloat(val.frombal).toFixed(4)}</span>
                                    </div>

                                    <div className="modal fade show"   id="exampleModalfrom" tabIndex="-1" role="dialog"
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
                                                <div className="modal-body">
                                                    {fromw}
                                                    <br/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <input type="number" onChange={this.amount} value={val.amount} className="form-control shadow-none" placeholder="enter amount"/>
                                        <button className="btn btn-outline-secondary shadow-none d-flex" type="button"
                                                data-toggle="modal" data-target="#exampleModalfrom" >
                                            <img src={val.fromlogo} alt={val.fromname}
                                                 className="me-1" style={{marginTop:"2px"}} height="20px" width="20px"/>
                                            <p style={{padding:"0px",marginBottom:"0px",marginLeft:"2px",color:"black"}}>{val.fromname}</p>
                                            <i className="fas fa-caret-down" style={{marginTop:"6px",marginLeft:"2px"}}></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="text-center my-3">
                                    <button className="btn btn-swap">
                                        <button onClick={this.movech} style={{background:"transparent",border:"none"}}>
                                            <img src={swapicon} alt="" width="40px"/>
                                        </button>
                                    </button>
                                </div>

                                <div className="modal fade show"   id="exampleModalto" tabIndex="-1" role="dialog"
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
                                            <div className="modal-body">
                                                {tow}
                                                <br/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="input-group">
                                        <input onChange={this.total} value={val.total} type="number" className="form-control shadow-none" placeholder="enter amount"/>
                                        <button className="btn btn-outline-secondary shadow-none d-flex" type="button"
                                                data-toggle="modal" data-target="#exampleModalto" >
                                            <img src={val.tologo} style={{marginTop:"3px"}}
                                                 alt={val.toname} className="me-1" height="20px" width="20px"/>
                                            <p style={{padding:"0px",marginBottom:"0px",marginLeft:"2px",color:"black"}}>{val.toname}</p>
                                            <i className="fas fa-caret-down" style={{marginTop:"7px",marginLeft:"2px"}}></i>
                                        </button>
                                    </div>
                                </div>
                                {val.amount==="" || val.amount==="0" ? "":
                                    <p style={{textAlign:"center",marginTop:"25px"}}>
                                        1 {val.fromname} = {(parseFloat(val.fromprice)*1/parseFloat(val.toprice)).toFixed(4)} {val.toname}
                                    </p>
                                }

                                <div className="form-check mb-4">
                                    <input className="form-check-input shadow-none" checked={true} type="checkbox" id="terms"/>
                                    <label className="form-check-label" htmlFor="terms">
                                        I do accept the <Link to="/terms" className="text-primary">Terms And Condition</Link> of your
                                        site below.
                                    </label>
                                </div>

                                <button onClick={this.convertSubmit} disabled={val.loading1}
                                        className="btn btn-primary w-100 mb-4 shadow-none"
                                        style={{background:"#014E92",border:"1px solid #014E92"}}>
                                    {val.loading1==true?"Submitting...":"Swap"}
                                    </button>
                            </div>

                            <div className="swapping-policy  mt-4">
                                <h3>Swapping Policy:</h3>
                                <ol>
                                    <li>Minimum Swap Amount: The minimum amount required for a swap is $1.</li>
                                    <li>Points Earned:
                                        <ul>
                                            <li>Earn 30 points for every $1 swapped.</li>
                                            <li>Points will be credited to your account immediately after the successful swap.
                                            </li>
                                        </ul>
                                    </li>
                                    <li>Daily Limit:
                                        <ul>
                                            <li>Users can swap a maximum of $200 per day, earning up to 6000 points daily.</li>
                                        </ul>
                                    </li>
                                    <li>Eligibility: Only verified users are eligible to participate in the swapping program.
                                    </li>
                                    <li>Transaction Fees: Any applicable transaction fees will be displayed during the swap
                                        process.
                                    </li>
                                    <li>Policy Updates: Swapping rewards and policies are subject to revision based on platform
                                        updates and market conditions.
                                    </li>
                                    <li>Fraud Prevention: Any misuse or fraudulent activity will result in disqualification from
                                        the rewards program and potential account suspension.
                                    </li>
                                </ol>
                                <p>By participating in swapping, users agree to these terms. For more details, refer to our
                                    Swapping Terms & Conditions.</p>
                            </div>
                        </>:""
                    }

                </div>
            </body>
        );
    }
}

export default Swap;