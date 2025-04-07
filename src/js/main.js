import { ethers } from 'ethers';
import axios from 'axios';

let mainContract = null;

async function connectContract() {
    if(!mainContract){
        var abi = ""
        let ABIurl = "https://api.jsonstorage.net/v1/json/668506ec-0348-4974-b01e-e02c92db7a5b/e3d1146b-63bb-4187-865c-e23cd45bbd87";
        try {
            const response = await axios.get(ABIurl);
            abi = response.data; // Access the parsed JSON directly
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

async function campainCreate(recepadd,tokenpriceWei,metaData,targetAmountWei) {
    if(!mainContract){
        mainContract = await connectContract();
    }
    await mainContract.createCampaign(recepadd,tokenpriceWei,metaData,targetAmountWei);
}

async function singleCampaignInfo(tokenId) {
    if(!mainContract){
        mainContract = await connectContract();
    }
    
    return await mainContract.getCampaignInfo(tokenId);
}

async function singleNFTInfoGenerator() {
    if (!mainContract) {
      mainContract = await connectContract();
    }
  
    const [campaignDetails, allCampaignIds] = await mainContract.getAllCampaignDetails();
    let _tokenIdCounter = Object.keys(allCampaignIds).length;
  
    const nftArray = [];
  
    while (_tokenIdCounter > 0) {
      const nftData = await singleCampaignInfo(_tokenIdCounter);
      console.log(nftData);
      try {
        let response = await fetch(nftData.tokenURI);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        response = await response.json();
  
        let nft = {
          tokenId: _tokenIdCounter,
          campaignname: response.campaignname,
          description: response.descriptioncam,
          imageUrl: response.imageUrl,
        };
  
        nftArray.push(nft);
      } catch (error) {
        console.error(`Error at token ${_tokenIdCounter}:`, error.message);
      } finally {
        _tokenIdCounter -= 1;
      }
    }
  
    return nftArray;
  }

async function mintTokens(tokenId, numTokens, tokenPrice) {
    if (typeof window.ethereum === "undefined") {
        console.error("MetaMask not detected!");
        return false;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(); // Get connected wallet

        let abi = "";
        let ABIurl = "https://api.jsonstorage.net/v1/json/668506ec-0348-4974-b01e-e02c92db7a5b/e3d1146b-63bb-4187-865c-e23cd45bbd87";
        const response = await axios.get(ABIurl);
        abi = response.data;

        let contractAddress = "0x4b46599f43ade2d9f04523ab6f10c87517a051e0";
        let contract = new ethers.Contract(contractAddress, abi, signer);

        // Fetch tokenURI from contract
        const nftData = await singleCampaignInfo(tokenId);
        let metadataResponse = await fetch(nftData.tokenURI);
        if (!metadataResponse.ok) throw new Error(`Failed to fetch metadata: ${metadataResponse.statusText}`);
        let metadata = await metadataResponse.json();
        let imageUrl = metadata.imageUrl; // Extract image URL from metadata
        let campaignName = metadata.campaignname;
        console.log(imageUrl)

        // Convert values to BigInt
        const Tokenp = ethers.parseEther(tokenPrice.toString());
        const totalCost = Tokenp * BigInt(numTokens);

        // Execute mint transaction with connected wallet
        const tx = await contract.mint(tokenId, numTokens, { value: totalCost });
        await tx.wait();

        console.log(`Successfully minted ${numTokens} tokens for tokenId ${tokenId}`);

        // Add NFT to MetaMask
        await addNFTToMetaMask(contractAddress, tokenId,campaignName, imageUrl);

        return true;
    } catch (error) {
        console.error("Error minting tokens:", error);
        return false;
    }
}

async function addNFTToMetaMask(contractAddress, tokenId,campaignName, imageUrl) {
    if (!window.ethereum) {
        console.error("MetaMask not detected!");
        return;
    }

    try {
        console.log(`Adding NFT to MetaMask: Token ID ${tokenId}, Image: ${imageUrl}`);

        const wasAdded = await window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
                type: "ERC1155",
                options: {
                    address: contractAddress,
                    id: tokenId.toString(),
                    symbol: campaignName,
                    image: imageUrl, // Pass image URL to MetaMask
                },
            },
        });

        if (wasAdded) {
            console.log("NFT successfully added to MetaMask!");
        } else {
            console.log("NFT was not added to MetaMask.");
        }
    } catch (error) {
        console.error("Error adding NFT to MetaMask:", error);
    }
}

const contractFunctions = {
    campainCreate,
    singleCampaignInfo,
    singleNFTInfoGenerator,
    mintTokens
};
export default contractFunctions;

