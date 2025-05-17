import React, {Component} from 'react';
import Axios from "axios";
import ApiUrl from "../AppUrl/ApiUrl";

class RouteCheck extends Component {
    componentDidMount() {
        var path = window.location.pathname
        //console.log(path)


        if(path=="/" || path=="/home"){
            window.Telegram.WebApp.BackButton.hide();
           // window.Telegram.WebApp.BackButton.onClick(() => { window.Telegram.WebApp.close(); });
        }else{
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(() => { history.back(); });
        }



    }

    render() {
        return (
            <>

            </>
        );
    }
}

export default RouteCheck;