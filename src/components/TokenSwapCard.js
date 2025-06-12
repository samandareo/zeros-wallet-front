import { useEffect, useState, useRef } from 'react';
import styles from '../style/TokenSwapCard.module.css';
import swapperIcon from '../images/token-swap-swapper.png';
import zeros from '../images/zeros-wallet.png';
import solana from '../images/solana.png';
import usdt from '../images/usdt-icon.png';
import CustomDropdown from './CustomDropdown';

export default function TokenSwapCard({balances}) {
    const conversionRate = 0.06;
    const tokens = [
        { name: "Zeros", symbol: "ZRS", icon: zeros },
        { name: "Solana", symbol: "SOL", icon: solana },
        { name: "USDT", symbol: "USDT", icon: usdt }
    ];

    const [fromToken, setFromToken] = useState("ZRS");
    const [toToken, setToToken] = useState("ZRS");
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [lastChangedInput, setLastChangedInput] = useState('from');

    let fromState = {
        token: fromToken,
        amount: fromAmount === "" ? 0 : parseFloat(fromAmount),
        balance: balances[fromToken] || 0  // Add fallback here
    };

    let toState = {
        token: toToken,
        amount: toAmount === "" ? 0 : parseFloat(toAmount),
        balance: balances[toToken] || 0
    };

    useEffect(() => {
        if (fromState.token === toState.token) {
            if (lastChangedInput === 'from') {
                setToAmount(fromState.amount.toString());
            } else {
                setFromAmount(toState.amount.toString());
            }
        } else {
            if (lastChangedInput === 'from') {
                if (fromState.token === "ZRS" && (toState.token === "USDT" || toState.token === "SOL")) {
                    const conversion = fromState.amount * conversionRate;
                    setToAmount(isNaN(conversion) ? "" : conversion.toFixed(2).toString());
                } else if ((fromState.token === "USDT" || fromState.token === "SOL") && toState.token === "ZRS") {
                    const conversion = fromState.amount / conversionRate;
                    setToAmount(isNaN(conversion) ? "" : conversion.toFixed(2).toString());
                } else {
                    setToAmount(fromState.amount.toString());
                }
            } else {
                if (toState.token === "ZRS" && (fromState.token === "USDT" || fromState.token === "SOL")) {
                    const conversion = toState.amount * conversionRate;
                    setFromAmount(isNaN(conversion) ? "" : conversion.toFixed(2).toString());
                } else if ((toState.token === "USDT" || toState.token === "SOL") && fromState.token === "ZRS") {
                    const conversion = toState.amount / conversionRate;
                    setFromAmount(isNaN(conversion) ? "" : conversion.toFixed(2).toString());
                } else {
                    setFromAmount(toState.amount.toString());
                }
            }
        }
    }, [fromState.token, fromState.amount, toState.token, toState.amount, lastChangedInput]);

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
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Only allow numbers, decimal point, and empty string
                                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                        setFromAmount(value);
                                        setLastChangedInput('from');
                                    }
                                }}
                                onKeyPress={(e) => {
                                    // Prevent non-numeric characters from being typed
                                    if (!/[\d.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                        e.preventDefault();
                                    }
                                }}
                                style={{width: "100%", border: "none", outline: "none", fontSize: "20px"}}
                            />
                        <CustomDropdown tokens={tokens} selected={fromToken} onChange={setFromToken} />
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
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Only allow numbers, decimal point, and empty string
                                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                        setToAmount(value);
                                        setLastChangedInput('to');
                                    }
                                }}
                                onKeyPress={(e) => {
                                    // Prevent non-numeric characters from being typed
                                    if (!/[\d.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                        e.preventDefault();
                                    }
                                }}
                                style={{width: "100%", border: "none", outline: "none", fontSize: "20px"}}
                            />
                            <CustomDropdown tokens={tokens} selected={toToken} onChange={setToToken} />
                        </div>
                    </div>
                    
                    <div style={{display: "flex", justifyContent: "space-between", backgroundColor: "#D0E2F1", borderRadius: "5px", padding: "8px 16px", color: "#1877D1", fontWeight: 600, fontSize: "14px", marginTop: "30px", marginBottom: "10px", width: "100%"}}>
                        <span>conversion rate</span>
                        <span>1 zeros = 0.06$</span>
                    </div>
                </div>
            </div>

            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "40px"
            }}>
                <div style={{width: "100%", textAlign: "center", padding: "15px", backgroundColor: "#022F64", borderRadius: "10px" ,color: "#fff"}}
                >Swap Zeros</div>
            </div>
        </div>
    )
}