import React,{Component,Fragment} from "react";
import {Switch,Route,Redirect} from "react-router-dom";
import Home from "../page/Home";
import Quiz from "../page/Quiz";
import Earn from "../page/Earn";
import Airdrop from "../page/Airdrop";
import TgeAndClaim from "../page/TgeAndClaim";
import ChooseCex from "../page/ChooseCex";
import Notification from "../page/Notification";
import Settings from "../page/Settings";
import SendList from "../page/SendList";
import ReceiveList from "../page/ReceiveList";
import Manage from "../page/Manage";
import HomeLock from "../page/HomeLock";
import CreateWallet from "../page/CreateWallet";
import ImportWallet from "../page/ImportWallet";
import CoinDetails from "../page/CoinDetails";
import ReceivePage from "../page/ReceivePage";
import SendCoin from "../page/SendCoin";
import AddToken from "../page/AddToken";
import Support from "../page/Support";
import AirdropTask from "../page/AirdropTask";
import Wallet from "../page/Wallet";
import DepositList from "../page/DepositList";
import WithdrewList from "../page/WithdrewList";
import Stake from "../page/Stake";
import About from "../page/About";
import Swap from "../page/Swap";
import Refer from "../page/Refer";
import BackUp from "../page/BackUp";
import History from "../page/History";
import Deposit from "../page/Deposit";
import Withdrew from "../page/Withdrew";
import BlogView from "../page/BlogView";
import InfoView from "../page/InfoView";
import Terms from "../page/Terms";
import AllHistory from "../page/AllHistory";
import TrxDetails from "../page/TrxDetails";
import WalletView from "../page/WalletView";
import Password from "../page/Password";
import QuizQuestion from "../page/QuizQuestion";
import Badge from "../page/Badge";
import ClaimZeros from "../page/ClaimNftPage";
import MyNft from "../page/MyNftpage";
import Allocation from "../page/Allocation";
import TokenTransfer from "../page/TransferToken";
import SwipeToken from "../page/TokenSwap";

class Router extends Component {

    render() {
        return (
            <Fragment>
              <Switch>
                  <Route exact path="/" component={Home}/>
                  <Route exact path="/quiz" component={Quiz}/>
                  <Route exact path="/quizq" component={QuizQuestion}/>
                  <Route exact path="/earn" component={Earn}/>
                  <Route exact path="/airdrop" component={Airdrop}/>
                  <Route exact path="/tge-and-claim" component={TgeAndClaim}/>
                  <Route exact path="/choose-your-cex" component={ChooseCex}/>
                  <Route exact path="/allocation" component={Allocation}/>
                  <Route exact path="/transfer" component={TokenTransfer}/>
                  <Route exact path="/notification" component={Notification}/>
                  <Route exact path="/settings" component={Settings}/>
                  <Route exact path="/sendlist" component={SendList}/>
                  <Route exact path="/receivelist" component={ReceiveList}/>
                  <Route exact path="/manage" component={Manage}/>
                  <Route exact path="/home" component={HomeLock}/>
                  <Route exact path="/createwallet" component={CreateWallet}/>
                  <Route exact path="/importwallet" component={ImportWallet}/>
                  <Route exact path="/coindetails/:id" component={CoinDetails}/>
                  <Route exact path="/receive/:id" component={ReceivePage}/>
                  <Route exact path="/send/:id" component={SendCoin}/>
                  <Route exact path="/addtoken" component={AddToken}/>
                  <Route exact path="/support" component={Support}/>
                  <Route exact path="/task/:id" component={AirdropTask}/>
                  <Route exact path="/wallet" component={Wallet}/>
                  <Route exact path="/wallet/depositlist" component={DepositList}/>
                  <Route exact path="/wallet/withdrewlist" component={WithdrewList}/>
                  <Route exact path="/wallet/deposit/:id" component={Deposit}/>
                  <Route exact path="/wallet/withdrew/:id" component={Withdrew}/>
                  <Route exact path="/wallet/view/:id" component={WalletView}/>
                  <Route exact path="/stake" component={Stake}/>
                  <Route exact path="/about" component={About}/>
                  <Route exact path="/swap" component={Swap}/>
                  <Route exact path="/tokenswap" component={SwipeToken}/>
                  <Route exact path="/refer" component={Refer}/>
                  <Route exact path="/backup" component={BackUp}/>
                  <Route exact path="/history" component={History}/>
                  <Route exact path="/blog/:id" component={BlogView}/>
                  <Route exact path="/info/:id" component={InfoView}/>
                  <Route exact path="/terms" component={Terms}/>
                  <Route exact path="/allhistory" component={AllHistory}/>
                  <Route exact path="/trx/:id/:hash" component={TrxDetails}/>
                  <Route exact path="/password" component={Password}/>
                  <Route exact path="/badge" component={Badge}/>
                  <Route exact path="/claim" component={ClaimZeros}/>
                  <Route exact path="/mynft" component={MyNft}/> 
              </Switch>
            </Fragment>
         );
    }
}

export default Router;
