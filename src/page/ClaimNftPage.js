import React, { Component } from 'react'
import Axios from 'axios';
import AppUrl from '../AppUrl/ApiUrl';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { toast } from 'react-toastify';
import SkeletonCard from '../components/SkeletonCard';

export default class ClaimNftPage extends Component {

    constructor(){
        super();
        this.state = {
            data: [],
            token: '',
            isLoading: true,
            error: null,
            isSubmitting: false
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('authtoken');
        this.setState({ token: token });

        try {
            const response = await Axios.get(AppUrl.baseurl + "collectibles");
            // Check if response.data and response.data.collectibles exist
            if (response.data && response.data.collectibles) {
                this.setState({ 
                    data: response.data.collectibles, 
                    isLoading: false 
                });
            } else {
                throw new Error("Invalid data format received");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            this.setState({ 
                isLoading: false,
                error: "Failed to load collectibles",
                data: [] // Initialize with empty array to prevent undefined
            });
        }
    }

    onCollectibleClick = (collectible_id) => {
        this.setState({ isSubmitting: true }); // Set loading state
        const { token } = this.state;
        const formData = new FormData();
        formData.append('token', token);
        formData.append('collectible_id', collectible_id);

        Axios.post(AppUrl.baseurl + "collect", formData)
            .then((response) => {
                this.setState({ isSubmitting: false }); // Reset loading state

                if (response.data.success) {
                    toast.success(response.data.success);
                    this.props.history.push("/mynft");
                    return;
                }

                if (response.data.message) {
                    switch (response.data.message) {
                        case "Collectible not found":
                        case "Collectible sold out":
                        case "Wallet not found for this currency":
                        case "Insufficient balance":
                        case "Already collected":
                            toast.warning(response.data.message);
                            break;
                        default:
                            toast.info(response.data.message);
                    }
                    return;
                }

                if (response.data.error) {
                    toast.error(response.data.error);
                    return;
                }
            })
            .catch((error) => {
                this.setState({ isSubmitting: false }); // Reset loading state
                console.error("Error claiming collectible:", error);
                
                if (error.response) {
                    switch (error.response.status) {
                        case 400:
                            toast.error(error.response.data.error || "Invalid request parameters");
                            break;
                        case 401:
                            toast.error(error.response.data.error || "Authentication failed");
                            break;
                        case 404:
                            toast.error(error.response.data.error || "User not found");
                            break;
                        case 500:
                            toast.error(error.response.data.error || "Server error occurred");
                            break;
                        default:
                            toast.error(error.response.data.error || "Failed to claim collectible");
                    }
                } else {
                    toast.error("Network error occurred");
                }
            });
    }

    render() {
        const { isLoading, error, data = [] } = this.state; // Provide default empty array

        if (isLoading) {
            return <SkeletonCard/>;
        }

        if (error) {
            return <div className="error-message">{error}</div>;
        }

        // Check if data exists and has items
        if (!data || data.length === 0) {
            return <div className="error-message">No collectibles available</div>;
        }

        return (
            <>
                <title>NFT</title>
                <div className="badge-body">
                    {data.map((item, index) => (
                        <div key={index} className="badge-container" style={{minHeight:"100vh",height:"auto"}}>
                            <div className="badge-header">
                                <Link to="/airdrop" className="badge-back">
                                    <img src="/backbutton.png" alt="Back" className="badge-back-icon"/>
                                </Link>
                                <h1 className="badge-title text-center w-100">NFT</h1>
                            </div>
                            <div className="badge-icon-wrapper text-center mb-4">
                                <img src={item.banner_img} alt="Badge Icon" className="badge-icon-nft "/>
                            </div>
                            <h1 className='text-primary fs-2 text-center mb-4'>Claim Zeros NFT now</h1>

                            <div className="badge-content"> 
                                <p className="badge-description">Claim Our Exclusive ZEROS NFT - Unlock Huge Rewards! 
                                    NFT Holders Will Receive Bonus Rewards From 20 Million ZEROS Tokens</p>
                            </div> 
                            <div className="badge-content"> 
                                <p className="badge-description text-danger">Note: Only One NFT Can Be Claimed Per Account, Make Sure To Use Your Airdrop Wallet To Secure Your NFT!</p>
                            </div>

                            <div className='d-flex justify-content-between align-items-center mb-4 px-3 py-2 border border-1 border-black rounded-3' style={{ position: 'relative' }}>
                                <div className='d-flex gap-2 align-items-center'>
                                    <img 
                                        src={item.coin_img} 
                                        alt="token img" 
                                        className="badge-nft-image"
                                        style={{ width: '50px', height: '50px', borderRadius: '100%' }}
                                    />
                                    <span>{item.coin_symbol}</span>
                                </div>
                                <div className='position-absolute start-50 translate-middle-x'>
                                    <span className='fw-bold'>{parseFloat(item.price).toFixed(4)}</span>
                                </div>
                            </div>

                            <button 
                                className={`btn w-100 mb-5 ${item.current_supply <= 0 ? 'btn-secondary' : 'btn-primary'}`}
                                onClick={() => this.onCollectibleClick(item.id)}
                                disabled={this.state.isSubmitting || item.current_supply <= 0}
                            >
                                {this.state.isSubmitting ? (
                                    <div className="d-flex align-items-center justify-content-center">
                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        Processing...
                                    </div>
                                ) : item.current_supply <= 0 ? (
                                    'Sold Out'
                                ) : (
                                    'Claim Zeros NFT'
                                )}
                            </button>

                            <p className='fs-5 fw-semibold mt-4'>How to Claim Your ZEROS NFT</p>

                            <p>Claiming our exclusive ZEROS NFT is quick and easy! Just follow the simple steps below:</p>
                            <ol>
                                <li>Visit the Claim Page: Go to our official NFT claim page.</li>
                                <li>Choose Your Payment Method: Pay using BNB - only $1 per NFT.</li>
                                <li>Confirm the Transaction: Click the Confirm button and wait a few moments for the transaction to process.</li>
                                <li>Receive Your NFT Instantly: Once the transaction is successful, your exclusive ZEROS NFT will be sent directly to your airdrop wallet!</li>
                                <li>To view the NFTs you own, simply click the "My NFT" button.</li>
                            </ol>
                        </div>
                    ))}
                </div>
            </>
        );
    }

}
