import React, { Component } from 'react'
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import iconwhite from "../images/home-iconwhite.png"
import dapps from "../images/quiz.svg"
import earn from "../images/earn.png"
import airdrop from "../images/airdrop-icon.png"

import home from "../images/home-icon.png"
import dappswhite from "../images/active quiz.svg"
import earnwhite from "../images/earnwhite.png"
import airdropwhite from "../images/airdrop-active-icon.png"
import tgeclaimday from "../images/tgeclaim-white.png"
import tgeclaimdark from "../images/tgeclaim-blue.png"

class Footer extends Component {
    constructor() {
        super();
        this.state={
            path:"/",token:""
        }
    }

   async componentDidMount() {
       var path =window.location.pathname
       this.setState({path:path})
       //console.log(path)
    }

    render() {
        var val = this.state
        return (
            <div className="bottom-nav">
                <Link to="/" className={val.path=="/"?"nav-item active":"nav-item "}>
                    <img src={val.path=="/"?iconwhite:home} alt="" width="20px" height="20px"/>
                        Home
                </Link>
                <Link to="/quiz" className={val.path=="/quiz"?"nav-item active":"nav-item "}>
                    <img src={val.path=="/quiz"?dappswhite:dapps} alt="" width="20px" height="20px"/>
                         Quiz
                </Link>
                <Link to="/earn" className={val.path=="/earn"?"nav-item active":"nav-item "}>
                    <img src={val.path=="/earn"?earnwhite:earn} alt="" width="20px" height="20px"/>
                        Earn
                </Link>
                <Link to="/airdrop" className={val.path=="/airdrop"?"nav-item active":"nav-item "}>
                    <img src={val.path=="/airdrop"?airdropwhite:airdrop} alt="" width="20px" height="20px"/>
                        Airdrop
                </Link>
                <Link to="/tge-and-claim" className={val.path=="/tge-and-claim"?"nav-item active":"nav-item"}>
                    <img src={val.path=="/tge-and-claim"?tgeclaimday:tgeclaimdark} alt="" width="20px" height="20px"/>
                    TGE&Claim
                </Link>
            </div>
        )
    }
}

export default Footer
