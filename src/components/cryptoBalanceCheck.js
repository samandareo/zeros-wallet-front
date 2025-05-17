import jwtDecode from "jwt-decode";
import {token_abi} from "./AbiContract";
import {ethers} from "ethers";
import TronWeb from "tronweb"
import axios from "axios";
window.Buffer = window.Buffer || require("buffer").Buffer;

//https://ethereum.stackexchange.com/questions/100209/estimate-gas-price-with-ethers-js

const  cryptoBalanceCheck=async(symbol,platform,type,token_contract,decimal,rpc,chain)=>{


    var token = localStorage.getItem("authtoken")
    var decoded = jwtDecode(token)

    if(platform=="Ethereum"){
        const key1 = decoded.key1
        const provider = new ethers.providers.InfuraProvider("homestead")
        let wallet = new ethers.Wallet(key1);
        var address = wallet.address
        const feeData = await provider.getFeeData();
        let gasPrice = feeData.gasPrice;
        const gasPriceInEth = (21000*parseFloat(ethers.utils.formatUnits(feeData.maxFeePerGas, 'ether'))).toFixed(8)
        console.log(gasPriceInEth)
        if(type=="Token"){
            let contract = new ethers.Contract(token_contract, token_abi, provider)
            var decdynamic = await contract.decimals()
            const ercbalance = await contract.balanceOf(address)
            const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
            const name = await contract.name()
            const symbol = await contract.symbol()
            const decimals = await contract.decimals()
            /*await contract.name()
                .then(res=>{
                    console.log(res)
                })*/
            //console.log("ERC20 Token Balance : ",tokenbal)
            return {"balance":tokenbal,"address":address,"privatekey":key1,"fee":gasPriceInEth,name:name,symbol:symbol,decimals:decimals}
        }else{
            const ethbalance = await provider.getBalance(address);
            //console.log("ETH Balance : ",ethers.utils.formatEther(ethbalance));
            return {"balance":ethers.utils.formatEther(ethbalance),"address":address,"privatekey":key1,"fee":gasPriceInEth}
        }
    }else if(platform=="Base"){
        const key1 = decoded.key1
        const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org', { name: 'base', chainId: 8453 })
        let wallet = new ethers.Wallet(key1);
        //var gas =await provider.getGasPrice()
        //console.log(gas)
        //console.log(ethers.utils.formatEther(gas["_hex"]))
        var address = wallet.address
        const feeData = await provider.getFeeData();
        let gasPrice = feeData.gasPrice;
        const gasPriceInEth = (21000*parseFloat(ethers.utils.formatUnits(feeData.maxFeePerGas, 'ether'))).toFixed(8)
        console.log(gasPriceInEth)
        if(type=="Token"){
            let contract = new ethers.Contract(token_contract, token_abi, provider)
            var decdynamic = await contract.decimals()
            const ercbalance = await contract.balanceOf(address)
            const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
            const name = await contract.name()
            const symbol = await contract.symbol()
            const decimals = await contract.decimals()
            /*await contract.name()
                .then(res=>{
                    console.log(res)
                })
            console.log("BASE ETH Token Balance : ",tokenbal)*/
            return {"balance":tokenbal,"address":address,"privatekey":key1,"fee":gasPriceInEth,name:name,symbol:symbol,decimals:decimals}
        }else{
            const ethbalance = await provider.getBalance(address);
            //console.log("BNB Balance : ",ethers.utils.formatEther(ethbalance));
            return {"balance":ethers.utils.formatEther(ethbalance),"address":address,"privatekey":key1,"fee":gasPriceInEth}
        }
    }else if(platform=="Binance"){
        const key1 = decoded.key1
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/', { name: 'binance', chainId: 56 })
        let wallet = new ethers.Wallet(key1);
        //var gas =await provider.getGasPrice()
        //console.log(gas)
        //console.log(ethers.utils.formatEther(gas["_hex"]))
        var address = wallet.address
        const feeData = await provider.getFeeData();
        //console.log(feeData)
        let gasPrice = feeData.gasPrice;
        const gasPriceInEth = (21000*parseFloat(ethers.utils.formatUnits(feeData.maxFeePerGas, 'ether'))).toFixed(8);
        console.log(gasPriceInEth)
        if(type=="Token"){
            let contract = new ethers.Contract(token_contract, token_abi, provider)
            var decdynamic = await contract.decimals()
            const ercbalance = await contract.balanceOf(address)
            const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
            const name = await contract.name()
            const symbol = await contract.symbol()
            const decimals = await contract.decimals()
            /*await contract.name()
                .then(res=>{
                    console.log(res)
                })
            console.log("BNB Token Balance : ",tokenbal)*/
            return {"balance":tokenbal,"address":address,"privatekey":key1,"fee":gasPriceInEth,name:name,symbol:symbol,decimals:decimals}
        }else{
            const ethbalance = await provider.getBalance(address);
            //console.log("BNB Balance : ",ethers.utils.formatEther(ethbalance));
            return {"balance":ethers.utils.formatEther(ethbalance),"address":address,"privatekey":key1,"fee":gasPriceInEth}
        }
    }else if(platform=="Polygon"){
        const key1 = decoded.key1
        const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/', { name: 'polygon', chainId: 137 })
        let wallet = new ethers.Wallet(key1);
        var address = wallet.address
        const feeData = await provider.getFeeData();
        let gasPrice = feeData.gasPrice;
        const gwei =parseFloat(ethers.utils.formatUnits(gasPrice, 'gwei'));
        const gasPriceInEth =(21000*parseFloat(ethers.utils.formatUnits(feeData.maxFeePerGas, 'ether'))).toFixed(8)
        console.log(gwei,"GWEI")

        if(type=="Token"){
            let contract = new ethers.Contract(token_contract, token_abi, provider)
            var decdynamic = await contract.decimals()
            const ercbalance = await contract.balanceOf(address)
            const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
            const name = await contract.name()
            const symbol = await contract.symbol()
            const decimals = await contract.decimals()
            /*await contract.name()
                .then(res=>{
                    console.log(res)
                })
            console.log("Matic Token Balance : ",tokenbal)*/
            return {"balance":tokenbal,"address":address,"privatekey":key1,"fee":gasPriceInEth,name:name,symbol:symbol,decimals:decimals}

        }else{
            const ethbalance = await provider.getBalance(address);
            //console.log("Matic Balance : ",ethers.utils.formatEther(ethbalance));
            return {"balance":ethers.utils.formatEther(ethbalance),"address":address,"privatekey":key1,"fee":gasPriceInEth}
        }
    }else if(platform=="Cronos"){
        const key1 = decoded.key1
        const provider = new ethers.providers.JsonRpcProvider('https://evm-cronos.crypto.org', { name: 'cronos', chainId: 25 })
        let wallet = new ethers.Wallet(key1);
        var address = wallet.address
        const feeData = await provider.getFeeData();
        let gasPrice = feeData.gasPrice;
        const gasPriceInEth = (21000*parseFloat(ethers.utils.formatUnits(feeData.maxFeePerGas, 'ether'))).toFixed(8)
        console.log(gasPriceInEth)
        if(type=="Token"){
            let contract = new ethers.Contract(token_contract, token_abi, provider)
            var decdynamic = await contract.decimals()
            const ercbalance = await contract.balanceOf(address)
            const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
            const name = await contract.name()
            const symbol = await contract.symbol()
            const decimals = await contract.decimals()
            /*await contract.name()
                .then(res=>{
                    console.log(res)
                })
            console.log("CRO Token Balance : ",tokenbal)*/
            return {"balance":tokenbal,"address":address,"privatekey":key1,"fee":gasPriceInEth,name:name,symbol:symbol,decimals:decimals}

        }else{
            const ethbalance = await provider.getBalance(address);
            //console.log("CRO Balance : ",ethers.utils.formatEther(ethbalance));
            return {"balance":ethers.utils.formatEther(ethbalance),"address":address,"privatekey":key1,"fee":gasPriceInEth}
        }
    }else if(platform=="Fantom"){
        const key1 = decoded.key1
        const provider = new ethers.providers.JsonRpcProvider('https://fantom.drpc.org', { name: 'fantom', chainId: 250 })
        let wallet = new ethers.Wallet(key1);
        var address = wallet.address
        const feeData = await provider.getFeeData();
        let gasPrice = feeData.gasPrice;
        const gasPriceInEth = (21000*parseFloat(ethers.utils.formatUnits(feeData.maxFeePerGas, 'ether'))).toFixed(8)
        console.log(gasPriceInEth)
        if(type=="Token"){
            let contract = new ethers.Contract(token_contract, token_abi, provider)
            var decdynamic = await contract.decimals()
            const ercbalance = await contract.balanceOf(address)
            const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
            const name = await contract.name()
            const symbol = await contract.symbol()
            const decimals = await contract.decimals()
            /*await contract.name()
                .then(res=>{
                    console.log(res)
                })
            console.log("Fantom Token Balance : ",tokenbal)*/
            return {"balance":tokenbal,"address":address,"privatekey":key1,"fee":gasPriceInEth,name:name,symbol:symbol,decimals:decimals}

        }else{
            const ethbalance = await provider.getBalance(address);
            //console.log("Fantom Balance : ",ethers.utils.formatEther(ethbalance));
            return {"balance":ethers.utils.formatEther(ethbalance),"address":address,"privatekey":key1,"fee":gasPriceInEth}
        }
    }else if(platform=="Avalanche"){
        const key1 = decoded.key1
        const provider = new ethers.providers.JsonRpcProvider('https://avax.meowrpc.com', { name: 'avalanche', chainId: 43114 })
        let wallet = new ethers.Wallet(key1);
        var address = wallet.address
        const feeData = await provider.getFeeData();
        let gasPrice = feeData.gasPrice;
        const gasPriceInEth = (21000*parseFloat(ethers.utils.formatUnits(feeData.maxFeePerGas, 'ether'))).toFixed(8)
        console.log(gasPriceInEth)
        if(type=="Token"){
            let contract = new ethers.Contract(token_contract, token_abi, provider)
            var decdynamic = await contract.decimals()
            const ercbalance = await contract.balanceOf(address)
            const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
            const name = await contract.name()
            const symbol = await contract.symbol()
            const decimals = await contract.decimals()
            /*await contract.name()
                .then(res=>{
                    console.log(res)
                })
            console.log("Avax Token Balance : ",tokenbal)*/
            return {"balance":tokenbal,"address":address,"privatekey":key1,"fee":gasPriceInEth,name:name,symbol:symbol,decimals:decimals}

        }else{
            const ethbalance = await provider.getBalance(address);
            //console.log("Avax Balance : ",ethers.utils.formatEther(ethbalance));
            return {"balance":ethers.utils.formatEther(ethbalance),"address":address,"privatekey":key1,"fee":gasPriceInEth}
        }
    }else if(platform=="Custom"){
        console.log(rpc,chain,"Custom")
        const key1 = decoded.key1
        const provider = new ethers.providers.JsonRpcProvider(rpc,{ name: '', chainId: parseInt(chain) })
        let wallet = new ethers.Wallet(key1);
        var address = wallet.address
        const ethbalance = await provider.getBalance(address);
        console.log("Custom Balance : ",ethers.utils.formatEther(ethbalance));
        return {"balance":ethers.utils.formatEther(ethbalance),"address":address,"privatekey":key1,"fee":"0.000525"}

    }else if(platform=="Tron"){
        const key1 =await decoded.key1
        const tronWeb = new TronWeb({
            fullHost: 'https://api.trongrid.io',
            eventServer: 'https://api.someotherevent.io', privateKey: key1}
        )
        const address = await tronWeb.defaultAddress["base58"];

        if(type=="Token"){
            let contract = await tronWeb.contract().at(token_contract)
            //console.log("Ok "+symbol)
            //let result = await contract.name().call();
            //console.log(result)
            let result1 = await contract.balanceOf(address).call();
            //console.log('Balance of trc20 `{result}` : ',tronWeb.fromSun(result1["_hex"]).toString() );
            return {"balance":tronWeb.fromSun(result1["_hex"]).toString(),"address":address,"privatekey":key1,"fee":"1"}
        }else{
            var bal =0;
            await tronWeb.trx.getAccount(address)
                .then(output => {
                    bal= tronWeb.fromSun(output.balance).toString()
                    //console.log('TRX Balance:', tronWeb.fromSun(output.balance).toString(), '\n');
                    //console.log("Tron Address : ",address)
                })
                .catch(err=>{
                    console.log(err)
                })
            return {"balance":bal,"address":address,"privatekey":key1,"fee":"1"}
        }

    }else{
        return {"balance":"0","address":"","privatekey":"","fee":"0 "+this.state.name}
    }


}

export default cryptoBalanceCheck;