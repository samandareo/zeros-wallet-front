import React, {Component} from 'react';
import backbtn from "../images/Vector (2).svg"
import arrow from "../images/arrows-rotate-solid-(1).png"
import {Link} from "react-router-dom";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import moment from "moment";
import loadinggif from "../images/loading.gif"
import jwtDecode from "jwt-decode";
import {toast} from "react-toastify";
import RouteCheck from "../components/routeCheck";



class AirdropTask extends Component {
    constructor({match}) {
        super();
        this.state={
            token:"",title:"",des:"",logo:"",coin_raw_id:"",count:"",end:"",telegram:"",
            telegram2:"",twitter:"",twitter2:"",facebook:"",website:"",status:"",reward:"",discord:"",
            created_at:"",id:match.params.id,loading:true,btn:true,myid:false,loading1:false,
            tcount:0,tdata:[],
            stelegram:"", stelegram2:"",stwitter:"",stwitter2:"",
            sfacebook:"",swebsite:"ok",sdiscord:"",
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        var myairdrop = JSON.parse(localStorage.getItem("myairdrop"))
        if(myairdrop){
            myairdrop.filter((v)=>{
                if(v.airdrop_id==this.state.id){
                    console.log("Completed")
                    this.setState({myid:true})
                }
            })
        }

        this.getTaskd()

        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            var decoded = jwtDecode(token)
            var uid = decoded.user_id
            console.log(uid)
            Axios.post(ApiUrl.baseurl+"/my-airdrop/"+uid+"/1000")
                .then(res=>{
                    console.log(res.data,"Data")
                    //this.setState({loading:false})
                    localStorage.setItem("myairdrop",JSON.stringify(res.data))
                    res.data.filter((v)=>{
                        if(v.airdrop_id==this.state.id){
                            console.log("Completed")
                            this.setState({myid:true})
                        }
                    })
                })
                .catch(err=>{
                    //
                })
        }else {
            this.props.history.push("/home")
        }
    }

    getTaskd=()=>{
        Axios.post(ApiUrl.baseurl+"airdrop/"+this.state.id)
            .then(res=>{
                var val =res.data[0]
                console.log(val,"Airdrop Task")
                if(val["status"]=="Closed"){
                    this.props.history.push("/earn")
                }
                this.setState({
                    title:val["title"],des:val["des"],logo:val["logo"],coin_raw_id:val["coin_raw_id"],count:val["count"],
                    end:val["end"],telegram:val["telegram"], telegram2:val["telegram2"],twitter:val["twitter"],discord:val["discord"],
                    twitter2:val["twitter2"],facebook:val["facebook"],website:val["website"],status:val["status"],reward:val["reward"],
                    created_at:val["created_at"],loading:false
                })
                if(val["telegram"]){
                    var count = this.state.tcount+1
                    this.setState({tcount:count})
                }
                if(val["telegram2"]){
                    var count = this.state.tcount+1
                    this.setState({tcount:count})
                }
                if(val["twitter"]){
                    var count = this.state.tcount+1
                    this.setState({tcount:count})
                }
                if(val["twitter2"]){
                    var count = this.state.tcount+1
                    this.setState({tcount:count})
                }
                if(val["facebook"]){
                    var count = this.state.tcount+1
                    this.setState({tcount:count})
                }
                if(val["website"]){
                    var count = this.state.tcount+1
                    this.setState({tcount:count})
                }
                if(val["discord"]){
                    var count = this.state.tcount+1
                    this.setState({tcount:count})
                }
                setTimeout(()=>{
                    //this.setState({btn:false})
                },60000)
            })
            .catch(err=>{
                //this.setState({loading:false})
                this.getTaskd()
            })
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

    stelegram=(e)=>{
        this.setState({stelegram:e.target.value})
    }
    stelegram2=(e)=>{
        this.setState({stelegram2:e.target.value})
    }
    stwitter=(e)=>{
        this.setState({stwitter:e.target.value})
    }
    stwitter2=(e)=>{
        this.setState({stwitter2:e.target.value})
    }
    sfacebook=(e)=>{
        this.setState({sfacebook:e.target.value})
    }
    sdiscord=(e)=>{
        this.setState({sdiscord:e.target.value})
    }


    submitData=()=>{
        var val = this.state
        var count=0
        if(val.stelegram){
             count +=1
        }
        if(val.stwitter2){
            count +=1
        }
        if(val.stwitter){
            count +=1
        }
        if(val.stwitter2){
            count +=1
        }
        if(val.sfacebook){
            count +=1
        }
        if(val.swebsite){
            count +=1
        }
        if(val.sdiscord){
            count +=1
        }
        console.log(count," Username Count")
        console.log(val.tcount," T Count")
        if(val.tcount==count){
            this.setState({loading1:true})
            var formD = new FormData()
            formD.append("token",val.token)
            formD.append("id",val.id)
            formD.append("telegram",val.stelegram)
            formD.append("telegram2",val.stelegram2)
            formD.append("twitter",val.stwitter)
            formD.append("twitter2",val.stwitter2)
            formD.append("facebook",val.sfacebook)
            formD.append("website",val.swebsite)
            formD.append("discord",val.sdiscord)
            Axios.post(ApiUrl.baseurl+"airdrop-join",formD)
                .then(res=>{
                    if(res.data.error){
                        this.errorMsg(res.data.error)
                    }else{
                        this.successMsg(res.data.success)
                        setTimeout(()=>{
                            this.props.history.push("/earn")
                        },1000)
                    }
                    this.setState({loading1:false})
                })
                .catch(err=>{
                    this.setState({loading1:false})
                })

        }else {
            this.errorMsg("Username or Link is required")
        }
    }


    tData=(val)=>{
        var data= this.state.tdata
        var check = data.find(res=>{
            if(val==res){
                return res
            }
        })
        if(check==undefined){
            data.push(val)
            setTimeout(()=>{
                this.setState({tdata:data})
                if(data.length==this.state.tcount){
                    this.setState({btn:false})
                }
            },20000)
        }else{
            console.log("Exit")
        }
        //console.log(check)


    }


    render() {
        var val=this.state
        console.log(val.tcount,"T Count")
        console.log(val.tdata.length,"Tdata")
        var telegram =val.tdata.find(res=>{
           return res==val.telegram? res: undefined
        })
        var telegram2 = val.tdata.find(res=>{
            return res==val.telegram2? res: undefined
        })
        var twitter = val.tdata.find(res=>{
            return res==val.twitter? res: undefined
        })
        var twitter2 = val.tdata.find(res=>{
            return res==val.twitter2? res: undefined
        })
        var facebook = val.tdata.find(res=>{
            return res==val.facebook? res: undefined
        })
        var website = val.tdata.find(res=>{
            return res==val.website? res: undefined
        })
        var discord = val.tdata.find(res=>{
            return res==val.discord? res: undefined
        })

        return (
            <>
                <RouteCheck/>
                <title>{val.title}</title>
                <div className="mobile-container task" style={{minHeight:"800px",height:"auto",background:"#D0E1F1"}}>
                    <div className="wallet-header" style={{background:"#D0E1F1"}}>
                        <Link onClick={()=>this.props.history.go(-1)} to="#" className="back-btn">
                            <img src={backbtn} alt="Back" width="30px"/>
                        </Link>
                        <h1 className="text-center mb-0" style={{color:"#000000"}}>Task</h1>
                        <button className="notification-btn">
                        </button>
                    </div>
                    {
                        this.state.loading==true?
                            <div style={{width:"100%",height:"100%",background:"white"}}>
                                <img style={{height:"250px",width:"100%",paddingTop:"50px"}} src={loadinggif}/>
                                <img style={{height:"250px",width:"100%"}} src={loadinggif}/>
                                <img style={{height:"250px",width:"100%",paddingBottom:"50px"}} src={loadinggif}/>
                            </div>:""
                    }
                    <div className="text-white p-4" style={{background:"#D0E1F1"}}>
                        <h1 className="mb-3 text-center" style={{color:"#000000"}}>{val.title}</h1>
                        <p className="date-range mb-3 text-center" style={{color:"#000000"}}>{moment(this.state.created_at).format(("YYYY-MM-DD HH:mm:ss"))} To {val.end}</p>
                        <p className="reward-desc mb-4 text-center" style={{color:"#000000"}}>{val.des}</p>
                        <h2 className="reward-amount mb-3" style={{color:"#000000"}}>Reward {val.reward}</h2>
                    </div>

                    <div style={{paddingLeft:"30px",paddingRight:"30px",display:"none"}}>
                        <p style={{textAlign:"center",color:"red"}}>
                            Please Follow and Join All Official Social Account, If you don't follow and join you will be disqualify for Airdrop,
                            We Will Check Manually
                        </p>
                    </div>

                    <div className="task-section p-3">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <h3 className="task-title" style={{color:"#226BAF",
                                borderBottom:"2px solid #226BAF",paddingBottom:"8px",width:"80px"}}>Task </h3>
                            <div className="text-end" style={{}}>
                                <div className="members mb-2" style={{color:"#000000",marginBottom:"-20px"}}>
                                    <svg width="16" height="16" fill="currentColor" className="me-1"
                                         viewBox="0 0 16 16">
                                        <path
                                            d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                    </svg>
                                    {val.count} members
                                </div>

                            </div>
                        </div>

                        <div className="task-items">
                            {
                                val.telegram?
                                    <div className="task-item mb-3" style={{borderTop:"1px solid #226BAF"}}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-0">Join Telegram Channel <br/>
                                                </p>
                                                <input style={{border:"none",borderRadius:"25px",width:"190px",
                                                    marginTop:"5px",padding:"7px 10px",display:val.myid==true?"none":"block"}}
                                                       onChange={this.stelegram} value={val.stelegram}
                                                       placeholder={"Telegram username "}/>
                                            </div>
                                            <div>
                                                <a onClick={this.tData.bind(this,val.telegram)} href={val.telegram}
                                                   target="_blank" className="btn shadow-none btn-primary">{
                                                    telegram==undefined && val.myid!==true?"Join Now": "Completed"
                                                }</a>
                                            </div>
                                        </div>
                                    </div>:""
                            }
                            {
                                val.telegram2?
                                    <div className="task-item mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-0">Join Telegram Group</p>
                                                <input style={{border:"none",borderRadius:"25px",width:"190px",
                                                    marginTop:"5px",padding:"7px 10px",display:val.myid==true?"none":"block"}}
                                                       onChange={this.stelegram2} value={val.stelegram2}
                                                       placeholder={"Telegram username "}/>
                                            </div>
                                            <div>
                                                <a onClick={this.tData.bind(this,val.telegram2)} href={val.telegram2}
                                                   target="_blank" className="btn shadow-none btn-primary">{
                                                    telegram2==undefined && val.myid!==true?"Join Now":"Completed"
                                                }</a>
                                            </div>
                                        </div>
                                    </div>:""
                            }
                            {
                                val.twitter?
                                    <div className="task-item mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-0">Follow Twitter</p>
                                                <input style={{border:"none",borderRadius:"25px",width:"190px",
                                                    marginTop:"5px",padding:"7px 10px",display:val.myid==true?"none":"block"}}
                                                       onChange={this.stwitter} value={val.stwitter}
                                                       placeholder={"Twitter username "}/>
                                            </div>
                                            <div>
                                                <a onClick={this.tData.bind(this,val.twitter)} href={val.twitter}
                                                   target="_blank" className="btn shadow-none btn-primary">{
                                                    twitter==undefined  && val.myid!==true?"Join Now":"Completed"
                                                }</a>
                                            </div>
                                        </div>
                                    </div>:""
                            }
                            {
                                val.twitter2?
                                    <div className="task-item mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-0">Like & retweet Twitter post</p>
                                                <input style={{border:"none",borderRadius:"25px",width:"190px",
                                                    marginTop:"5px",padding:"7px 10px",display:val.myid==true?"none":"block"}}
                                                       onChange={this.stwitter2} value={val.stwitter2}
                                                       placeholder={" Retweet Link "}/>
                                            </div>
                                            <div>
                                                <a  onClick={this.tData.bind(this,val.twitter2)} href={val.twitter2}
                                                    target="_blank" className="btn shadow-none btn-primary">{
                                                    twitter2==undefined && val.myid!==true?"Join Now":"Completed"
                                                }</a>
                                            </div>
                                        </div>
                                    </div>:""
                            }
                            {
                                val.discord?
                                    <div className="task-item mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-0">Discord</p>
                                                <input style={{border:"none",borderRadius:"25px",width:"190px",
                                                    marginTop:"5px",padding:"7px 10px",display:val.myid==true?"none":"block"}}
                                                       onChange={this.sdiscord} value={val.sdiscord}
                                                       placeholder={"Discord username "}/>
                                            </div>
                                            <div>
                                                <a  onClick={this.tData.bind(this,val.discord)} href={val.discord}
                                                    target="_blank" className="btn shadow-none btn-primary">{
                                                    discord==undefined && val.myid!==true?"Join Now":"Completed"
                                                }</a>
                                            </div>
                                        </div>
                                    </div>:""
                            }
                            {
                                val.facebook?
                                    <div className="task-item mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-0">Follow Facebook</p>
                                                <input style={{border:"none",borderRadius:"25px",width:"190px",
                                                    marginTop:"5px",padding:"7px 10px",display:val.myid==true?"none":"block"}}
                                                       onChange={this.sfacebook} value={val.sfacebook}
                                                       placeholder={"Facebook username "}/>
                                            </div>
                                            <div>
                                                <a  onClick={this.tData.bind(this,val.facebook)} href={val.facebook}
                                                    target="_blank" className="btn shadow-none btn-primary">{
                                                    facebook==undefined && val.myid!==true?"Join Now":"Completed"
                                                }</a>
                                            </div>
                                        </div>
                                    </div>:""
                            }
                            {
                                val.website?
                                    <div className="task-item mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p className="mb-0"> Website</p>
                                            <a onClick={this.tData.bind(this,val.website)} href={val.website} target="_blank"
                                               className="btn shadow-none btn-primary">{
                                                website==undefined && val.myid!==true?"Visit Now":"Completed"
                                            }</a>
                                        </div>
                                    </div>:""
                            }

                            <br/><br/>
                        </div>

                        <div className="incomplete-button-container">
                            {
                                val.loading1==true?
                                    <button
                                            className="btn btn-primary shadow-none btn-lg w-100">{val.btn==true?"Incomplete":"Submitting..."}</button>:
                                    <button disabled={val.btn==true || val.myid} onClick={this.submitData}
                                            className="btn btn-primary shadow-none btn-lg w-100">
                                        {val.btn==true || val.myid==true? val.myid==true?"Completed":"Incomplete":"Submit Now"}
                                    </button>
                            }
                        </div>
                        <br/>
                    </div>
                </div>
            </>
        );
    }
}

export default AirdropTask;