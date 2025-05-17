import React, {Component} from 'react';
import {Link} from "react-router-dom";
import backbtn from "../images/Vector (2).svg";
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";
import moment from "moment";
import {toast} from "react-toastify";
import RouteCheck from "../components/routeCheck";

class QuizQuestion extends Component {
    constructor() {
        super();
        this.state={
            token:"",
            quiz:"",data:[],time:new Date().getTime(),title:"",ques:"",answer:"",loading:false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        var token = localStorage.getItem("authtoken")
        if(token){
            var quizd = JSON.parse(localStorage.getItem("quizd"))
            if(quizd){
                this.setState({data:quizd,ques:quizd[0]["ques"],title:quizd[0]["title"]})
            }
            var quiz = localStorage.getItem("quiz")
            if(quiz){
                this.setState({quiz:quiz})
            }

            Axios.post(ApiUrl.baseurl+"quiz/get")
                .then(res=>{
                    var val = [res.data]
                    this.setState({data:val,ques:val[0]["ques"],title:val[0]["title"]})
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

        }else {
            this.props.history.push("/home")
        }
    }

    answer=(val)=>{
        this.setState({answer:val})
        console.log(val)
    }

    errorMsg=(val)=>{
        toast.error(val, {
            theme: "colored",
            position: "top-center",
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
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    submitData=(event)=>{
        const source = Axios.CancelToken.source();
        const cancelToken = source.token;
        event.preventDefault()
        var val = this.state
        if(val.answer==""){
            this.errorMsg("Choose One")
        }else{
            this.setState({loading:true})
            var formD = new FormData()
            formD.append("answer",val.answer)
            formD.append("token",val.token)
            Axios.post(ApiUrl.baseurl+"quiz/check",formD)
                .then(res=>{
                    if(res.data.error){
                        this.errorMsg(res.data.error)
                    }else{
                        this.successMsg(res.data.success)
                    }
                    this.setState({loading:false})
                    setTimeout(()=>{
                        this.props.history.push("/quiz")
                    },1000)
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

    }

    render() {
        var val = this.state
        var qq = []
        try {
            qq = this.state.ques.split(",")
        }catch (e){
            console.log("")
        }
        //console.log(qq)

        return (
            <>
                <title>Quiz Answer</title>
                <RouteCheck/>
                <div className="quiz-question-container" style={{height:"auto",minHeight:"850px"}}>
                    <div className="wallet-headerearn" style={{background:"#D0E1F1",padding:"5px",
                        marginTop:"-10px"}}>
                        <button className="back-btn" style={{background:"none",border:"none"}}>
                            <Link onClick={()=>this.props.history.go(-1)} to="#" >
                                <img src={backbtn} alt="Back" width="30px"/>
                            </Link>
                        </button>
                        <h1 className="text-center mb-0 " style={{color:"#191b1c"}}>Quiz Answer</h1>
                        <button className="notification-btn">

                        </button>
                    </div>
                    <br/><br/>

                    <div className="quiz-header">
                        <h1 className="quiz-title">Daily Quiz <span className="quiz-date">On {moment(val.time).format('ll')}</span></h1>
                    </div>

                    <div className="quiz-question-content">
                        <div className="quiz-question">
                            <p style={{fontSize:"14px"}}>{val.title}</p>
                        </div>

                        <div className="quiz-options">
                            <p className="mb-2">choose one <span className="text-primary">correct</span> answer</p>

                            <div className="quiz-option-list">

                                {qq.map(res=>{
                                    return(
                                        <div style={{marginBottom:"0px"}} onClick={this.answer.bind(this,res)} className="form-check quiz-option">
                                            <input style={{marginLeft:"1px"}} checked={res==val.answer} className="form-check-input" type="radio" name="quizOption" id="option4"/>
                                            <label className="form-check-label" htmlFor="option4">{res}</label>
                                        </div>
                                    )
                                })}


                            </div>
                        </div>
                    </div>

                    <button disabled={val.loading} onClick={this.submitData}
                        className="quiz-question-btn quiz-question-btn-primary">
                        {val.loading==true?"Checking...":"Check"}
                    </button>

                </div>
            </>
        );
    }
}

export default QuizQuestion;