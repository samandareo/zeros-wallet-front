import React, {Component} from 'react';
import Footer from "../components/Footer";
import backbtn from "../images/Vector (2).svg"
import airdropearn from "../images/19100E3D.png"
import {Link} from "react-router-dom";
import ApiUrl from "../AppUrl/ApiUrl";
import Axios from "axios";
import loadinggif from "../images/loading.gif"
import jwtDecode from "jwt-decode";
import RouteCheck from "../components/routeCheck";


class Earn extends Component {
    constructor() {
        super();
        this.state={
            token:"",tab:"ongoing",data:[],loading:true,myairdrop:[]
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);


        var airdrop = JSON.parse(localStorage.getItem("airdrop"))
        if(airdrop){
             this.setState({data:airdrop})
            this.setState({loading:false})
        }
        var myairdrop = JSON.parse(localStorage.getItem("myairdrop"))
        if(myairdrop){
            this.setState({myairdrop:myairdrop})
        }
        this.allAirdrop()

        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
            setTimeout(()=>{
                this.getAirdrop()
            },100)
        }else {
            this.props.history.push("/home")
        }
    }

    allAirdrop=()=>{
        Axios.post(ApiUrl.baseurl+"all-airdrop")
            .then(res=>{
                console.log(res.data,"Airdrop")
                this.setState({data:res.data})
                localStorage.setItem("airdrop",JSON.stringify(res.data))
                this.setState({loading:false})
            })
            .catch(err=>{
                //this.setState({loading:false})
                this.allAirdrop()
            })
    }

    getAirdrop=()=>{
        var decoded = jwtDecode(this.state.token)
        var uid = decoded.user_id
        console.log(uid)
        Axios.post(ApiUrl.baseurl+"/my-airdrop/"+uid+"/1000")
            .then(res=>{
                console.log(res.data,"My Data")
                this.setState({myairdrop:res.data})
                localStorage.setItem("myairdrop",JSON.stringify(res.data))
            })
            .catch(err=>{
                //
            })
    }

    tab=(val)=>{
        this.setState({tab:val})
    }

    render() {
        var val=this.state
        var ongoing = val.data.filter((v)=>{
            if(v.status=="Ongoing"){
                return v
            }
        }).map(res=>{
            var my = false
            val.myairdrop.map(v=>{
                if(res.id==v.airdrop_id){
                    my=true
                }
            })
            return(
                <div className="card mb-3">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div style={{width:"70%"}}>
                            <h5 className="card-title">{res.title}</h5>
                            <p className="card-text mb-1 mt-3">{res.des.substring(0,45)}...</p>
                            <p style={{background:"#D0E1F1",
                                borderRadius:"15px",padding:"5px",
                                textAlign:"center",width:"170px",
                                fontSize:"15px"
                            }}
                               className="card-text text-dark pool-text mt-2">{res.reward} Airdrop Pool</p>
                        </div>
                        <div style={{width:"30%",textAlign:"right"}}>
                            <img style={{height:"50px"}} src={res.logo}/>
                            <Link to={"/task/"+res.id} className="btn btn-primary join-now-btn mt-3">
                                {my==true ?"Completed":"Join Now"}
                            </Link>
                        </div>

                    </div>
                </div>
            )
        })

        var ended = val.data.filter((v)=>{
            if(v.status=="Closed"){
                return v
            }
        }).map(res=>{
            var my = false
            val.myairdrop.map(v=>{
                if(res.id==v.airdrop_id){
                    my=true
                }
            })
            return(
                <div className="card mb-3">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div style={{width:"70%"}}>
                            <h5 className="card-title">{res.title}</h5>
                            <p className="card-text mb-1">{res.des.substring(0,45)}...</p>
                            <p style={{
                                background:"#D0E1F1",
                                borderRadius:"15px",padding:"5px",
                                textAlign:"center",width:"170px",
                                fontSize:"15px"
                            }} className="card-text text-dark pool-text">{res.reward} Airdrop Pool</p>
                        </div>
                        <div style={{width:"30%",textAlign:"right"}}>
                            <img style={{height:"50px",width:"50px"}} src={res.logo}/>
                            <Link to="#"  className="btn btn-primary join-now-btn mt-5">
                                {my==true ?"Completed":"Join Now"}
                            </Link>
                        </div>

                    </div>
                </div>
            )
        })

        return (
            <>
                <title>Earn - Zeros Wallet </title>
                <RouteCheck/>
                <div className="mobile-container earn" style={{background:"#D0E1F1"}}>
                    <div className="wallet-headerearn" style={{background:"#D0E1F1"}}>
                        <button className="back-btn">
                            <Link onClick={()=>this.props.history.go(-1)} to="#">
                                <img src={backbtn} alt="Back" width="30px"/>
                            </Link>
                        </button>
                        <h1 className="text-center mb-0 " style={{color:"#191b1c"}}>Earn</h1>
                        <button className="notification-btn">

                        </button>
                    </div>

                    <div className="main-content px-4 py-3">
                        <div className="parachute-section text-center mb-4">
                            <p className=" mt-3" style={{color:"#000000"}}>The rewards for each airdrop will be distributed to the
                                airdrop wallet.</p>
                            <img src={airdropearn} alt="" width="100px"/>
                        </div>

                        <div style={{display:"flex",marginBottom:"10px"}}>
                            <h5 onClick={this.tab.bind(this,"ongoing")} className="mb-3"
                                style={{borderBottom:val.tab=="ongoing"?"2px solid #2D6FEF":"",width:"100px",
                                    paddingBottom:"10px",marginRight:"10px",
                                    color:val.tab=="ongoing"?"#2D6FEF":"#191b1c"}}>Ongoing</h5>
                            <h5 onClick={this.tab.bind(this,"ended")} className="mb-3"
                                style={{borderBottom:val.tab=="ended"?"2px solid #2D6FEF":"",width:"100px",
                                    paddingBottom:"10px",color:val.tab=="ended"?"#2D6FEF":"#191b1c"}}>Ended</h5>
                        </div>

                        <div className="airdrop-cards">

                            {
                                this.state.loading==true?
                                    <div style={{width:"100%",height:"100%",background:"white"}}>
                                        <img style={{height:"250px",width:"100%",paddingTop:"50px"}} src={loadinggif}/>
                                        <img style={{height:"250px",width:"100%"}} src={loadinggif}/>
                                        <img style={{height:"250px",width:"100%",paddingBottom:"50px"}} src={loadinggif}/>
                                    </div>:""
                            }
                            {val.tab=="ongoing"?ongoing:""}
                            {val.tab=="ended"?ended:""}


                        </div>
                    </div>
                    <br/><br/><br/><br/><br/><br/>
                </div>

                <Footer/>
            </>
        );
    }
}

export default Earn;