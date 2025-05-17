import React, {Component} from 'react';
import Footer from "../components/Footer";
import {Link} from "react-router-dom";
import backbtn from "../images/Vector (2).svg";
import ApiUrl from "../AppUrl/ApiUrl";
import Axios from "axios";
import moment from "moment";
import {toast} from "react-toastify";
import {backButton} from "@telegram-apps/sdk";
import RouteCheck from "../components/routeCheck";

export function TimeAgo(date){
    var localTime  = moment.utc(date).toDate();
    return localTime
}

class Quiz extends Component {
    constructor() {
        super();
        this.state={
            token:"",
            d:"0",h:"0",m:"0",s:"0",quiz:"",data:[],time:new Date().getTime(),btn:false
        }
        this.interval=null
    }
    componentDidMount() {
        window.scrollTo(0, 0);

        var token = localStorage.getItem("authtoken")
        if(token){
            var quizd = JSON.parse(localStorage.getItem("quizd"))
            if(quizd){
                this.setState({data:quizd})
            }
            var quiz = localStorage.getItem("quiz")
            if(quiz){
                this.setState({quiz:quiz})
            }

            Axios.post(ApiUrl.baseurl+"quiz/get")
                .then(res=>{
                    var val = [res.data]
                    this.setState({data:val})
                    localStorage.setItem("quizd",JSON.stringify(val))
                    //console.log(val)
                })
                .catch(err=>{
                    //
                })

            this.setState({token:token})
            var formd = new FormData()
            formd.append("token",token)
            Axios.post(ApiUrl.baseurl+"quiz/my",formd)
                .then(res=>{
                    var val = res.data.quiz
                    this.setState({quiz:val})
                    localStorage.setItem("quiz",val)
                    //console.log(val)
                })
                .catch(err=>{
                    //
                })
            this.interval = setInterval(()=>{
                this.countDown()
            },1000)

        }else {
            this.props.history.push("/home")
        }


    }

    goto=()=>{
        var val =this.state
        if(val.quiz=="Yes"){
            toast.error("Try tomorrow", {
                theme: "colored",
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }else{
            this.props.history.push("/quizq")
        }

    }

    countDown=()=>{
        var time = this.state.data[0]["counttime"]
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
        }else{
            this.setState({btn:true})
        }
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
        var val = this.state
        return (
            <>
                <title>Quiz</title>
                <RouteCheck/>
                <div className="quiz-container">
                    <div className="wallet-headerearn" style={{background:"#D0E1F1",padding:"5px"}}>
                        <button className="back-btn" style={{background:"none",border:"none"}}>
                            <Link onClick={()=>this.props.history.go(-1)} to="#">
                                <img src={backbtn} alt="Back" width="30px"/>
                            </Link>
                        </button>
                        <h1 className="text-center mb-0 " style={{color:"#191b1c"}}>Quiz</h1>
                        <button className="notification-btn">

                        </button>
                    </div>

                    <br/><br/>
                    <div className="quiz-header">
                        <h1 className="quiz-title">Daily Quiz <span className="quiz-date">On {moment(val.time).format('ll')}</span></h1>
                    </div>

                    <div className="quiz-content">
                        <div className="quiz-info">
                            <p className="quiz-description" style={{fontSize:"14px"}}>Join The Daily Crypto Quiz To Test Your Knowledge, Learn About
                                Cryptocurrencies, And Earn Rewards!</p>
                        </div>

                        <div className="quiz-timer">
                            <p className="timer-label">Daily Quiz Ends In</p>
                            <div className="timer-digits">
                                <span className="timer-box">{val.h}</span>
                                <span className="timer-box">{val.m}</span>
                                <span className="timer-box">{val.s}</span>
                            </div>
                        </div>

                        <div className="quiz-reward">
                            <p style={{fontSize:"14px"}}>⭐ For Every Correct Answer, You'll Score 1 or More ZEROS Token. Don't Miss Out On This Fun And
                                Rewarding Challenge!</p>
                        </div>

                    </div>

                    <button disabled={val.btn==true }
                        onClick={this.goto} className="quiz-btn-primary">Start Quiz</button>


                    <br/><br/><br/><br/><br/>
                </div>
                <Footer/>
            </>
        );
    }
}

export default Quiz;