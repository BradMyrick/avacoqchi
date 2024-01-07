// Interactions.ts contains all the functions that interact with the smart contracts

import { ethers } from 'ethers';
import { COQ_ADDRESS, ITEMS_ADDRESS, GAMEPLAY_ADDRESS, COQCHI_ADDRESS } from '../constants';
import COQ_ABI from './abis/COQ.json';
import COQCHI_ABI from './abis/Coqchi.json';
import ITEMS_ABI from './abis/Items.json';
import GAMEPLAY_ABI from './abis/Gameplay.json';

const coqAddress = COQ_ADDRESS;
const itemsAddress = ITEMS_ADDRESS;
const gameplayAddress = GAMEPLAY_ADDRESS;
const coqchiAddress = COQCHI_ADDRESS;

const coqABI = COQCHI_ABI;
const itemsABI = ITEMS_ABI;
const gameplayABI = GAMEPLAY_ABI;

// Create instances of the contracts
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const coqContract = new ethers.Contract(coqAddress, coqABI, signer);
const itemsContract = new ethers.Contract(itemsAddress, itemsABI, signer);
const gameplayContract = new ethers.Contract(gameplayAddress, gameplayABI, signer);
const user = signer.getAddress();

export const mintEgg = async (name) => {
  try {
    const tx = await gameplayContract.mintEgg(name);
    await tx.wait();
  } catch (error) {
    console.error("An error occurred while minting the egg:", error);
  }
};

export const hatchEgg = async (tokenId) => {
  try {
    const tx = await gameplayContract.hatchEgg(tokenId);
    await tx.wait();
  }
  catch (error) {
    console.error("An error occurred while hatching the egg:", error);
  }
};

export const feedChicken = async (tokenId, itemAmount) => {
  try {
    const tx = await gameplayContract.feedChicken(tokenId, itemAmount);
    await tx.wait();
  }
  catch (error) {
    console.error("An error occurred while feeding the chicken:", error);
  }
};

export const waterChicken = async (tokenId, itemAmount) => {
  try {
    const tx = await gameplayContract.waterChicken(tokenId, itemAmount);
    await tx.wait();
  }
  catch (error) {
    console.error("An error occurred while watering the chicken:", error);
  }
};

export const medicateChicken = async (tokenId, itemAmount) => {
  try {
    const tx = await gameplayContract.medicateChicken(tokenId, itemAmount);
    await tx.wait();
  }
  catch (error) {
    console.error("An error occurred while medicating the chicken:", error);
  }
};

export const getChickenDetails = async (tokenId) => {
  const details = await gameplayContract.getChickenDetails(tokenId);
  return details;
};

// Approve all token transfer from COQ by Gameplay
export const approveAllCoq = async () => {
  try {
    const tx = await coqContract.setApprovalForAll(gameplayAddress, true);
    await tx.wait();
  }
  catch (error) {
    console.error("An error occurred while approving all COQ:", error);
  }
};

// Approve specific amount of COQ by Gameplay
export const approveSomeCoq = async (amount) => {
  try {
    const tx = await coqContract.approve(gameplayAddress, amount);
    await tx.wait();
  }
  catch (error) {
    console.error("An error occurred while approving some COQ:", error);
  }
}

// Get users Inventory Items
export const getInventory = async () => {
  try{
    const inventory = await itemsContract.getInventory(user);
    return inventory;
  }
  catch (error) {
    console.error("An error occurred while getting the inventory:", error);
  }
}