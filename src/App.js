/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { contractABI, celestiaAds } from "./utils/const.js";
import AddNFTForm from "./components/AddNFTForm";
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import { celestiaTokenABI, celestiaTokenAddress } from "./utils/cetToken";
import ReactSpeedometer from "react-d3-speedometer";

import "./App.css";

const App = () => {
  const [account, setAccount] = useState(null);
  const [celestiaAdsContract, setCelestiaAdsContract] = useState(null);
  const [cetTokenContract, setCetTokenContract] = useState(null);
  const [adScript, setAdScript] = useState("");
  const [clicks, setClicks] = useState(0);
  const [impressions, setImpressions] = useState(0);
  const [cetBalance, setCetBalance] = useState(0);
  const maxValue = 1000;
  const maxValue1 = 100;
  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);

        const accounts = await web3.eth.getAccounts();
        const instance = new web3.eth.Contract(contractABI, celestiaAds);
        const cetInstance = new web3.eth.Contract(
          celestiaTokenABI,
          celestiaTokenAddress
        );

        setAccount(accounts[0]);
        setCelestiaAdsContract(instance);
        setCetTokenContract(cetInstance);
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
    } else {
      console.log("MetaMask extension not found.");
    }
  };

  const handleButtonClick = async () => {
    if (celestiaAdsContract) {
      const adId = await celestiaAdsContract.methods.getRandomAd().call();
      const ad = {
        id: adId[0],
        name: adId[1],
        description: adId[2],
        pinataCID: adId[3],
      };
      const url = `https://ipfs.io/ipfs/${ad.pinataCID}`;

      const script = `<script>
        window.addEventListener('DOMContentLoaded', (event) => {
          const adContainer = document.getElementById('ad-container');
          if(adContainer){
            adContainer.innerHTML = '<iframe src="${url}" width="600" height="300"></iframe>';
          }
        });
      </script>`;

      console.log(script);
      setAdScript(script);
    }
  };

  const handleAddNFT = async ({ name, description, pinataCID }) => {
    if (celestiaAdsContract) {
      await celestiaAdsContract.methods
        .addNft(name, description, pinataCID)
        .send({ from: account });
      alert("NFT added");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAdStats = async () => {
    const adClicks = await celestiaAdsContract.methods
      .referrerClicks(account)
      .call();
    const adImpressions = await celestiaAdsContract.methods
      .referrerImpressions(account)
      .call();
   const balance = await cetTokenContract.methods.balanceOf(account).call();
    setClicks(Number(adClicks));
    setImpressions(Number(adImpressions));
    setCetBalance(Number(balance));
  };
  useEffect(() => {
    if (celestiaAdsContract && cetTokenContract && account) {
      fetchAdStats();
    }
  }, [celestiaAdsContract, cetTokenContract, account, fetchAdStats]);

  return (
    <div className="App">
      <Navbar />
      {account ? (
        <div>
          <p className="account">Connected account: {account}</p>
          <div className="welcome">
            Bringing Celestia Layer 2 Blockchain to you Using <br />
            NFT-Powered Ads
          </div>
          <div className="ad-stats-container">
            <div className="grid-column">
              <div className="grid-box">
                1Million+ <br /> Users
              </div>
              <div className="grid-box">
                $10Mil <br /> Paid
              </div>
              <div className="grid-box">
                77+ <br /> Countries
              </div>
              <div className="grid-box">
                Over 5 <br /> Continents
              </div>
            </div>
            <div className="stats-column ">
              <div className="impress">
                <ReactSpeedometer
                  maxValue={maxValue1}
                  value={clicks}
                  currentValueText={`Clicks: ${clicks}`}
                  width={300}
                  height={175}
                  needleHeightRatio={0.7}
                  segments={5}
                  startColor="#013655"
                  endColor="#0b2230"
                  textColor="#ffffff"
                />
                <ReactSpeedometer
                  maxValue={maxValue}
                  value={impressions}
                  currentValueText={`Impressions: ${impressions}`}
                  width={300}
                  height={175}
                  needleHeightRatio={0.7}
                  segments={5}
                  startColor="#013655"
                  endColor="#0b2230"
                  textColor="#ffffff"
                />
              </div>{" "}
              <div className="comp">
                <p className="token">CET Token Balance: {cetBalance}</p>
              </div>{" "}
            </div>
          </div>
          <div className="form">
            <AddNFTForm onAddNFT={handleAddNFT} />
          </div>
          <div className="get">
            <button onClick={handleButtonClick} className="get">
              Get Random Ad
            </button>
            <textarea value={adScript} readOnly />
          </div>
          <div>
            {" "}
            <Footer />
          </div>
        </div>
      ) : (
        <p className="connect">Please connect your Celestia Wallet Address.</p>
      )}
    </div>
  );
};

export default App;
