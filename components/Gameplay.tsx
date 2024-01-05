// Gameplay.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import AvaCoqChiABI from './abis/AvaCoqChi.json';

const Gameplay = () => {
  const [avaCoqChi, setAvaCoqChi] = useState(null);
  const [tokenId, setTokenId] = useState(1); // Example token ID for testing
  const [chickenName, setChickenName] = useState(''); // Example chicken name for testing
  const [itemAmount, setItemAmount] = useState(1); // Example amount for using items

  // Get the signer and chain ID from the Web3 React context
  const { account } = useWeb3React();

  // Initialize the AvaCoqChi contract
  useEffect(() => {
    if (account) {
      // Create a new Web3Provider from the global window.ethereum object
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Get the signer from the provider
      const signer = provider.getSigner(account);
      const contractAddress = 'CONTRACT_ADDRESS'; // Replace with your deployed contract address
      const contractInstance = new ethers.Contract(contractAddress, AvaCoqChiABI, signer);
      setAvaCoqChi(contractInstance);
    }
  }, [account]);

  // Function to request a signature from the user
  const requestSignature = async () => {
    if (account) {
      // Create a new Web3Provider from the global window.ethereum object
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Get the signer from the provider
      const signer = provider.getSigner(account);
      const message = "Please sign this message to confirm your identity.";
      try {
        const signature = await signer.signMessage(message);
        console.log('Signature:', signature);
      } catch (error) {
        console.error('Error requesting signature:', error);
      }
    }
  };

  // Function to mint an egg
  const mintEgg = async () => {
    if (avaCoqChi) {
      try {
        const transaction = await avaCoqChi.mintEgg();
        await transaction.wait();
        console.log('Egg minted!');
      } catch (error) {
        console.error('Error minting egg:', error);
      }
    }
  };

  // Function to hatch an egg
  const hatchEgg = async () => {
    if (avaCoqChi && chickenName) {
      try {
        const transaction = await avaCoqChi.hatchEgg(tokenId, chickenName);
        await transaction.wait();
        console.log('Egg hatched!');
      } catch (error) {
        console.error('Error hatching egg:', error);
      }
    }
  };

  // Function to feed the chicken
  const feedChicken = async () => {
    if (avaCoqChi) {
      try {
        const transaction = await avaCoqChi.feedChicken(tokenId, itemAmount);
        await transaction.wait();
        console.log('Chicken fed!');
      } catch (error) {
        console.error('Error feeding chicken:', error);
      }
    }
  };

  // Function to water the chicken
  const waterChicken = async () => {
    if (avaCoqChi) {
      try {
        const transaction = await avaCoqChi.waterChicken(tokenId, itemAmount);
        await transaction.wait();
        console.log('Chicken watered!');
      } catch (error) {
        console.error('Error watering chicken:', error);
      }
    }
  };

  // Function to medicate the chicken
  const medicateChicken = async () => {
    if (avaCoqChi) {
      try {
        const transaction = await avaCoqChi.medicateChicken(tokenId, itemAmount);
        await transaction.wait();
        console.log('Chicken medicated!');
      } catch (error) {
        console.error('Error medicating chicken:', error);
      }
    }
  };

  // Function to get chicken details
  const getChickenDetails = useCallback(async () => {
    if (avaCoqChi) {
      try {
        const details = await avaCoqChi.getChickenDetails(tokenId);
        console.log('Chicken details:', details);
      } catch (error) {
        console.error('Error getting chicken details:', error);
      }
    }
  }, [avaCoqChi, tokenId]);

  // Render the gameplay UI here
  return (
    <div className="gameplay-container">
      <h1>AvaCoqChi Game</h1>
      <input
        type="text"
        placeholder="Name your CoqChi"
        value={chickenName}
        onChange={(e) => setChickenName(e.target.value)}
      />
      <button onClick={mintEgg}>Mint Egg</button>

      <div className="controller-container">
        <button onClick={hatchEgg}>Hatch Egg</button>
        <button onClick={feedChicken}>Feed Chicken</button>
        <button onClick={waterChicken}>Water Chicken</button>
        <button onClick={medicateChicken}>Medicate Chicken</button>
        <button onClick={getChickenDetails}>Get Chicken Details</button>
        <button onClick={requestSignature}>Request Signature</button>
      </div>
    </div>
  );
};

export default Gameplay;
