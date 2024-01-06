import { useCallback, useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import CoqChiABI from './abis/Coqchi.json';
import ItemsABI from './abis/Items.json';
import GameplayABI from './abis/Gameplay.json';

const CoqChiAddress = '0x420FcA0121DC28039145009570975747295f2329'; // TODO: replace with deployed contract address
const ItemsAddress = '0x420FcA0121DC28039145009570975747295f2329'; // TODO: replace with deployed contract address
const GameplayAddress = '0x420FcA0121DC28039145009570975747295f2329'; // TODO: replace with deployed contract address

const { account } = useWeb3React(); // TODO: this is broken, fix it

const [gameplayContract, setGameplayContract] = useState(null);
const [coqchiContract, setCoqchiContract] = useState(null);
const [itemsContract, setItemsContract] = useState(null);

const [userChickens, setUserChickens] = useState([]);
const [userItems, setUserItems] = useState([]);

// Initialize the contracts
useEffect(() => {
  if (account) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(account);
    const gameplayContractInstance = new ethers.Contract(GameplayAddress, GameplayABI, signer);
    const coqchiContractInstance = new ethers.Contract(CoqChiAddress, CoqChiABI, signer);
    const itemsContractInstance = new ethers.Contract(ItemsAddress, ItemsABI, signer);
    setGameplayContract(gameplayContractInstance);
    setCoqchiContract(coqchiContractInstance);
    setItemsContract(itemsContractInstance);
  }
}, [account]);

// Function to mint an egg
export const mintEgg = async (name) => {
  if (gameplayContract) {
    try {
      const tx = await gameplayContract.mintEgg(name);
      await tx.wait();
      console.log('Egg minted!');
    } catch (error) {
      console.error('Error minting egg:', error);
    }
  }
};

// Function to hatch an egg
export const hatchEgg = useCallback(async (tokenId) => {
  if (gameplayContract) {
    try {
      const tx = await gameplayContract.hatchEgg(tokenId);
      await tx.wait();
      console.log('Egg hatched!');
    } catch (error) {
      console.error('Error hatching egg:', error);
    }
  }
}, [gameplayContract]);

// Function to feed the chicken
export const feedChicken = useCallback(async (itemId, amount) => {
  if (gameplayContract) {
    try {
      const tx = await gameplayContract.useFood(itemId, amount);
      await tx.wait();
      console.log('Chicken fed!');
    } catch (error) {
      console.error('Error feeding chicken:', error);
    }
  }
}, [gameplayContract]);

// Function to water the chicken
export const waterChicken = useCallback(async (itemId, amount) => {
  if (gameplayContract) {
    try {
      const tx = await gameplayContract.useWater(itemId, amount);
      await tx.wait();
      console.log('Chicken watered!');
    } catch (error) {
      console.error('Error watering chicken:', error);
    }
  }
}, [gameplayContract]);

// Function to medicate the chicken
export const medicateChicken = useCallback(async (itemId, amount) => {
  if (gameplayContract) {
    try {
      const tx = await gameplayContract.useMedicine(itemId, amount);
      await tx.wait();
      console.log('Chicken medicated!');
    } catch (error) {
      console.error('Error medicating chicken:', error);
    }
  }
}, [gameplayContract]);

// Function to get the chickens for the user
export const fetchUserChickens = useCallback(async (account) => {
  try {
    const chickens = await coqchiContract.getUserChickens(account);
    setUserChickens(chickens);
  } catch (error) {
    console.error('Error fetching user chickens:', error);
  }
}, [coqchiContract]);

// Function to get user items
export const fetchUserItems = useCallback(async (account) => {
  try {
    const items = await itemsContract.getUserItems(account);
    setUserItems(items);
  } catch (error) {
    console.error('Error fetching user items:', error);
  }
}, [itemsContract]);

// Function to get chicken details
export const getChickenDetails = useCallback(async (tokenId) => {
  try {
    const chicken = await coqchiContract.getChickenDetails(tokenId);
    return chicken;
  } catch (error) {
    console.error('Error fetching chicken details:', error);
  }
}, [coqchiContract]);
