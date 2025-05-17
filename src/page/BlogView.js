import React, {Component} from 'react';
import {Link} from "react-router-dom";
import backbtn from "../images/back-button.png";
import ApiUrl from "../AppUrl/ApiUrl";
import Axios from "axios";
import ReactHtmlParser from "react-html-parser";
import moment from "moment";
import loadinggif from "../images/loading.gif"
import RouteCheck from "../components/routeCheck";

class BlogView extends Component {
    constructor({match}) {
        super();
        this.state={
            id:match.params.id,title:"",img:"",des:"",created_at:"",loading:true
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        Axios.get(ApiUrl.baseurl+"blog/"+this.state.id)
            .then(res=>{
                if(res.data.error){
                    console.log("err")
                }else{
                    console.log(res.data)
                    if(res.data.length>0){
                        var val = res.data[0]
                        this.setState({title:val["title"],des:val["des"],img:val["img"],created_at:val["created_at"],
                            loading:false})
                    }
                    this.setState({loading:false})
                }
            })
            .catch(err=>{
                //console.log(err)
            })
    }

    render() {
        return (
            <>
                <div style={{background:"#D0E2F1",width:"100%",minHeight:"800px",height:"auto"}}>
                    <title>{this.state.title}</title>
                    <RouteCheck/>
                    <div className="container-fluid wallet-container" >
                        <div className="wallet-header2" style={{background:"#D0E2F1"}}>
                            <button className="back-btn" style={{background:"transparent",border:"none"}}>
                                <Link onClick={()=>this.props.history.go(-1)} to="#">
                                    <img src={backbtn} style={{marginLeft:"-0px"}} alt="Back" width="30px"/>
                                </Link>
                            </button>
                            <h3 className="text-center mb-0 " style={{color:"#000000"}}>{this.state.title}</h3>
                            <button className="notification-btn">

                            </button>
                        </div>

                        {
                            this.state.loading==true?
                                <div style={{width:"100%",height:"100%",background:"white"}}>
                                    <img style={{height:"250px",width:"100%",paddingTop:"50px"}} src={loadinggif}/>
                                    <img style={{height:"250px",width:"100%"}} src={loadinggif}/>
                                    <img style={{height:"250px",width:"100%",paddingBottom:"50px"}} src={loadinggif}/>
                                </div>:
                                <div className="blogsingle">
                                    <p>{moment(this.state.created_at).format(("YYYY-MM-DD HH:mm:ss"))}</p>
                                    <img src={this.state.img}/>
                                    <p className="reactquilldes">
                                        {ReactHtmlParser(this.state.des)}
                                    </p>
                                </div>
                        }



                    </div>
                </div>
            </>
        );
    }
}

export default BlogView;