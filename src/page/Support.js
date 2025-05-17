import React, {Component} from 'react';
import back from "../images/back-button.png"
import {Link} from "react-router-dom";
import RouteCheck from "../components/routeCheck";

class Support extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <>
                <title>Support </title>
                <RouteCheck/>
                <div className="container-fluid wallet-container" style={{height:"800px"}}>
                    <div className="header p-3" >
                        <Link onClick={()=>this.props.history.go(-1)} to="#" className="back-button text-decoration-none">
                            <img src={back} style={{marginLeft:"-15px"}} alt="Back" className="back-icon" width="30px"/>
                        </Link>
                        <h1 className="text-center mb-0">Support</h1>
                        <h1 className="text-center mb-0"></h1>
                    </div>
                    <br/><br/><br/><br/>
                    <div className="support-section">
                        <p>Welcome To The Support Center<br/>We're Here To Assist You With Any Questions, Issues, Or
                            Concerns You May Have.</p>
                        <h5>How Can We Help You?</h5>
                        <ul>
                            <li><strong>FAQs:</strong> Find Quick Answers To Common Questions.</li>
                            <li><strong>Technical Support:</strong> Facing An Issue? Our Team Is Ready To Help You
                                Resolve It.
                            </li>
                            <li><strong>Account Assistance:</strong> Need Help With Your Account Or Transactions? We’ve
                                Got You Covered.
                            </li>
                            <li><strong>Feedback & Suggestions:</strong> Share Your Ideas Or Feedback To Help Us
                                Improve.
                            </li>
                        </ul>
                    </div>
                    <div className="support-section contact-info">
                        <h5>Contact Us:</h5>
                        <p>If You Can’t Find What You’re Looking For, Feel Free To Reach Out To Us:</p>
                        <ul>
                            <li><strong>Telegram Username:</strong> <a href="https://t.me/zeroscommunity"
                                                                       target="_blank">@zeroscommunity</a></li>
                            <li><strong>Live Chat:</strong> Click The Chat Icon At The Bottom Of The Page To Speak With
                                A Support Agent.
                            </li>
                            <li><strong>Help Desk:</strong> Submit A Ticket, And Our Team Will Get Back To You Within
                                24–48 Hours.
                            </li>
                        </ul>
                    </div>
                    <p className="text-center mt-3">We’re Committed To Providing You With The Best Possible Experience.
                        Let Us Know How We Can Help!</p>
                </div>
            </>
        );
    }
}

export default Support;