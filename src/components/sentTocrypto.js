import jwtDecode from "jwt-decode";
import {token_abi} from "./AbiContract";
import {ethers} from "ethers";
import TronWeb from "tronweb"
import {toast} from "react-toastify";
import axios from "axios";
window.Buffer = window.Buffer || require("buffer").Buffer;

export const err=(val)=>{
    toast.error(val, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}
export const success=(val)=>{
    toast.success(val, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

const  sendTocrypto=async(symbol,platform,type,token_contract,decimal,raddress,amount,rpc,chain)=>{
    var token = localStorage.getItem("authtoken")
    var decoded = jwtDecode(token)
    console.log(symbol,platform,type,token_contract,decimal,raddress,amount,rpc,chain)
   if(platform=="Ethereum"){
       const key1 = decoded.key1
        const provider = new ethers.providers.InfuraProvider("homestead")//ropsten homestead
        let wallet = new ethers.Wallet(key1,provider);
        var address = wallet.address
        const feeData = await provider.getFeeData()
        if(type=="Token"){
            let contract = new ethers.Contract(token_contract, token_abi, wallet)
            var decdynamic = await contract.decimals()
            const ercbalance = await contract.balanceOf(address)
            const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
            console.log("ERC20 Token Balance : ",tokenbal)
            let numberOfTokens = ethers.utils.parseUnits(amount,decdynamic)
            if(parseFloat(tokenbal)>parseFloat(amount)){
                contract.transfer(raddress, numberOfTokens, { gasPrice: feeData.gasPrice })
                    .then((ttx) => {
                        success("Transaction has been broadcast to node")
                        ttx.wait()
                            .then(res=>{
                                success("Transaction Send Successful trx id : "+res.transactionHash)
                                console.log(res)
                                console.log("trx hash "+res.transactionHash)
                            })
                            .catch(error=>{
                                //console.log(error.message)
                                err(error.message)
                            })
                    })
                    .catch(error=>{
                        console.log(error)
                        err(error.message)
                    })
            }else {
                err(symbol+" balance not enough")
            }
        }else{
            const ethbalance = await provider.getBalance(address);
            console.log("ETH Balance : ",ethers.utils.formatEther(ethbalance));
            const tx = {
                from: address,//wallet.address,
                to: raddress,
                value: ethers.utils.parseUnits(amount, 'ether').toHexString(),
                gasLimit: ethers.utils.hexlify(21000),
                gasPrice: feeData.gasPrice
            }
            if(parseFloat(ethers.utils.formatEther(ethbalance))>parseFloat(amount)){
                wallet.sendTransaction(tx)
                    .then((ttx) => {
                        success("Transaction has been broadcast to node")
                        ttx.wait()
                            .then(res=>{
                                success("Transaction Send Successful trx id : "+res.transactionHash)
                                console.log(res)
                                console.log("trx hash "+res.transactionHash)
                            })
                            .catch(error=>{
                                //console.log(error.message)
                                err(error.message)
                            })
                    })
                    .catch(error=>{
                        console.log(error.message)
                        err(error.message)
                    })
            }else {
                err("ETH balance not enough")
            }
        }
    }else if(platform=="Base"){
       const key1 = decoded.key1
       const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org/', { name: 'base', chainId: 8453 })
       let wallet = new ethers.Wallet(key1,provider);
       var address = wallet.address
       if(type=="Token"){
           let contract = new ethers.Contract(token_contract, token_abi, wallet)
           var decdynamic = await contract.decimals()
           const ercbalance = await contract.balanceOf(address)
           const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
           console.log("BNB Token Balance : ",tokenbal)
           let numberOfTokens = ethers.utils.parseUnits(amount,decdynamic)
           if(parseFloat(tokenbal)>parseFloat(amount)){
               contract.transfer(raddress, numberOfTokens)
                   .then((ttx) => {
                       success("Transaction has been broadcast to node")
                       ttx.wait()
                           .then(res=>{
                               success("Transaction Send Successful trx id : "+res.transactionHash)
                               console.log(res)
                               console.log("trx hash "+res.transactionHash)
                           })
                           .catch(error=>{
                               //console.log(error.message)
                               err(error.message)
                           })
                   })
                   .catch(error=>{
                       console.log(error)
                       err(error.message)
                   })
           }else {
               err(symbol+" balance not enough")
           }

       }else{
           const ethbalance = await provider.getBalance(address);
           console.log("BNB Balance : ",ethers.utils.formatEther(ethbalance));
           const tx = {
               from: address,//wallet.address,
               to: raddress,
               value: ethers.utils.parseUnits(amount, 'ether').toHexString(),
               gasLimit: ethers.utils.hexlify(21000),
           }
           if(parseFloat(ethers.utils.formatEther(ethbalance))>parseFloat(amount)){
               wallet.sendTransaction(tx)
                   .then((ttx) => {
                       success("Transaction has been broadcast to node")
                       ttx.wait()
                           .then(res=>{
                               success("Transaction Send Successful trx id : "+res.transactionHash)
                               console.log(res)
                               console.log("trx hash "+res.transactionHash)
                           })
                           .catch(error=>{
                               //console.log(error.message)
                               err(error.message)
                           })
                   })
                   .catch(error=>{
                       console.log(error.message)
                       err(error.message)
                   })
           }else {
               err(symbol+" balance not enough")
           }
       }
   }else if(platform=="Custom"){
       const key1 = decoded.key1
       const provider = new ethers.providers.JsonRpcProvider(rpc, { name: 'base', chainId: parseInt(chain) })
       let wallet = new ethers.Wallet(key1,provider);
       var address = wallet.address
       const ethbalance = await provider.getBalance(address);
       console.log("BNB Balance : ",ethers.utils.formatEther(ethbalance));
       const tx = {
           from: address,//wallet.address,
           to: raddress,
           value: ethers.utils.parseUnits(amount, 'ether').toHexString(),
           gasLimit: ethers.utils.hexlify(21000),
       }
       if(parseFloat(ethers.utils.formatEther(ethbalance))>parseFloat(amount)){
           wallet.sendTransaction(tx)
               .then((ttx) => {
                   success("Transaction has been broadcast to node")
                   ttx.wait()
                       .then(res=>{
                           success("Transaction Send Successful trx id : "+res.transactionHash)
                           console.log(res)
                           console.log("trx hash "+res.transactionHash)
                       })
                       .catch(error=>{
                           //console.log(error.message)
                           err(error.message)
                       })
               })
               .catch(error=>{
                   console.log(error.message)
                   err(error.message)
               })
       }else {
           err(symbol+" balance not enough")
       }
   }else if(platform=="Binance"){
       const key1 = decoded.key1
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/', { name: 'binance', chainId: 56 })
        let wallet = new ethers.Wallet(key1,provider);
        var address = wallet.address
        if(type=="Token"){
            let contract = new ethers.Contract(token_contract, token_abi, wallet)
            var decdynamic = await contract.decimals()
            const ercbalance = await contract.balanceOf(address)
            const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
            console.log("BNB Token Balance : ",tokenbal)
            let numberOfTokens = ethers.utils.parseUnits(amount,decdynamic)
            if(parseFloat(tokenbal)>parseFloat(amount)){
                contract.transfer(raddress, numberOfTokens)
                    .then((ttx) => {
                        success("Transaction has been broadcast to node")
                        ttx.wait()
                            .then(res=>{
                                success("Transaction Send Successful trx id : "+res.transactionHash)
                                console.log(res)
                                console.log("trx hash "+res.transactionHash)
                            })
                            .catch(error=>{
                                //console.log(error.message)
                                err(error.message)
                            })
                    })
                    .catch(error=>{
                        console.log(error)
                        err(error.message)
                    })
            }else {
                err(symbol+" balance not enough")
            }

        }else{
            const ethbalance = await provider.getBalance(address);
            console.log("BNB Balance : ",ethers.utils.formatEther(ethbalance));
            const tx = {
                from: address,//wallet.address,
                to: raddress,
                value: ethers.utils.parseUnits(amount, 'ether').toHexString(),
                gasLimit: ethers.utils.hexlify(21000),
            }
            if(parseFloat(ethers.utils.formatEther(ethbalance))>parseFloat(amount)){
                wallet.sendTransaction(tx)
                    .then((ttx) => {
                        success("Transaction has been broadcast to node")
                        ttx.wait()
                            .then(res=>{
                                success("Transaction Send Successful trx id : "+res.transactionHash)
                                console.log(res)
                                console.log("trx hash "+res.transactionHash)
                            })
                            .catch(error=>{
                                //console.log(error.message)
                                err(error.message)
                            })
                    })
                    .catch(error=>{
                        console.log(error.message)
                        err(error.message)
                    })
            }else {
                err(symbol+" balance not enough")
            }
        }
    }else if(platform=="Polygon"){
       const key1 = decoded.key1
        const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/', { name: 'polygon', chainId: 137 })
        let wallet = new ethers.Wallet(key1,provider);
        var address = wallet.address
        const feeData = await provider.getFeeData()
        if(type=="Token"){
            let contract = new ethers.Contract(token_contract, token_abi, wallet)
            var decdynamic = await contract.decimals()
            const ercbalance = await contract.balanceOf(address)
            const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
            console.log("MATIC Token Balance : ",tokenbal)
            let numberOfTokens = ethers.utils.parseUnits(amount,decdynamic)
            if(parseFloat(tokenbal)>parseFloat(amount)){
                contract.transfer(raddress, numberOfTokens, { gasPrice: feeData.gasPrice })
                    .then((ttx) => {
                        success("Transaction has been broadcast to node")
                        ttx.wait()
                            .then(res=>{
                                success("Transaction Send Successful trx id : "+res.transactionHash)
                                console.log(res)
                                console.log("trx hash "+res.transactionHash)
                            })
                            .catch(error=>{
                                //console.log(error.message)
                                err(error.message)
                            })
                    })
                    .catch(error=>{
                        console.log(error)
                        err(error.message)
                    })
            }else {
                err(symbol+" balance not enough")
            }


        }else{
            const ethbalance = await provider.getBalance(address);
            console.log("Matic Balance : ",ethers.utils.formatEther(ethbalance));
            const tx = {
                from: address,//wallet.address,
                to: raddress,
                value: ethers.utils.parseUnits(amount, 'ether').toHexString(),
                gasLimit: ethers.utils.hexlify(21000),
                gasPrice: feeData.gasPrice
            }
            if(parseFloat(ethers.utils.formatEther(ethbalance))>parseFloat(amount)){
                wallet.sendTransaction(tx)
                    .then((ttx) => {
                        success("Transaction has been broadcast to node")
                        ttx.wait()
                            .then(res=>{
                                success("Transaction Send Successful trx id : "+res.transactionHash)
                                console.log(res)
                                console.log("trx hash "+res.transactionHash)
                            })
                            .catch(error=>{
                                //console.log(error.message)
                                err(error.message)
                            })
                    })
                    .catch(error=>{
                        console.log(error.message)
                        err(error.message)
                    })
            }else {
                err(symbol+" balance not enough")
            }
        }
    }else if(platform=="Cronos"){
       const key1 = decoded.key1
        const provider = new ethers.providers.JsonRpcProvider('https://evm-cronos.crypto.org', { name: 'cronos', chainId: 25 })
        let wallet = new ethers.Wallet(key1,provider);
        var address = wallet.address
        if(type=="Token"){
            let contract = new ethers.Contract(token_contract, token_abi, wallet)
            var decdynamic = await contract.decimals()
            const ercbalance = await contract.balanceOf(address)
            const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
            console.log("CRO Token Balance : ",tokenbal)
            let numberOfTokens = ethers.utils.parseUnits(amount,decdynamic)
            if(parseFloat(tokenbal)>parseFloat(amount)){
                contract.transfer(raddress, numberOfTokens)
                    .then((ttx) => {
                        success("Transaction has been broadcast to node")
                        ttx.wait()
                            .then(res=>{
                                success("Transaction Send Successful trx id : "+res.transactionHash)
                                console.log(res)
                                console.log("trx hash "+res.transactionHash)
                            })
                            .catch(error=>{
                                //console.log(error.message)
                                err(error.message)
                            })
                    })
                    .catch(error=>{
                        console.log(error)
                        err(error.message)
                    })
            }else {
                err(symbol+" balance not enough")
            }

        }else{
            const ethbalance = await provider.getBalance(address);
            console.log("CRO Balance : ",ethers.utils.formatEther(ethbalance));
            const tx = {
                from: address,//wallet.address,
                to: raddress,
                value: ethers.utils.parseUnits(amount, 'ether').toHexString(),
                gasLimit: ethers.utils.hexlify(21000),
            }
            if(parseFloat(ethers.utils.formatEther(ethbalance))>parseFloat(amount)){
                wallet.sendTransaction(tx)
                    .then((ttx) => {
                        success("Transaction has been broadcast to node")
                        ttx.wait()
                            .then(res=>{
                                success("Transaction Send Successful trx id : "+res.transactionHash)
                                console.log(res)
                                console.log("trx hash "+res.transactionHash)
                            })
                            .catch(error=>{
                                //console.log(error.message)
                                err(error.message)
                            })
                    })
                    .catch(error=>{
                        console.log(error.message)
                        err(error.message)
                    })
            }else {
                err(symbol+" balance not enough")
            }
        }
    }else if(platform=="Fantom"){
       const key1 = decoded.key1
        const provider = new ethers.providers.JsonRpcProvider('https://fantom.drpc.org', { name: 'Fantom Opera', chainId: 250 })
        let wallet = new ethers.Wallet(key1,provider);
        var address = wallet.address
        const feeData = await provider.getFeeData()
        if(type=="Token"){
            let contract = new ethers.Contract(token_contract, token_abi, wallet)
            var decdynamic = await contract.decimals()
            const ercbalance = await contract.balanceOf(address)
            const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
            console.log("FTM Token Balance : ",tokenbal)
            let numberOfTokens = ethers.utils.parseUnits(amount,decdynamic)
            if(parseFloat(tokenbal)>parseFloat(amount)){
                contract.transfer(raddress, numberOfTokens, { gasPrice: feeData.gasPrice })
                    .then((ttx) => {
                        success("Transaction has been broadcast to node")
                        ttx.wait()
                            .then(res=>{
                                success("Transaction Send Successful trx id : "+res.transactionHash)
                                console.log(res)
                                console.log("trx hash "+res.transactionHash)
                            })
                            .catch(error=>{
                                //console.log(error.message)
                                err(error.message)
                            })
                    })
                    .catch(error=>{
                        console.log(error)
                        err(error.message)
                    })
            }else {
                err(symbol+" balance not enough")
            }

        }else{
            const ethbalance = await provider.getBalance(address);
            console.log("Fantom Balance : ",ethers.utils.formatEther(ethbalance));
            const tx = {
                from: address,//wallet.address,
                to: raddress,
                value: ethers.utils.parseUnits(amount, 'ether').toHexString(),
                gasLimit: ethers.utils.hexlify(21000),
                gasPrice: feeData.gasPrice
            }
            if(parseFloat(ethers.utils.formatEther(ethbalance))>parseFloat(amount)){
                wallet.sendTransaction(tx)
                    .then((ttx) => {
                        success("Transaction has been broadcast to node")
                        ttx.wait()
                            .then(res=>{
                                success("Transaction Send Successful trx id : "+res.transactionHash)
                                console.log(res)
                                console.log("trx hash "+res.transactionHash)
                            })
                            .catch(error=>{
                                err(error.message)
                            })
                    })
                    .catch(error=>{
                        console.log(error.message)
                        err(error.message)
                    })
            }else {
                err(symbol+" balance not enough")
            }
        }
    }else if(platform=="Avalanche"){
       const key1 = decoded.key1
        const provider = new ethers.providers.JsonRpcProvider('https://avax.meowrpc.com', { name: 'avalanche', chainId: 43114 })
        let wallet = new ethers.Wallet(key1,provider);
        var address = wallet.address
        if(type=="Token"){
            let contract = new ethers.Contract(token_contract, token_abi, wallet)
            var decdynamic = await contract.decimals()
            const ercbalance = await contract.balanceOf(address)
            const tokenbal =await ethers.utils.formatUnits(ercbalance, decdynamic)
            console.log("AVAX Token Balance : ",tokenbal)
            let numberOfTokens = ethers.utils.parseUnits(amount,decdynamic)
            if(parseFloat(tokenbal)>parseFloat(amount)){
                contract.transfer(raddress, numberOfTokens)
                    .then((ttx) => {
                        success("Transaction has been broadcast to node")
                        ttx.wait()
                            .then(res=>{
                                success("Transaction Send Successful trx id : "+res.transactionHash)
                                console.log(res)
                                console.log("trx hash "+res.transactionHash)
                            })
                            .catch(error=>{
                                err(error.message)
                            })
                    })
                    .catch(error=>{
                        console.log(error)
                        err(error.message)
                    })
            }else {
                err(symbol+" balance not enough")
            }

        }else{
            const ethbalance = await provider.getBalance(address);
            console.log("Avax Balance : ",ethers.utils.formatEther(ethbalance));
            const tx = {
                from: address,//wallet.address,
                to: raddress,
                value: ethers.utils.parseUnits(amount, 'ether').toHexString(),
                gasLimit: ethers.utils.hexlify(21000),
            }
            if(parseFloat(ethers.utils.formatEther(ethbalance))>parseFloat(amount)){
                wallet.sendTransaction(tx)
                    .then((ttx) => {
                        success("Transaction has been broadcast to node")
                        ttx.wait()
                            .then(res=>{
                                success("Transaction Send Successful trx id : "+res.transactionHash)
                                console.log(res)
                                console.log("trx hash "+res.transactionHash)
                            })
                            .catch(error=>{
                                err(error.message)
                            })
                    })
                    .catch(error=>{
                        console.log(error.message)
                        err(error.message)
                    })
            }else {
                err(symbol+" balance not enough")
            }
        }
    }else if(platform=="Tron"){
       const key1 = decoded.key1
        const tronWeb = new TronWeb({
            fullHost: 'https://api.trongrid.io',
            eventServer: 'https://api.someotherevent.io', privateKey: key1}
        )
        const address = await tronWeb.defaultAddress["base58"];
        console.log("TRON",address)
        if(type=="Token"){
            let contract = await tronWeb.contract().at(token_contract);
            //let result = await contract.name().call();
            //console.log(result)
            let result1 = await contract.balanceOf(address).call();
            let balan = tronWeb.fromSun(result1["_hex"]).toString()
            console.log('Balance of trc20  : ',balan );
            if(parseFloat(balan)>parseFloat(amount)){
                var amount = tronWeb.toHex(amount.toString()+"e"+decimal.toString())
                var parameter = [{type:'address',value:raddress},{type:'uint256',value:amount}]
                var options = {feeLimit:100000000}
                const transactionObject = await tronWeb.transactionBuilder.triggerSmartContract(
                    token_contract, "transfer(address,uint256)", options, parameter)
                var signedTransaction = await tronWeb.trx.sign(transactionObject.transaction)
                await tronWeb.trx.sendRawTransaction(signedTransaction)
                    .then(res=>{
                        console.log(res["txid"])
                        success("Transaction has been broadcast to node trx id : "+res.txid)
                    })
                    .catch(error=>{
                        console.log(error)
                        err(symbol+" Balance not enough")
                    })
            }else {
                err(symbol+" Balance not enough")
            }

        }else{
            var bal =0;
            await tronWeb.trx.getAccount(address)
                .then(output => {
                    bal= tronWeb.fromSun(output.balance).toString()
                    console.log('TRX Balance:', tronWeb.fromSun(output.balance).toString(), '\n');
                    console.log("Tron Address : ",address)
                    var amount1 = tronWeb.toHex(amount.toString()+"e6")
                    tronWeb.trx.sendTransaction(raddress, amount1,key1)
                        .then(res=>{
                            success("Transaction has been broadcast to node trx id : "+res.txid)
                            console.log(res.txid)
                        })
                        .catch(error=>{
                            console.log(error)
                            err(symbol+" Balance not enough")
                        })
                })
                .catch(err=>{
                    console.log(err)
                })
        }

    }


}

export default sendTocrypto;