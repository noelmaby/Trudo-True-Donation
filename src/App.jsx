import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainP from "../src/pages/Mainpage/Mainpage";
import CreateCampaign from "../src/pages/CreateCampaign/CreateCam";
import SingleNftPage from '../src/pages/SingleNFT/Nft1page';

function App() {
  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />

      <Routes>
        <Route path="/" element={<MainP />} />
        <Route path="/createCampaign" element={<CreateCampaign />} />
        <Route path="/nftpage" element={<SingleNftPage />} />
      </Routes>
    </>
  );
}

export default App;
