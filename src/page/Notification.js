import React, {Component} from 'react';
import airdropearn from "../images/19100E3D.png";
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png"
import announce from "../images/announce-icon-01.png"
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import ReactHtmlParser from "react-html-parser";
import moment from "moment";
import addNotification from 'react-push-notification';
import { Notifications } from 'react-push-notification';
import RouteCheck from "../components/routeCheck";

class Notification extends Component {
    constructor() {
        super();
        this.state={
            tab:"all",token:"",data:[],loading:true
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var info = JSON.parse(localStorage.getItem("info"))
        if(info){
            this.setState({data:info,loading:false})
        }
        var token = localStorage.getItem("authtoken")
        if(token){
            this.setState({token:token})
        }else {
            this.props.history.push("/home")
        }
        Axios.post(ApiUrl.baseurl+"all-info")
            .then(res=>{
                console.log(res.data,"All Info")
                if(res.data.error){
                    this.setState({data:[],loading:false})
                    localStorage.removeItem("info")
                }else{
                    this.setState({data:res.data,loading:false})
                    localStorage.setItem("info",JSON.stringify(res.data))
                }
            })
            .catch(err=>{
                //
            })
    }
    tab=(val)=>{
        this.setState({tab:val})
    }

    setNoti=()=>{
        addNotification({
            title: "Success",
            subtitle: "You have successfully submitted",
            message: "Welcome to GeeksforGeeks",
            theme: "light",
            closeButton: "X",
            backgroundTop: "green",
            backgroundBottom: "yellowgreen",
            native: true,
            icon:"/zeros-wallet.png",
            duration:3000
        })
    }

    render() {
        var val = this.state
        var info = val.data.map(res=>{
            return(
                <Link to={res.route?res.route:"/info/"+res.id} style={{textDecoration:"none"}}>
                    <div onClick={this.setNoti} className="notification-item d-flex p-3" style={{borderBottom:"1px solid white"}}>
                        <div className="notification-icon">
                            <img src={announce} width="30px"/>
                        </div>
                        <div className="notification-content ms-3">
                            <p className="notification-text mb-1">{ReactHtmlParser(res.des.substring(0,110)+"...")}</p>
                            <small className="notification-date text-muted">{moment(res.created_at).format('L')}</small>
                        </div>
                    </div>
                </Link>
            )
        })
        return (
            <>
                <title>Notification - Zeros Wallet </title>
                <RouteCheck/>
                <div className=" p-0" style={{boxShadow:"0 0px 0px",background:"#D0E2F1",minHeight:"800px",height:"auto"}}>
                    <div className="header p-3">
                        <Link onClick={()=>this.props.history.go(-1)} to="#" className="back-button text-decoration-none">
                            <img src={backbtn} alt="Back" className="back-icon" width="30px"/>
                        </Link>
                        <h2 className="text-center mb-0" style={{textAlign:"center"}}>Notification</h2>
                        <h2 className="text-center mb-0" style={{textAlign:"center"}}></h2>
                    </div>
                    <div className="hearder2"></div>
                    <div className="nav-tabs d-flex justify-content-start d-none  gap-2"
                         style={{background:"white",marginRight:"16px",padding:"2px",borderRadius:"20px"}}>
                        <button onClick={this.tab.bind(this,"all")} className={val.tab=="all"?"tab-btn active":"tab-btn "}>View All</button>
                        <button onClick={this.tab.bind(this,"camp")} className={val.tab=="camp"?"tab-btn active":"tab-btn "}>Campaign</button>
                        <button onClick={this.tab.bind(this,"tran")} className={val.tab=="tran"?"tab-btn active":"tab-btn "}>Transaction</button>
                    </div>

                    <div className="notifications-list" style={{background:"#D0E2F1"}}>
                        {info}
                        {
                            this.state.loading==false && val.data.length==0?
                                <p style={{textAlign:"center",marginTop:"100px"}}>Notification Not Available</p>
                                :""
                        }
                        {
                            this.state.loading==true?
                                <div className="text-center mt-5">
                                    <div className="spinner-border text-primary " role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                                :""
                        }
                    </div>

                </div>
                </>
        );
    }
};

export default Notification;