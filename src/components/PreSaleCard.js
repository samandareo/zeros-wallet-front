import BNBPrice from "./BNBPrice";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import presalestyle from "../style/PreSaleCard.module.css";
import ApiUrl from "../AppUrl/ApiUrl";
import { toast } from "react-toastify";

export default function PreSaleCard({token_price, token}) {
    const [amountBNB, setAmountBNB] = useState("");
    const [amountZRS, setAmountZRS] = useState("");
    const [lastChangedInput, setLastChangedInput] = useState('bnb');
    const [oneUSD, setOneUSD] = useState("Lodaing...");

    const [bnbAmount, setBnbAmount] = useState(0);
    const [zrsAmount, setZrsAmount] = useState(0);

    const [showPopup, setShowPopup] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState(null);


    useEffect(() => {
        if (lastChangedInput === 'zrs' && amountZRS) {
            const bnbAmount = parseFloat(amountZRS) * token_price;
            setAmountBNB(bnbAmount.toFixed(2));
        }else if (lastChangedInput === 'bnb' && amountBNB) {
            const zrsAmount = parseFloat(amountBNB) / token_price;
            setAmountZRS(zrsAmount.toFixed(2));
        } else {
            setAmountZRS("");
        }
    }, [amountBNB, amountZRS, token_price]);


    useEffect(() => {
        async function fetchBNBPrice() {
        try {
            const response = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
            );
            setOneUSD((1 / response.data.binancecoin.usd).toFixed(4));

        } catch (error) {
            console.error('Error fetching BNB price:', error);
        }
        }

        fetchBNBPrice();

        const interval = setInterval(fetchBNBPrice, 30000); // update every 30s
        return () => clearInterval(interval);
    }, [token_price]);


    const buyZeros = () => {
        if (amountBNB === "" || amountZRS === "") {
            toast.error("Please enter a valid amount of BNB and ZRS");
            return;
        }
        if (isNaN(amountZRS) || isNaN(amountBNB)) {
            toast.error("Please enter valid numeric values for BNB and ZRS");
            return;
        }
        if (parseFloat(amountBNB) < 1 || isNaN(amountBNB) || parseFloat(amountBNB) <= 0) {
            toast.error("Please enter a valid amount of BNB (minimum 1$)");
            return;
        }
        setBnbAmount(parseFloat(amountBNB) * parseFloat(oneUSD));
        setZrsAmount(parseFloat(amountZRS));
        setShowPopup(true);
    }

    const purchaseZeros = () => {
        var formData = new FormData();
        formData.append("token", token);
        formData.append("bnb", bnbAmount);
        formData.append("zrs", amountZRS);

        axios.post(ApiUrl.baseurl + "presale", formData)
            .then(response => {
                if (response.data.success) {
                    setShowPopup(false);
                    setPurchaseStatus("success");
                    toast.success("Purchase successful!");
                    setAmountBNB("");
                    setAmountZRS("");
                } else {
                    setShowPopup(false);
                    if (response.data.error === "Insufficient BNB balance") {
                        toast.error("Insufficient BNB balance in your wallet");
                    } else {
                        toast.error("Purchase failed. Please try again.");
                    }
                }
            })
            .catch(error => {
                setShowPopup(false);
                if (error.response && error.response.data && error.response.data.error === "Insufficient BNB balance") {
                    toast.error("Insufficient BNB balance in your wallet");
                } else {
                    toast.error("An error occurred while processing your purchase.");
                    toast.warning(`${error}`, { 
                        autoClose: 5000, 
                        position: "top-right", 
                        closeOnClick: true, 
                        pauseOnHover: true, 
                        draggable: true, 
                        style: {color: "black"} 
                    });
                }
            });
    }
    return (
        <div className="d-flex flex-column" style={{gap: "70px"}}>
            {purchaseStatus !== "success" ? (
                <>
                    <div className="d-flex flex-column gap-4">
                        <div className="d-flex flex-column gap-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <label for="bnb" style={{fontSize: "16px", fontWeight: 550}} id="">BNB You Pay</label>
                                <span className="d-flex gap-2">1$ ~ {oneUSD !== null ? oneUSD : "Loading..."}</span>
                            </div>
                            <input type="text" placeholder="Enter amount dollar (minimum 1$)" value={amountBNB} style={{border: "1px solid #022F64", borderRadius: "25px", padding: "10px 20px", background: "None", outline: "None", color: "#022F64"}} id="bnb"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Only allow numbers, decimal point, and empty string
                                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                        setAmountBNB(value);
                                        setLastChangedInput('bnb');
                                    }
                                }}
                                onKeyPress={(e) => {
                                    // Prevent non-numeric characters from being typed
                                    if (!/[\d.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </div>
                        <div className="d-flex flex-column gap-2">
                            <label for="zrs" style={{fontSize: "16px", fontWeight: 550}} id="">Zeros You Receive</label>
                            <input type="text" placeholder="You will receive Zeros" value={amountZRS} style={{border: "1px solid #022F64", borderRadius: "25px", padding: "10px 20px", background: "None", outline: "None", color: "#022F64"}} id="zrs"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Only allow numbers, decimal point, and empty string
                                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                        setAmountZRS(value);
                                        setLastChangedInput('zrs');
                                    }
                                }}
                                onKeyPress={(e) => {
                                    // Prevent non-numeric characters from being typed
                                    if (!/[\d.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <button className="btn btn-primary w-100" style={{background: "#1877D1", borderRadius: "10px", padding: "10px 20px", color: "#fff", fontWeight: 600}} onClick={buyZeros}>
                            Buy Zeros
                        </button>
                    </div>

                    {/* Popup Modal */}
                    {showPopup && (
                        <div style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1000
                        }} onClick={()=> setShowPopup(false)} >
                            <div style={{
                                backgroundColor: "#fff",
                                padding: "30px",
                                borderRadius: "15px",
                                textAlign: "center",
                                maxWidth: "400px",
                                width: "90%",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                                position: "relative"
                            }}>
                                <span style={{position: "absolute", top:20, right:20, cursor: "pointer"}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                                </span>
                                <div style={{fontSize: "24px", marginBottom: "15px"}}>🧮</div>
                                <h3 style={{margin: "0 0 10px 0", color: "#333", fontSize: "20px"}}>Confirmation</h3>
                                <p style={{margin: "0 0 25px 0", color: "#666", fontSize: "16px"}}>
                                    You are buying {zrsAmount} ZRS tokens for ${amountBNB}. This will result in {bnbAmount} BNB being deducted from your wallet.
                                </p>
                                <button
                                    className={presalestyle.confirmBtn}
                                    onClick={purchaseZeros}
                                    style={{
                                        backgroundColor: "#022F64",
                                        color: "#fff",
                                        border: "none",
                                        padding: "12px 24px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "500"
                                    }}
                                >
                                    Confirm Purchase
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div style={
                    {
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "50px",
                        backgroundColor: "#fff",
                        borderRadius: "15px",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                    }
                }>
                    <h4 style={{fontWeight: 600, color: "#1877D1", textAlign: "center"}}>Successful</h4>
                    <p style={{textAlign: "center", color: "#1877D1"}}>We’re pleased to inform you that your Zeros Token pre-sale transaction has been successfully procesed. Your airdrop wallet has been credited accordingly.</p>
                    <Link to="/wallet" style={{textDecoration: "none", width:"60%", padding: "10px 20px", background: "#1877D1", color: "#fff", borderRadius: "10px", display: "inline-block", fontWeight: 600, textAlign: "center"}}>
                        Go Airdrop Wallet
                    </Link>
                </div>
            )}

        </div>
    )
}