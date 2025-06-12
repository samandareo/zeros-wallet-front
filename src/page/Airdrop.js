import React, {Component} from 'react';
import Footer from "../components/Footer";
import backbtn from "../images/Vector (2).svg"
import wallet from "../images/airdropblue-wallet-01.png"
import stake from "../images/stake-white.png"
import swap from "../images/swap-blue.png"
import refer from "../images/refer icon-01.svg"
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import {Link} from "react-router-dom";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import jwtDecode from "jwt-decode";
import {toast} from "react-toastify";
import closebtn from "../images/close-button.png"
import blogo from "../images/3d-3.png"
import {TimeAgo} from "./Quiz";
import RouteCheck from "../components/routeCheck";

class Airdrop extends Component {
    constructor() {
        super();
        this.state={
            token:"",task:"",data:[],blog:[],signup:"0",
            tge:"2025-05-23 06:00:00.906655",
            d:"0",h:"0",m:"0",s:"0",badge:"", current_supply:0,
            news: "Zeros wallet Allocation Live now🎉 To Be Eligible For The Airdrop, You Must Complete All Mandatory Tasks, Before June 4"
        }
        this.interval=null
    }
    async componentDidMount() {
        window.scrollTo(0, 0);
        var badge = localStorage.getItem("badge")
        if(badge){
            this.setState({badge:badge})
        }

        var blog =await JSON.parse(localStorage.getItem("blog"))
        if(blog){
            await this.setState({blog:blog})
        }
        var signup =await localStorage.getItem("signup")
        if(signup){
            await this.setState({signup:signup})
        }
        Axios.post(ApiUrl.baseurl+"all-blog")
            .then(res=>{
                console.log(res.data)
                this.setState({blog:res.data})
                localStorage.setItem("blog",JSON.stringify(res.data))
            })
            .catch(err=>{
                //
            })

        var token =await localStorage.getItem("authtoken")
        if(token){
            var task =await localStorage.getItem("task")
            if(task){
               await this.setState({task:task})
            }
            var taskpay =await JSON.parse(localStorage.getItem("taskpay"))
            if(taskpay){
                await this.setState({data:taskpay})
            }
            await this.setState({token:token})
            var decoded = jwtDecode(token)
            setTimeout(()=>{
                this.gettrx()
            },100)


           await this.myCheck()

            var formD = new FormData()
            formD.append("id",decoded.user_id)
            Axios.post(ApiUrl.baseurl+"get/mywallet",formD)
                .then(res=>{
                   console.log(res.data, decoded.user_id)
                })
                .catch(err=>{
                    this.setState({loading:false})
                })

            this.interval = setInterval(()=>{
                this.countDown()
            },1000)

            var formD = new FormData()
            formD.append("token",token)
            Axios.post(ApiUrl.baseurl+"mybadge",formD)
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

        Axios.get(ApiUrl.baseurl+"taskup")
            .then(res=>{
                console.log(res)
            })
            .catch(err=>{
                //
            })

        Axios.get(ApiUrl.baseurl+"collectibles")
            .then(res=>{
                console.log(res.data.collectibles)
                this.setState({current_supply:res.data.collectibles[0].current_supply})
            })
            .catch(err=>{
                //
            })

    }

    myCheck=()=>{
        var formD2 = new FormData()
        formD2.append("token",this.state.token)
        Axios.post(ApiUrl.baseurl+"mytask",formD2)
            .then(res=>{
                console.log(res.data)
                this.setState({task:res.data.task})
                localStorage.setItem("task",res.data.task)
            })
            .catch(err=>{
                this.setState({loading:false})
                this.myCheck()
            })
    }

    gettrx=()=>{
        var formD2 = new FormData()
        formD2.append("token",this.state.token)
        Axios.post(ApiUrl.baseurl+"taskpay",formD2)
            .then(res=>{
                console.log(res.data,"Trx")
                if(res.data.success){
                    this.setState({data:res.data.data})
                    localStorage.setItem("taskpay",JSON.stringify(res.data.data))
                }
            })
            .catch(err=>{
                //this.setState({loading:false})
                this.gettrx()
            })
    }

    submitData=()=>{
        const source = Axios.CancelToken.source();
        const cancelToken = source.token;
        var val =this.state
        this.setState({loading:true})
        var formD = new FormData()
        formD.append("token",val.token)
        Axios.post(ApiUrl.baseurl+"task",formD)
            .then(res=>{
                if(res.data.error){
                    this.errorMsg(res.data.error)
                }else{
                    this.successMsg(res.data.success)
                    this.componentDidMount()
                }
                this.setState({loading:false})
            })
            .catch(err=>{
                this.setState({loading:false})
                if (Axios.isCancel(thrown)) {
                    // Handle the cancellation
                } else {
                    // Handle other errors
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

    countDown=()=>{
        var time = this.state.tge
        //console.log(time)
        var countDownDate = new Date(TimeAgo(time)).getTime();
        var now = new Date().getTime();
        if(countDownDate>now){
            var distance = countDownDate - now;
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            this.setState({d:days,h:hours,m:minutes,s:seconds})
        }
    }

    signup=()=>{
        this.setState({signup:"0"})
        localStorage.setItem("signup","0")
    }
    gotoWallet=()=>{
        this.setState({signup:"0"})
        localStorage.setItem("signup","0")
        this.props.history.push("/wallet")
    }
    componentWillUnmount(){
        //console.log(this.interval)
        try{
            clearInterval(this.interval)
            this.interval=null
        }catch(err){
            console.log(err)
        }
    }

    render() {
        var val =this.state
        var blog1=val.blog.filter((val)=>{
            if(val.type=="airdrop" || val.type=="both"){
                return val
            }
        })
        const settings = {
            dots: false,
            infinite: blog1.length>1?true:false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplaySpeed: 4000,
            autoplay: true,
            arrows: false,
        }

        var d = val.data.map(res=>{
            return(
                <span className="circle active">{res.amount}</span>
            )
        })

        var blog=val.blog.filter((val)=>{
            if(val.type=="airdrop" || val.type=="both"){
                return val
            }
        }).map(res=>{
            return(
                <div className="full-width-slide">
                    <Link to={res.route?"/"+res.route:"/blog/"+res.id}>
                        <img style={{height:"120px",width:"100%",borderRadius:"20px"}} src=
                            {res.img}
                             alt=""
                             className="slide-image" />
                    </Link>
                </div>
            )
        })

        console.log(this.state.task)

        return (



            <>
                <RouteCheck/>
                <title> Airdrop - Zeros Wallet </title>

                {this.state.signup=="1"?
                    <div style={{background:"#D0E1F1"}} className="mobile-container congrate min-vh-100 d-flex align-items-center justify-content-center">
                        <div className="popup-card">
                            <div className="close-button">
                                <a onClick={this.signup} href="#"><img src={closebtn} alt="" width="20px"/></a>
                            </div>
                            <div className="text-center p-4">
                                <img src={blogo} alt="Token" className="token-image mb-3"/>
                                    <h2 className="congratulation-text mb-3">Congratulation!</h2>
                                    <p className="earned-text mb-4">you just earned your first 3<br/>zeros token!</p>
                                    <a href="#"  onClick={this.signup} className="text-decoration-none skip-link mb-3 d-block">skip for now</a>
                                    <button onClick={this.gotoWallet} className="wallet-button">Go Wallet</button>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="mobile-container airdroppage" >
                        <div className="wallet-header2" style={{background:"#D0E1F1"}}>
                            <button className="back-btn">
                                <Link onClick={()=>this.props.history.go(-1)} to="#">
                                    <img src={backbtn} alt="Back" width="30px"/>
                                </Link>
                            </button>
                            <h1 className="text-center mb-0 ">Airdrop</h1>
                            <button className="notification-btn">

                            </button>
                        </div>

                        <div className="container px-3" style={{background:"#D0E1F1"}}>
                            <div className="card staking-card mb-3 " style={{background:"transparent",border:"none"}}>
                                <Slider {...settings}>
                                    {blog}
                                </Slider>
                            </div>

                            <p style={{background:"#7CC2FD",color:"black",fontSize:"18px",padding:"5px",display:"flex"}}>
                               <b style={{width:"75px"}}>News :</b>
                                <marquee
                                         direction="left" loop="">
                                    <span style={{color:"black",fontWeight:500}}>{this.state.news}</span>
                                </marquee>
                            </p>
                            <div className='d-flex justify-content-end align-items-center mb-3'>
                                {/* <h4 className=" mb-3">Daily Task</h4> */}
                                {/* added new code [link for nft page] */}
                                <span>
                                    <Link to="/mynft" className="text-decoration-underline font-bold d-inline-block" >My NFT</Link>
                                </span>
                            </div>
                            
                            {/* <div className="card task-card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center">
                                            <span style={{color:"#014E92"}}>Complete Daily Check In</span>
                                        </div>
                                        <button onClick={this.submitData}
                                                disabled={val.task=="Yes" || val.loading==true}
                                                className="btn btn-primary btn-sm">
                                            {val.loading==true?"Loading...":val.task=="Yes"?"Claimed":"Go"}
                                        </button>
                                        <button className='btn btn-primary btn-sm'
                                                onClick={() => toast.info(" Zeros airdrop ended!", {autoClose: 2000})}>
                                                Go
                                        </button>
                                    </div>
                                    <div className="progress-circles">
                                        <div>
                                        <span className={val.data.length==1 || val.data.length>1 ?"circle active":"circle"} style={{marginBottom:"5px"}}>
                                            <svg height={20} fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M173.9 439.4l-166.4-166.4c-10-10-10-26.2 0-36.2l36.2-36.2c10-10 26.2-10 36.2 0L192 312.7 432.1 72.6c10-10 26.2-10 36.2 0l36.2 36.2c10 10 10 26.2 0 36.2l-294.4 294.4c-10 10-26.2 10-36.2 0z"/>
                                            </svg>
                                        </span>
                                            <span className="text-black">100</span>
                                        </div>
                                        <div>
                                        <span className={val.data.length==2 || val.data.length>2 ?"circle active":"circle"} style={{marginBottom:"5px"}}>
                                            <svg height={20} fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M173.9 439.4l-166.4-166.4c-10-10-10-26.2 0-36.2l36.2-36.2c10-10 26.2-10 36.2 0L192 312.7 432.1 72.6c10-10 26.2-10 36.2 0l36.2 36.2c10 10 10 26.2 0 36.2l-294.4 294.4c-10 10-26.2 10-36.2 0z"/>
                                            </svg>
                                        </span>
                                            <span className="text-black">100</span>
                                        </div>
                                        <div>
                                        <span className={val.data.length==3 || val.data.length>3 ?"circle active":"circle"} style={{marginBottom:"5px"}}>
                                            <svg height={20} fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M173.9 439.4l-166.4-166.4c-10-10-10-26.2 0-36.2l36.2-36.2c10-10 26.2-10 36.2 0L192 312.7 432.1 72.6c10-10 26.2-10 36.2 0l36.2 36.2c10 10 10 26.2 0 36.2l-294.4 294.4c-10 10-26.2 10-36.2 0z"/>
                                           </svg>
                                        </span>
                                            <span className="text-black">100</span>
                                        </div>
                                        <div>
                                        <span className={val.data.length==4 || val.data.length>4 ?"circle active":"circle"} style={{marginBottom:"5px"}}>
                                            <svg height={20} fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M173.9 439.4l-166.4-166.4c-10-10-10-26.2 0-36.2l36.2-36.2c10-10 26.2-10 36.2 0L192 312.7 432.1 72.6c10-10 26.2-10 36.2 0l36.2 36.2c10 10 10 26.2 0 36.2l-294.4 294.4c-10 10-26.2 10-36.2 0z"/>
                                            </svg>
                                        </span>
                                            <span className="text-black">100</span>
                                        </div>
                                        <div>
                                        <span className={val.data.length==5 || val.data.length>5 ?"circle active":"circle"} style={{marginBottom:"5px"}}>
                                            <svg height={20} fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M173.9 439.4l-166.4-166.4c-10-10-10-26.2 0-36.2l36.2-36.2c10-10 26.2-10 36.2 0L192 312.7 432.1 72.6c10-10 26.2-10 36.2 0l36.2 36.2c10 10 10 26.2 0 36.2l-294.4 294.4c-10 10-26.2 10-36.2 0z"/>
                                            </svg>
                                        </span>
                                            <span className="text-black">100</span>
                                        </div>
                                        <div>
                                        <span className={val.data.length==6 || val.data.length>6 ?"circle active":"circle"} style={{marginBottom:"5px"}}>
                                            <svg height={20} fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M173.9 439.4l-166.4-166.4c-10-10-10-26.2 0-36.2l36.2-36.2c10-10 26.2-10 36.2 0L192 312.7 432.1 72.6c10-10 26.2-10 36.2 0l36.2 36.2c10 10 10 26.2 0 36.2l-294.4 294.4c-10 10-26.2 10-36.2 0z"/>
                                            </svg>
                                        </span>
                                            <span className="text-black">100</span>
                                        </div>
                                        <div>
                                        <span className={val.data.length==7 || val.data.length>7 ?"circle active":"circle"} style={{marginBottom:"5px"}}>
                                            <svg height={20} fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M173.9 439.4l-166.4-166.4c-10-10-10-26.2 0-36.2l36.2-36.2c10-10 26.2-10 36.2 0L192 312.7 432.1 72.6c10-10 26.2-10 36.2 0l36.2 36.2c10 10 10 26.2 0 36.2l-294.4 294.4c-10 10-26.2 10-36.2 0z"/>
                                            </svg>
                                        </span>
                                            <span className="text-black">1 Z</span>
                                        </div>
                                        {val.data.length==0?<>

                                        </>:""}
                                    </div>
                                </div>
                            </div> */}

                            
                            {/* WALLET */}
                            <div className="action-card mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="icon-box me-3" style={{marginLeft:"-5px"}}>
                                            <img src={wallet} alt="" width="40px"/>
                                        </div>
                                        <div style={{marginLeft:"-10px"}}>
                                            <h6 className="mb-1">Access Your Airdrop Wallet</h6>
                                            <p>Easily manage your rewards and track your earnings with your Airdrop
                                                Wallet.</p>
                                        </div>
                                    </div>
                                    <Link to="/wallet">
                                        <button className="btn btn-primary">Wallet</button>
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="action-card mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="icon-box me-3" style={{marginLeft:"-5px"}}>
                                            <img src="/bluebadge.png" alt="" width="40px"/>
                                        </div>
                                        <div style={{marginLeft:"-10px"}}>
                                            <h6 className="mb-1">Zeros Airdrop Premium Badge</h6>
                                            <p style={{color:"black",fontSize:"14px",marginBottom:"10px",marginTop:"10px"}}>
                                                More You Spend, More You Earn!
                                            </p>
                                            <p>
                                                Spend $0.5 - $500 to collect your Premium Badge
                                                Get eligible for a 20M Zeros Token Reward Pool.
                                                earn xZeros , later Converted into Zeros Tokens
                                            </p>
                                        </div>
                                    </div>
                                    <Link to="/badge">
                                        <button style={{marginTop:"-75px",width:"80px",paddingLeft:"3px",paddingRight:"3px"}}
                                                className="btn btn-primary">
                                            {val.badge=="Yes"?
                                            "Premium":"Get Now"}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            {/* added new card about 10.000 nft */}
                            <div className="action-card mb-3 p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="icon-box me-3" style={{marginLeft:"-5px"}}>
                                            <img src="/10004.jpg" alt="" style={{width:"40px", height:"40px", objectFit:"cover", borderRadius: "50%"}}/>
                                        </div>
                                        <div style={{marginLeft:"-10px"}}>
                                            <h6 style={{fontSize: "18px"}}>Zeros NFT Claim is Live!</h6>
                                        </div>
                                    </div>
                                    <div className='flex flex-column'>
                                        <Link to="/claim" className="d-inline-block">
                                            <button style={{width:"80px",paddingLeft:"3px",paddingRight:"3px"}}
                                                    className="btn btn-primary">
                                                Buy Now
                                            </button>
                                        </Link>

                                        {/* <div className='text-end mt-2  fw-semibold' style={{fontSize:"12px"}}>
                                            <p className='m-0'>NFT left</p>
                                            <p className='m-0'>{this.state.current_supply}</p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                    

                            {/* STAKE */}
                            {/* <div className="action-card mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="icon-box me-3">
                                            <img src={stake} alt="" style={{marginLeft:"-5px"}} width="40px"/>
                                        </div>
                                        <div style={{marginLeft:"-10px"}}>
                                            <h6 className="mb-1"> Stake in ZPoint Earn points</h6>
                                            <p>Don't miss out—stake now and reap the benefits!</p>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" onClick={()=> toast.info("Stake Airdrop has ended. This feature is no longer accessible.", {autoClose: 2000})}>Stake</button>
                                </div>
                            </div> */}

                            {/* SWAP */}
                            {/* <div className="action-card mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="icon-box me-3">
                                            <img src={swap} style={{marginLeft:"-5px"}} alt="" width="40px"/>
                                        </div>
                                        <div style={{marginLeft:"-10px"}}>
                                            <h6 className="mb-1">Swap eth to ZPoint.</h6>
                                            <p style={{marginBottom: 0}}>Swap eth to ZPoint</p>
                                        </div>
                                    </div>
                                    <Link to="/swap">
                                        <button className="btn btn-primary">Swap</button>
                                    </Link>
                                </div>
                            </div> */}

                            {/* REFER */}
                            {/* <div className="action-card mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="icon-box me-3">
                                            <img style={{marginLeft:"-5px"}} src={refer} alt="" width="40px"/>
                                        </div>
                                        <div style={{marginLeft:"-10px"}}>
                                            <h6 className="mb-1">Get 20 Points Instantly + 7% Commission on every
                                                Referral!</h6>
                                            <p>Get an instant 20 Points bonus and earn a 7% commission for every
                                                successful referral!</p>
                                        </div>
                                    </div>
                                    <Link to="/refer">
                                        <button style={{marginTop:"-50px"}} className="btn btn-primary">Go</button>
                                    </Link>
                                </div>
                            </div> */}

                        </div>
                        <br/><br/><br/>
                    </div>
                }

                <Footer/>
            </>
        );
    }
};

export default Airdrop;