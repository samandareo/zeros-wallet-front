import React, { Component } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
// import Axios from 'axios'
import ApiUrl from '../AppUrl/ApiUrl'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { toast } from 'react-toastify'
import folderNFT from '../images/folder-nft.png'
export default class MyNftpage extends Component {
  state = {
    isLoading: true,
    data: []
  }
  //   data returns collections massive
  componentDidMount () {
    var token = localStorage.getItem('authtoken')
    if (!token) {
      this.props.history.push('/home')
    }

    axios
      .get(ApiUrl.baseurl + '/user/collectible?token=' + token)
      .then(res => {
        this.setState({ 
          data: res.data.collections,
          isLoading: false 
        })
        localStorage.setItem('myairdrop', JSON.stringify(res.data))
      })
      .catch(err => {
        toast('Something went wrong' + err.message)
        this.setState({ isLoading: false })
      })
  }

  render () {
    const { isLoading, data } = this.state;

    if (isLoading) {
      return (
        <div className="badge-body d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your NFTs...</p>
          </div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="badge-body d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="text-center">
        <img 
          src={folderNFT}
          alt="No NFTs" 
          style={{ width: '150px', marginBottom: '1.5rem', opacity: '0.7' }}
        />
        <h3 className="mb-3" style={{ color: '#6c757d' }}>No NFTs Found</h3>
        <p className="text-muted">You don't have any NFTs in your collection yet.</p>
        <Link 
          to="/airdrop" 
          className="btn btn-primary mt-3 px-4 rounded-pill"
        >
          Browse Airdrops
        </Link>
          </div>
        </div>
      );
    }

    return (
      <>
        <title>My NFT</title>

        <body className='badge-body'>
          <div
            className='badge-container'
            style={{ minHeight: '100vh', height: 'auto' }}
          >
            <div className='badge-header'>
              <Link to='/airdrop' className='badge-back'>
                <img
                  src='/backbutton.png'
                  alt='Back'
                  className='badge-back-icon'
                />
              </Link>
              <h1 className='badge-title text-center w-100'>My NFT</h1>
            </div>

            <div className='badge-icon-wrapper'>
              <img
                src={this.state?.data?.[0].banner_img}
                alt='Badge Icon'
                className='badge-icon object-fit-cover rounded-2'
                style={{
                  width: '80%',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '10px'
                }}
              />
            </div>

            <div className='my-3 bg-primary rounded-5' style={{height:'1px'}}></div>
            <ul className='text-decoration-node list-unstyled'>
              {this?.state?.data?.map((v, index) => (
                <li
                  key={index}
                  className='d-flex justify-content-between align-items-center mb-3'
                >
                  <div className='d-flex align-items-center w-100'>
                    <img
                      src={v.image_url}
                      alt='NFT'
                      className='badge-icon'
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <span className='fw-semibold mx-4 flex-grow-1'>{v.name}</span>
                    <span className='fw-semibold'>1 NFT</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </body>
      </>
    )
  }
}
