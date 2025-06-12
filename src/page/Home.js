import React,{Component,Fragment} from "react";
import Footer from "../components/Footer";
import Carousel from 'better-react-carousel'
import {Link} from "react-router-dom";
import jwtDecode from "jwt-decode";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import zeroslogo from "../images/zeros-wallet-text.png"
import sendicon from "../images/send-icon.png"
import receiveicon from "../images/receive-icon.png"
import earnwhite from "../images/earnwhite.png"
import historyicon from "../images/historyicon.png"
import rocket from "../images/rocket.png"
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import cryptoBalanceCheck from "../components/cryptoBalanceCheck";
import RouteCheck from "../components/routeCheck";

import SplashNotification from '../components/SplashNotification';
import PopupNotification from '../components/PopupNotification';
import { toast } from "react-toastify";

class Home extends Component {


    constructor() {
        super();
        this.state={
            token:"",blog:[],coin:[],infounseen:[],info:[],dwallet:[],name:"",
            hide:"no",backup:false,loading:true,badge:"", splash:null,popup:null,
            showSplash:false, sequence: 0,
            popupQueue: [], // Add this to store all popup notifications
            currentPopupIndex: 0 // Add this to track current popup
        }
        this.interval=null
    }

    componentDidMount() {

        window.scrollTo(0, 0);
        var coin = JSON.parse(localStorage.getItem("coin"))
        if(coin){
            this.setState({coin:coin,loading:false})
            setTimeout(()=>{
                this.setWalletToCoin()
            },100)
        }
        var hide = localStorage.getItem("hide")
        if(hide){
            this.setState({hide:hide})
        }
        var badge = localStorage.getItem("badge")
        if(badge){
            this.setState({badge:badge})
        }
        var backup = localStorage.getItem("backup")
        if(backup){
            this.setState({backup:backup})
        }
        var dwallet = JSON.parse(localStorage.getItem("dwallet"))
        if(dwallet){
            this.setState({dwallet:dwallet})
        }
        var blog = JSON.parse(localStorage.getItem("blog"))
        if(blog){
             this.setState({blog:blog})
        }
        var infounseen = JSON.parse(localStorage.getItem("infounseen"))
        if(infounseen){
            this.setState({infounseen:infounseen})
        }
        var info = JSON.parse(localStorage.getItem("info"))
        if(info){
            this.setState({info:info})
        }
        Axios.get(ApiUrl.baseurl + "notifications")
        .then(res => {
          if (res.data.error) {
            this.setState({ splash: null, popup: null, popupQueue: [] });
            return;
          }
      
          const data = res.data.notifications;
      
          let splash = null;
          let popupNotifications = [];
      
          data.forEach(notification => {
            if (notification.type === "splash" && notification.is_active === 1) {
              splash = notification;
            } else if (notification.type === "popup" && notification.is_active === 1) {
              popupNotifications.push(notification);
            }
          });

          // Sort popup notifications by seq_order
          popupNotifications.sort((a, b) => (a.seq_order || 0) - (b.seq_order || 0));
      
          const splashSeen = sessionStorage.getItem("splashSeen") === "true";
          if (splash && !splashSeen) {
            this.setState({ splash, showSplash: true });
            sessionStorage.setItem("splashSeen", "true");
          }

          // Store popup queue and show the next popup in sequence
          this.setState({ popupQueue: popupNotifications }, () => {
            this.showSequentialPopup(splash && !splashSeen);
          });
        })
        .catch(err => {
          console.error("Error fetching notifications:", err);
        });
      
        Axios.post(ApiUrl.baseurl+"all-info")
            .then(res=>{
                //console.log(res.data,"All Info")
                if(res.data.error){
                    this.setState({infounseen:[]})
                    //localStorage.removeItem("info")
                }else{
                    this.setState({infounseen:res.data})
                    localStorage.setItem("infounseen",JSON.stringify(res.data))
                }
            })
            .catch(err=>{
                //
            })
        Axios.post(ApiUrl.baseurl+"all-coin")
            .then(res=>{
                //console.log(res.data,"D Coin")
                this.setState({coin:res.data,loading:false})
                localStorage.setItem("coin",JSON.stringify(res.data))
                setTimeout(()=>{
                    this.setWalletToCoin()
                },100)
            })
            .catch(err=>{
                //
            })

        Axios.post(ApiUrl.baseurl+"all-blog")
            .then(res=>{
                console.log(res.data)
                this.setState({blog:res.data})
                localStorage.setItem("blog",JSON.stringify(res.data))
            })
            .catch(err=>{
                //
            })

        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            var formDd = new FormData()
            formDd.append("token",token)
            Axios.post(ApiUrl.baseurl+"auth/deposit",formDd)
                .then(res=>{
                    console.log(res.data)
                })
                .catch(err=>{
                    //
                })

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
            this.interval= setInterval(()=>{
                this.balance()
            },30000)

            Axios.get(ApiUrl.baseurl+"taskup")
                .then(res=>{
                    console.log(res)
                })
                .catch(err=>{
                    //
                })

        }else {
            this.props.history.push("/home")
        }

        Axios.post(ApiUrl.baseurl+"coin-price")
            .then(res=>{
                console.log(res.data,"Price Call")
            })
            .catch(err=>{
                //
            })
        setTimeout(()=>{
            this.balance()
        },5000)

    }

    handleSplashComplete = () => {
        this.setState({ showSplash: false });
    };
    
    showSequentialPopup = (delaySplash = false) => {
        const { popupQueue } = this.state;
        
        if (popupQueue.length === 0) {
          return; // No popups to show
        }

        // Check if popup was already shown in this session
        const popupShownThisSession = sessionStorage.getItem("popupShownThisSession");
        if (popupShownThisSession === "true") {
          return; // Don't show popup if already shown in this session
        }

        // Get the current popup sequence from localStorage
        let currentSequence = parseInt(localStorage.getItem("popupSequence") || "0");
        
        // Calculate which popup to show (cycle through available popups)
        const popupIndex = currentSequence % popupQueue.length;
        const currentPopup = popupQueue[popupIndex];
        
        // Increment sequence for next login
        localStorage.setItem("popupSequence", (currentSequence + 1).toString());
        
        // Mark that popup will be shown in this session
        sessionStorage.setItem("popupShownThisSession", "true");

        const delay = delaySplash ? 1000 : 0;
        setTimeout(() => {
          this.setState({ popup: currentPopup });
        }, delay);
    };

    handlePopupClose = () => {
        this.setState({ popup: null });
        // Popup is already marked as shown for this session
    };

    setWalletToCoin=()=>{
        this.state.coin.filter((res)=>{
           const {dwallet,coin} = this.state
           const data= [{
               coin_name:res.coin_name,coin_symbol:res.coin_symbol,coin_decimal:res.coin_decimal,
               coin_type:res.coin_type,contract:res.contract,explorer:res.explorer,logo:res.logo,
               platform:res.platform,id:res.id,price:res.price,day_change:res.day_change,
               status:res.status,bal:"0"
           }]

           var check = dwallet.find((item)=>{
               return res.id == item.id
           })
            if(check==null || check==undefined){
                this.setState({dwallet:[...dwallet,...data]})
            }
            if(check){
                dwallet.forEach(item=>{
                    if(res.id==item.id){
                        item.price=res.price;
                        item.day_change=res.day_change;
                        item.contract=res.contract;
                        item.coin_symbol=res.coin_symbol;
                        item.coin_name=res.coin_name;
                        item.logo=res.logo;
                        console.log(item.coin_name)
                    }
                })
                setTimeout(()=>{
                    this.setState({dwallet:dwallet})
                },500)
                console.log("Updated find value")
            }

        })

        //console.log(this.state.dwallet)
        setTimeout(()=>{
            this.saveWallet()
        },1000)
    }

    balance=async ()=>{
        var {dwallet} = this.state
        if(dwallet){
            await dwallet.forEach(res=>{
                cryptoBalanceCheck(res.coin_symbol,res.platform, res.coin_type,res.contract,res.coin_decimal,res.rpc,res.chain)
                    .then(rs=>{
                       console.log(rs)
                        res.bal=rs.balance;
                    })
                    .catch(err=>{
                       console.log(err)
                    })
            })

            await  this.setState({dwallet:dwallet})
            //await this.saveWallet()
           await setTimeout(async ()=>{
                await localStorage.setItem("dwallet",JSON.stringify(this.state.dwallet))
                //await console.log("Wallet Saved with new Balance  ",dwallet)
            },100)

        }
    }


    saveWallet=()=>{
        localStorage.setItem("dwallet",JSON.stringify(this.state.dwallet))
        console.log("Wallet Saved Localstorage ")
    }

    name=(e)=>{
        this.setState({name:e.target.value})
    }

    hide=()=>{
        if(this.state.hide=="no"){
            this.setState({hide:"yes"})
            localStorage.setItem("hide","yes")
        }else{
            this.setState({hide:"no"})
            localStorage.setItem("hide","no")
        }
    }

    componentWillUnmount(){
        try{
            clearInterval(this.interval)
            this.interval=null
            console.log("clear interval Home D wallet")
        }catch(err){
            console.log(err)
        }
    }
    render() {
        var val = this.state
        var blog1=val.blog.filter((val)=>{
            if(val.type=="Home" || val.type=="both"){
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
        var blog=val.blog.filter((val)=>{
            if(val.type=="Home" || val.type=="both"){
                return val
            }
        }).map(res=>{
            return(
                <div className="full-width-slide">
                    <Link to={res.route?"/"+res.route:"/blog/"+res.id}>
                        <img style={{height:"100px",width:"100%",borderRadius:"15px",marginBottom:"15px"}} src=
                            {res.img}
                             alt=""
                             className="" />
                    </Link>
                </div>
            )
        })

        //console.log(val.infounseen.length,"Info Unseen")
        //console.log(val.info.length,"Info seen")

        var infocount =val.infounseen.length- val.info.length
        console.log(infocount,"info Count")
        var usd=0
        var dwall = val.dwallet.sort(function(a, b){return b.bal-a.bal});
        var wallet = dwall.filter((v)=>{
            if(v.status=="1"){
                if(this.state.name==""){
                    return v
                }else if(v.coin_symbol.toLowerCase().includes(this.state.name.toLowerCase())){
                    return v
                }
            }
        }).map(res=>{
            //console.log(res.logo)
            var value =(parseFloat(res.bal)*parseFloat(res.price))
            usd+=value
            var bal=parseFloat(res.bal)
            var ch = parseFloat(res.day_change)
            var price =parseFloat(res.price)
            var bbb = parseFloat(res.bal)*parseFloat(res.price)

            return(
                <Link to={"/coindetails/"+res.id}>
                    <div className="crypto-item">
                        <div className="crypto-info">
                            <div className="crypto-icon">
                                {res.logo?
                                    <img src={res.logo} alt="" width="100px"
                                         height="30px"/>:
                                ""}
                            </div>
                            <div>
                                <div className="crypto-name">{res.coin_symbol} <span
                                    style={{fontSize:"10px",background:"#ffffff",padding:"2px 5px",borderRadius:"10px"}}>{res.platform=="Binance"?"BSC Smart ":res.platform} Chain</span>
                                </div>
                                <div className="crypto-balance">{price.toFixed(price>1?2:price>0.00001?5:price==0?0:8)}$ <span style={{fontSize:"12px"}}
                                    className={ch>0?"crypto-price-change":ch=="0"?
                                        "crypto-price-change text-black":"crypto-price-change negative"}>
                                    {parseFloat(res.day_change)>0?"+"+res.day_change:res.day_change} % </span></div>
                            </div>
                        </div>
                        <div className="crypto-price">
                            <div className="crypto-price-usd fw-bold">
                                {val.hide=="yes"?"****":bal.toFixed(bal>0?bal<1?8:4:0)}
                            </div>
                            <div className="crypto-price-usd">
                                {val.hide=="yes"?"****":(parseFloat(res.bal)*parseFloat(res.price)).toFixed(bbb>1?2:bbb>0.00001?5:bbb==0?2:8)}$</div>
                        </div>
                    </div>
                </Link>

            )
        })

        const {showSplash, splash, popup} = this.state;
        const {handlePopupClose, handleSplashComplete} = this;
        console.log("Splash",splash)
        return (
            <Fragment>
                <title>Zeros Wallet - Dashboard </title>
                <RouteCheck/>
                <div className="hometop">
                    <div className="header home" style={{paddingTop:"10px"}}>
                        <Link to="/" className="logo">
                            <img src={zeroslogo} alt="" width="150px" height="47px"/>
                            {
                                this.state.badge=="Yes"?
                                    <img src="/bluebadge.png" alt="" style={{marginLeft:"-10px"}} width="auto" height="35px"/>:""
                            }
                            <div>

                            </div>
                        </Link>
                        <div className="header-icons">
                            <button className="icon-button">
                                {infocount>0?
                                    <span className="infob">{infocount}</span>:""
                                }
                                <Link to="/notification">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                         fill="none" stroke="#004c94" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round">
                                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                                    </svg>
                                </Link>
                            </button>
                            <button className="icon-button">
                                <Link to="/settings">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                         fill="none" stroke="#004c94" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="3"/>
                                        <path
                                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                                    </svg>
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="container-fluid wallet-container">
                {showSplash && splash && (
                    <SplashNotification data={splash} onComplete={handleSplashComplete} />
                )}
                {popup && (
                    <PopupNotification data={popup} onClose={handlePopupClose} />
                )}
                    <div className="hearder2" style={{height:"70px"}}></div>
                    <div className="wallet-card">
                        <div className="wallet-headerhome" style={{marginBottom:"0px"}}>
                            <span style={{fontSize:"18px"}}>Main Wallet</span>
                            {
                                val.backup==false?
                                    <div className="backup-badge">
                                        <Link to="/backup">! Backup</Link>

                                    </div>:""
                            }
                            <button onClick={this.hide} style={{background:"transparent",border:"none",color:"white"}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                     stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                        </div>
                        <div>Total Balance :</div>
                        <div className="balance-amount" style={{marginBottom:"0px",margin:"0px"}}>${val.hide=="yes"?"****":usd.toFixed(2)}</div>
                    </div>

                    <div className="action-grid" style={{padding:"0px 20px",paddingTop:"10px"}}>
                        <div style={{textAlign:"center"}}>
                            <Link to="/sendlist" className="action-item">
                                <img src={sendicon} alt="" width="30px" height="30px"/>
                            </Link>
                            <div style={{color:"#07335B",marginTop:"10px"}}>Send</div>
                        </div>
                        <div style={{textAlign:"center"}}>
                            <Link to="/receivelist" className="action-item">
                                <img src={receiveicon} alt="" width="30px" height="30px"/>
                            </Link>
                            <div style={{color:"#07335B",marginTop:"10px"}}>Receive</div>
                        </div>
                        <div style={{textAlign:"center"}}>
                            <Link to="/earn" className="action-item">
                                <img src={earnwhite} alt="" width="30px" height="30px"/>
                            </Link>
                            <div style={{color:"#07335B",marginTop:"10px"}}>Earn</div>
                        </div>
                        <div style={{textAlign:"center"}}>
                            <Link to="/allhistory" className="action-item">
                                <img src={historyicon} alt="" width="30px" height="30px"/>
                            </Link>
                            <div style={{color:"#07335B",marginTop:"10px"}}>History</div>
                        </div>


                    </div>



                    <Slider {...settings}>
                        {blog}
                    </Slider>

                   <div style={{padding:"0px 20px"}}>
                       <input type="text" onChange={this.name} value={val.name} className="search-input" placeholder="search"/>
                       <button style={{cursor:"not-allowed",
                           color:"#282727",textAlign:"center",
                           width:"150px"
                       }} className="crypto">Crypto Wallet</button>
                   </div>


                    <div className="crypto-list">
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
                        {wallet}

                    </div>

                    <div className="crypto-section">
                        <div className="manage-crypto-container">
                            <Link style={{textDecoration:"none"}} to="/manage"
                                  className="manage-crypto-button">Manage Crypto</Link>
                        </div>
                    </div>

                    <br/><br/>

                </div>

                <Footer/>
            </Fragment>
          );
    }
}


export default Home;
