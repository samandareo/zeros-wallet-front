import {BrowserRouter}from "react-router-dom";
import Router from "./route/Router";
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import {GlobalDebug} from "./components/console";
import React, {Component} from 'react';
import {ToastContainer} from "react-toastify";
import { useLocation } from 'react-router-dom'
//zeroswallet.com
import { createBrowserHistory } from "history";


class App extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        GlobalDebug(false)

        window.Telegram.WebApp.initData
        console.log(window.Telegram.WebApp)


    }


    render() {
        return (
            <BrowserRouter>
                <ToastContainer
                    theme="colored"
                    position="top-right"
                    autoClose={1000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <Router/>
            </BrowserRouter>
        );
    }
}



export default App;
