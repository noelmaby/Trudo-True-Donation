import { ethers } from 'ethers';
import fetch from 'node-fetch';
import axios from 'axios';
let mainContract = null;

async function connectContract() {
    if(!mainContract){
        var abi = ""
        let ABIurl = "https://api.jsonstorage.net/v1/json/668506ec-0348-4974-b01e-e02c92db7a5b/e3d1146b-63bb-4187-865c-e23cd45bbd87";
        try {
            const response = await axios.get(ABIurl);
            abi = response.data; // Access the parsed JSON directly
            // console.log(abi);
        }catch (error) {
            console.error('Error:', error);
        }    
        
        const url = "https://rpc.buildbear.io/attractive-husk-85382fca"
        const provider = new ethers.JsonRpcProvider(url);

        let privatekey = "d1fe46b2fdc4670da7dce9dc9ae57d45b64622c34c117bfe276ac31ad3173b7c";
        //7a2792f0622f517c489643a6db8ce8acbd5833b7134792ed443e0f7c908dc0aa
        let wallet = new ethers.Wallet(privatekey, provider);
        
        let contractaddress = "0x4B46599f43adE2d9F04523Ab6F10c87517a051e0";
        console.log("Using wallet address " + wallet.address);
        
        // initiating a new Contract
        let contract = new ethers.Contract(contractaddress, abi, wallet);
        
        return contract;
    }
    else{
        return mainContract;
    }
}

async function singleCampaignInfo(tokenId) {
    if(!mainContract){
        mainContract = await connectContract();
    }
    return await mainContract.getCampaignInfo(tokenId);
}

async function getAllCampaignDetails() {
    if(!mainContract){
        mainContract = await connectContract();
    }    
    const result = await mainContract.getAllCampaignDetails();
    console.log(result);
}

async function singleNFTInfoGenerator() {
    if(!mainContract){
        mainContract = await connectContract();
    }
    const [campaignDetails, allCampaignIds] = await mainContract.getAllCampaignDetails();
    let _tokenIdCounter = Object.keys(allCampaignIds).length;

    const nftArray = [];
    let nftCounter = 0;
    while(nftCounter < 4 && _tokenIdCounter > 0){
        const nftData = await singleCampaignInfo(_tokenIdCounter);
        console.log(nftData);
        try {
            let response = await fetch(nftData.tokenURI);
            if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
            response = await response.json();
            let nft = {
                "tokenId": _tokenIdCounter,
                "campaignname": response.campaignname,
                "description": response.descriptioncam,
                "imageUrl": response.imageUrl
            }
            nftArray.push(nft);
            nftCounter += 1;
        }
        catch (error) {
            console.error(`Error at token ${_tokenIdCounter}:`, error.message);
        }
        finally{
            _tokenIdCounter -= 1;
        }
    }
    
    return nftArray;
}

// let result = await singleNFTInfoGenerator();
// console.log(result);

// let result = await getAllCampaignDetails();
// console.log(result);


let result = await singleCampaignInfo(10);
console.log(result);
