// Gameplay.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import AvaCoqChiABI from './abis/AvaCoqChi.json';

const Gameplay = () => {
  const { account } = useWeb3React();
  const [avaCoqChi, setAvaCoqChi] = useState(null);
  const [tokenId, setTokenId] = useState(1); // Example token ID for testing
  const [itemName, setItemName] = useState(''); // For naming the chicken
  const [itemAmount, setItemAmount] = useState(1); // Example amount for using items

  // Initialize the AvaCoqChi contract
  useEffect(() => {
    if (account) {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      const contractAddress = 'CONTRACT_ADDRESS'; // Replace with my deployed contract address
      const contractInstance = new ethers.Contract(contractAddress, AvaCoqChiABI, signer);
      setAvaCoqChi(contractInstance);
    }
  }, [account]);

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
    if (avaCoqChi && itemName) {
      try {
        const transaction = await avaCoqChi.hatchEgg(tokenId, itemName);
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
    <div>
      <h1>AvaCoqChi Game</h1>
      <button onClick={mintEgg}>Mint Egg</button>
      <input
        type="text"
        placeholder="Name your chicken"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <button onClick={hatchEgg}>Hatch Egg</button>
      <button onClick={feedChicken}>Feed Chicken</button>
      <button onClick={waterChicken}>Water Chicken</button>
      <button onClick={medicateChicken}>Medicate Chicken</button>
      <button onClick={getChickenDetails}>Get Chicken Details</button>
    </div>
  );
};

export default Gameplay;
