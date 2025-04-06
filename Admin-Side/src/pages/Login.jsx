import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Abi from "../contracts/Abi.json";
import { toast } from "sonner";

const contractAdd = "0x2183373d076ca1b8aEbE541597A1B04dC7101a1F";

const Login = ({ wallet }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      if (window.ethereum.chainId === "0xaa36a7") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAdd, Abi.abi, signer);
          toast.success("Metamask connected");
          setWalletConnected(true);
          wallet(provider, contract, signer.address);
          navigate("/Dashboard");
        } catch (error) {
          toast.error(error.message);
        }
      } else {
        toast.error("Please select Sepolia test network");
      }
    } else {
      toast.error("Please install Metamask");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900">
      <div className="w-full max-w-lg p-12 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 dark:text-blue-400 mb-10 tracking-wide">
          Welcome to VoteIndia
        </h1>
        <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-8 font-light">
          A decentralized polling system built on blockchain technology.
        </p>
        <button
          onClick={connectWallet}
          className="w-full py-4 px-8 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all"
        >
          {walletConnected ? "Wallet Connected" : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
};

export default Login;