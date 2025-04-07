import React, { useState } from "react";
import {useLocation } from "react-router-dom";
import "./createcamp.css";
import { AnimatePresence, motion } from 'framer-motion';
import { PinataSDK } from "pinata-web3";
import contractFunctions from "../../js/main.js"
import { ethers } from 'ethers';

const CreateCam = () => {
  const location = useLocation();
 
  
  console.log(typeof(address));
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
 
  const [tokenprice, setTokenprice] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [imageFile, setImageFile] = useState();

  const handleImageChange = (event) => {
    const file1 = event.target.files[0];
    setImageFile(file1);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  // const [campaignCreate] = contractFunctions;
  console.log("Campaign Name:", campaignName);
  console.log("Description:", description);
 
  console.log("Token Price", tokenprice);
  console.log("Target Amount (ETH):", targetAmount);
  console.log("Selected Image File:", imageFile);

  const pinata = new PinataSDK({
    pinataJwt:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkOTBhNjJkZi02MmNkLTRlY2EtODM4MC1mYTZjMzEyYTFmYjUiLCJlbWFpbCI6Im5vZWxtYW5qYXlpbGFieUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYWVjMDU1YzhjNDhhNGRmZTlhNjAiLCJzY29wZWRLZXlTZWNyZXQiOiIzM2NiNTczYWRjNjI3YTEyNzkyOTYyNWRmOGVlNGI2NmM1YjA2MzQwNTdhNDFmZDgyM2M0MDc1YTk2ZGYxY2ViIiwiZXhwIjoxNzY3NDE1OTYwfQ.qpU8V6_33q_MbA2A7-zQTkap6ddUPXQy9R_k5IzidNM",
    pinataGateway: "silver-worrying-wolverine-936.mypinata.cloud",
  });

  async function getMetadata() {
    try {
      const blob = new Blob([imageFile], { type: imageFile.type });
      const imgfile = new File([blob], imageFile.name, { type: blob.type });
      const imgupload = await pinata.upload.file(imgfile);
      const iphash = imgupload.IpfsHash;
      const imageurl = `https://gateway.pinata.cloud/ipfs/${iphash}`;
      return imageurl;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  async function uploadmeta(imageurl) {
    try {
      const uploadMetadata = await pinata.upload.json({
        campaignname: campaignName,
        descriptioncam: description,
        imageUrl: imageurl,
      });
      const iphash2 = uploadMetadata.IpfsHash;
      const metadata = `https://gateway.pinata.cloud/ipfs/${iphash2}`;
      console.log(metadata);
      return metadata;
    } catch (error) {
      console.error("Error uploading metadata:", error);
    }
  }

  async function createCampaign() {
    try{
      const imageurl = await getMetadata();
      var metaData = "";
      if (imageurl) {
        metaData = await uploadmeta(imageurl);
        if(metaData === ""){
          throw new Error("Metadata is empty");
        }
      }
      const tokenpriceWei = ethers.parseEther(tokenprice);
      const targetAmountWei = ethers.parseEther(targetAmount);
      await contractFunctions.campainCreate("0x46EAb8c6B889aD0d0dFbE2a5628Ef5D48154F0E7",tokenpriceWei,metaData,targetAmountWei);
      setShowSuccess(true);
      setShowError(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    catch(error){
      console.log(error)
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => setShowError(false), 3000);
    }
  }

  return (
    <div className="create-campaign mt-5">
      <h1>Create a New Campaign</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group mt-5">
          <label htmlFor="campaignName">Campaign Name:</label>
          <input
            type="text"
            id="campaignName"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-5">
          <label htmlFor="campaignName">Recipitent Adress:</label>
          <input
            type="text"
            id="campaignName"
            
            onChange={(e) => setRecepadd(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="targetAmount">Token Price :</label>
          <input
            type="number"
            id="targetAmount"
            value={tokenprice}
            onChange={(e) => setTokenprice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="targetAmount">Target Amount :</label>
          <input
            type="number"
            id="targetAmount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button onClick={createCampaign} type="submit" className="submit-button mt-3">
          Create Campaign
        </button>
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-500 text-black font-[Poppins] text-center p-2 mt-4 rounded"
            >
                Campaign created successfully ✅
            </motion.div>
          )}

          {showError && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500 text-black font-[Poppins] text-center p-2 mt-4 rounded"
            >
                Campaign creation failed ❌
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default CreateCam;
