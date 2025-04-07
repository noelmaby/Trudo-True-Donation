import React, { useState,useEffect } from "react";
import {Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

import Navbar from "./Header";
import "./css/fontawesome.css";
import "./css/index.css";
import "./css/owl.css";
import "./css/animate.css";
import contractFunctions from "../../js/main.js";

import shieldlock from "./images/shield-lock.svg";
import transperancy from "./images/transparency.svg";
import graphup from "./images/graph-up-arrow.svg";
import cashcoin from "./images/cash-coin.svg";

const Mainpage = () => {
  const navigate = useNavigate();

  const [nft, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cached data with error handling
  useEffect(() => {
    try {
      const cachedNfts = sessionStorage.getItem('cachedNfts');
      if (cachedNfts) {
        const parsedData = JSON.parse(cachedNfts);
        if (Array.isArray(parsedData)) {
          setData(parsedData);
        }
      }
    } catch (err) {
      console.error('Error loading cached data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await contractFunctions.singleNFTInfoGenerator();
        
        if (!mounted) return;
        
        if (Array.isArray(result) && result.length > 0) {
          setData(result);
          try {
            sessionStorage.setItem('cachedNfts', JSON.stringify(result));
          } catch (err) {
            console.error('Failed to cache data:', err);
          }
        } else {
          throw new Error('No valid data received');
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };
    
    if (!sessionStorage.getItem('cachedNfts')) {
      fetchData();
    }
    
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) return(
    <>
    <div className="loading">
      <h3>Loading</h3>
      <ReactLoading id="icon" type="cylon" color="#0071f8" height={100} width={50} />
    </div>
    </>
  ) 
  if (error) return <div class="loading">Error: {error}</div>;

  const handleViewAll = () => {
    // Remove cached data if you want to force a new fetch from main.js
    sessionStorage.removeItem('cachedNfts');
    // Reload the page to run all useEffects again
    window.location.reload();
  };

  return (
    <>
      {/* Preloader */}

      <Navbar></Navbar>

      {/* Main Banner */}
      <div className="main-banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 align-self-center">
              <div className="caption header-text">
                <h6>Welcome to Trudo</h6>
                <h2>TRUE DONATIONS!</h2>
                <p>
                  Trudo is a free, blockchain-powered donation platform designed
                  to transform the world of online giving. With Trudo, donors
                  can securely support verified charitable campaigns while
                  receiving unique NFTs as rewards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <a href="#">
                <div className="item">
                  <div className="image">
                    <img src={shieldlock} alt="" style={{ maxWidth: "44px" }} />
                  </div>
                  <h4>Secure Donations</h4>
                </div>
              </a>
            </div>
            <div className="col-lg-3 col-md-6">
              <a href="#">
                <div className="item">
                  <div className="image">
                    <img
                      src={transperancy}
                      alt=""
                      style={{ maxWidth: "44px" }}
                    />
                  </div>
                  <h4>Transparent Transactions</h4>
                </div>
              </a>
            </div>
            <div className="col-lg-3 col-md-6">
              <a href="#">
                <div className="item">
                  <div className="image">
                    <img src={graphup} alt="" style={{ maxWidth: "44px" }} />
                  </div>
                  <h4>Increased Trust</h4>
                </div>
              </a>
            </div>
            <div className="col-lg-3 col-md-6">
              <a href="#">
                <div className="item">
                  <div className="image">
                    <img src={cashcoin} alt="" style={{ maxWidth: "44px" }} />
                  </div>
                  <h4>Improved Fundraising</h4>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Most Played Section */}
      <div className="section most-played">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-heading">
                <h2>Popular NFTs</h2>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="main-button">
              <a href="#" onClick={handleViewAll}>View All</a>
              </div>
            </div>

            <div className="row g-4">
  {nft.map((item, index) => (
    <div className="col-lg-3 col-md-6 col-sm-12" key={index}>
      <div className="item">
        <div className="thumb">
          <Link to="/nftpage" state={{ nft: item }}>
            <img src={item.imageUrl} alt="" />
          </Link>
        </div>
        <div className="down-content">
          <span className="category">{item.campaignname}</span>
          <h4>needs your support</h4>
          <Link to="/nftpage" state={{ nft: item }} className="explore-link">Explore</Link>
        </div>
      </div>
    </div>
  ))}
</div>
</div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="col-lg-12">
            <p>
              Copyright © 2024 Trudo NFT Campaign Company. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Mainpage;
