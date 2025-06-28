import { useEffect, useState, useRef } from 'react';
import styles from '../style/TokenSwapCard.module.css';
import swapperIcon from '../images/token-swap-swapper.png';
import zeros from '../images/zeros-wallet.png';
import solana from '../images/solana.png';
import usdt from '../images/usdt-icon.png';
import CustomDropdown from './CustomDropdown';
import axios from 'axios';
import ApiUrl from "../AppUrl/ApiUrl";
import { toast } from 'react-toastify';
import "../style/SpinAnimation.module.css"

export default function TokenSwapCard({balances, token}) {
    const conversionRate = 0.06;
    const tokens = [
        { name: "Zeros", symbol: "ZRS", icon: zeros },
        { name: "Solana", symbol: "SOL", icon: solana },
        { name: "USDT", symbol: "USDT", icon: usdt }
    ];

    const [fromToken, setFromToken] = useState("ZRS");
    const [toToken, setToToken] = useState("SOL");
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [lastChangedInput, setLastChangedInput] = useState('from');
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [solanaCurrency, setSolanaCurrency] = useState(0.0);
    const [bnbCurrency, setBnbCurrency] = useState(0.0);
    const lastChangedPrice = useRef(0);


    useEffect(() => {
        // Function to fetch SOL price
        const fetchSolPrice = async () => {
            try {
                const sol = await axios.get('https://coincodex.com/api/coincodex/get_coin/sol');
                const bnb = await axios.get('https://coincodex.com/api/coincodex/get_coin/bnb')
                setSolanaCurrency(sol.data.last_price_usd);
                setBnbCurrency(bnb.data.last_price_usd);
                // Update ref to trigger conversion recalculation
                lastChangedPrice.current = sol.data.last_price_usd;
                console.log('Updated SOL price:', sol.data.last_price_usd);
            } catch (error) {
                console.error('Error fetching SOL price:', error);
            }
        };

        fetchSolPrice();

        const interval = setInterval(fetchSolPrice, 10000);

        return () => clearInterval(interval);
    }, []);

    let fromState = {
        token: fromToken,
        amount: fromAmount === "" ? 0 : parseFloat(fromAmount),
        balance: balances[fromToken] || 0
    };

    let toState = {
        token: toToken,
        amount: toAmount === "" ? 0 : parseFloat(toAmount),
        balance: balances[toToken] || 0
    };

    const handleFromTokenChange = (selectedToken) => {
        setFromToken(selectedToken);
        if (selectedToken === toToken) {
            const availableTokens = tokens.filter(token => token.symbol !== selectedToken);
            setToToken(availableTokens[0].symbol);
        }
    };

    const handleToTokenChange = (selectedToken) => {
        setToToken(selectedToken);
        if (selectedToken === fromToken) {
            const availableTokens = tokens.filter(token => token.symbol !== selectedToken);
            setFromToken(availableTokens[0].symbol);
        }
    };

    useEffect(() => {
        const calculateConversion = (amount, fromToken, toToken) => {
            if (fromToken === toToken) return amount;
            
            const conversionMap = {
                'ZRS_USDT': amount * conversionRate,
                'ZRS_SOL': amount * conversionRate / parseFloat(solanaCurrency),
                'USDT_ZRS': amount / conversionRate,
                'SOL_ZRS': amount * solanaCurrency / conversionRate,
                'USDT_SOL': amount / solanaCurrency,
                'SOL_USDT': amount * solanaCurrency
            };

            const key = `${fromToken}_${toToken}`;
            const conversion = conversionMap[key];
            
            return isNaN(conversion) ? "" : conversion.toFixed(6).toString();
        };

        if (fromState.token === toState.token) {
            if (lastChangedInput === 'from') {
                setToAmount(fromState.amount.toString());
            } else {
                setFromAmount(toState.amount.toString());
            }
            return;
        }

        if (lastChangedInput === 'from' && fromAmount !== "") {
            const newAmount = calculateConversion(
                fromState.amount,
                fromState.token,
                toState.token
            );
            setToAmount(newAmount);
        } else if (toAmount !== "") {
            const newAmount = calculateConversion(
                toState.amount,
                toState.token,
                fromState.token
            );
            setFromAmount(newAmount);
        }
    }, [fromState.token, fromState.amount, toState.token, toState.amount, lastChangedInput, solanaCurrency, conversionRate]); // Added solanaCurrency

    const fillWithBalance = () => {
        const balance = balances[fromToken] || 0;
        setFromAmount(balance.toString());
        setLastChangedInput('from');
    }

    const swapFromTo = () => {
        const tempToken = fromState.token;
        const tempAmount = fromState.amount;
        setFromToken(toState.token);
        setFromAmount(toState.amount.toString());
        setToToken(tempToken);
        setToAmount(tempAmount.toString());
    }

    const handleSwapClick = async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        
        var formData = new FormData();
        formData.append("token", token)
        formData.append("fromToken", fromState.token)
        formData.append("toToken", toState.token)
        formData.append("fromAmount", fromState.amount)
        formData.append("toAmount", toState.amount)
        formData.append("fee", (1.1 / bnbCurrency).toFixed(4).toString())

        try {
            const response = await axios.post(ApiUrl.baseurl + "token-swap", formData);
            if (response.data.success) {
                toast.success(response.data.success)
            }
            setTimeout(
                () => window.location.reload(),
                3000
            )
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error)
            }
            setIsLoading(false);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", background: "#fff", width: "100%", borderRadius: "8px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)"}}>
                <h4 style={{fontWeight: 600, textAlign:"center"}}>Swap</h4>

                <div style={{width: "100%", display: "flex", flexDirection: "column", marginTop: "20px", gap: "20px", justifyContent: "center", alignItems: "center"}}>
                    <div>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <span style={{fontWeight: 600, color: "gray"}}>You pay</span>
                            <span style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                <span style={{fontWeight: 500, color: "gray"}}>Balance: {fromState.balance}</span>
                                <button style={{all: "unset", cursor: "pointer", color: "#1877D1", fontWeight: 600}} onClick={fillWithBalance}>Max</button>
                            </span>
                        </div>

                        <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", marginTop: "10px", border: "1px solid #1877D1", borderRadius: "10px", padding: "10px"}}>
                            <input
                                className={styles.noSpinner}
                                type="text"
                                placeholder="0.00"
                                value={fromAmount}
                                required
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                        setFromAmount(value);
                                        setLastChangedInput('from');
                                    }
                                }}
                                onKeyPress={(e) => {
                                    if (!/[\d.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                        e.preventDefault();
                                    }
                                }}
                                style={{width: "100%", border: "none", outline: "none", fontSize: "20px"}}
                            />
                        <CustomDropdown tokens={tokens} selected={fromToken} onChange={handleFromTokenChange} />
                        </div>
                    </div>

                    <div>
                        <img src={swapperIcon} alt="Swap Icon" style={{width: "50px", height: "50px"}} onClick={swapFromTo}/>
                    </div>

                    <div>
                        <div style={{display: "flex", justifyContent: "start", alignItems: "center"}}>
                            <span style={{fontWeight: 600, color: "gray"}}>You receive</span>
                        </div>

                        <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "5px", border: "1px solid #1877D1", borderRadius: "10px", padding: "10px"}}>
                            <input
                                className={styles.noSpinner}
                                type="text"
                                placeholder="0.00"
                                value={toAmount}
                                required
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                        setToAmount(value);
                                        setLastChangedInput('to');
                                    }
                                }}
                                onKeyPress={(e) => {
                                    if (!/[\d.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                        e.preventDefault();
                                    }
                                }}
                                style={{width: "100%", border: "none", outline: "none", fontSize: "20px"}}
                            />
                            <CustomDropdown tokens={tokens} selected={toToken} onChange={handleToTokenChange} />
                        </div>
                    </div>
                    
                    <div style={{display: "flex", justifyContent: "space-between", backgroundColor: "#D0E2F1", borderRadius: "5px", padding: "8px 16px", color: "#1877D1", fontWeight: 600, fontSize: "14px", marginTop: "30px", width: "100%"}}>
                        <span>conversion rate</span>
                        <span>1 zeros = 0.06$</span>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between", backgroundColor: "#D0E2F1", borderRadius: "5px", padding: "8px 16px", color: "#1877D1", fontWeight: 600, fontSize: "14px", marginBottom: "10px", width: "100%"}}>
                        <span>swap fee</span>
                        <span>1.1$ ~ {(1.1 / bnbCurrency).toFixed(4).toString()} BNB</span>
                    </div>
                </div>
            </div>

            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "40px"}}>
                <button 
                    onClick={handleSwapClick}
                    disabled={isLoading}
                    style={{
                        width: "100%", 
                        textAlign: "center", 
                        padding: "15px", 
                        backgroundColor: isLoading ? "#6B87AD" : "#022F64", 
                        borderRadius: "10px", 
                        color: "#fff",
                        border: "none",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        fontSize: "16px",
                        fontWeight: "500",
                        position: "relative",
                        transition: "background-color 0.3s"
                    }}
                >
                    {isLoading ? (
                        <>
                            <span style={{ opacity: 0 }}>Swap Zeros</span>
                            <div style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "20px",
                                height: "20px",
                                border: "3px solid #ffffff40",
                                borderTop: "3px solid #fff",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite"
                            }} />
                        </>
                    ) : (
                        "Swap Zeros"
                    )}
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
                }}>
                    <div style={{
                        backgroundColor: "#fff",
                        padding: "30px",
                        borderRadius: "15px",
                        textAlign: "center",
                        maxWidth: "400px",
                        width: "90%",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
                    }}>
                        <div style={{fontSize: "24px", marginBottom: "15px"}}>🛠️</div>
                        <h3 style={{margin: "0 0 10px 0", color: "#333", fontSize: "20px"}}>Coming Soon...</h3>
                        <p style={{margin: "0 0 25px 0", color: "#666", fontSize: "16px"}}>
                            This feature will be available in the next update.
                        </p>
                        <button 
                            onClick={closePopup}
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
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}