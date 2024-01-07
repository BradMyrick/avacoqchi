// Interactions.ts contains all the functions that interact with the smart contracts

import { ethers } from 'ethers';
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { COQ_ADDRESS, ITEMS_ADDRESS, GAMEPLAY_ADDRESS } from '../constants';
import { hooks, metaMask } from '../connectors/metaMask'
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks

import COQ_ABI from './abis/COQ.json';
import COQCHI_ABI from './abis/Coqchi.json';
import ITEMS_ABI from './abis/Items.json';
import GAMEPLAY_ABI from './abis/Gameplay.json';

const coqAddress = COQ_ADDRESS;
const itemsAddress = ITEMS_ADDRESS;
const gameplayAddress = GAMEPLAY_ADDRESS;

const coqchiABI = COQCHI_ABI;
const coqABI = COQ_ABI;
const itemsABI = ITEMS_ABI;
const gameplayABI = GAMEPLAY_ABI;




export function mintEgg(
  provider?: ReturnType<Web3ReactHooks['useProvider']>,
  name?: string,
): Promise<ethers.ContractTransaction> {
  const contract = new ethers.Contract(coqAddress, coqchiABI, provider);
  const signer = contract.connect(provider);
  return signer.mintEgg(name);
}

export function hatchEgg(
  provider?: ReturnType<Web3ReactHooks['useProvider']>,
  tokenId?: number,
): Promise<ethers.ContractTransaction> {
  const contract = new ethers.Contract(coqAddress, coqABI, provider);
  const signer = contract.connect(provider);
  return signer.hatchEgg(tokenId);
}

export function feedChicken (
  provider?: ReturnType<Web3ReactHooks['useProvider']>,
  tokenId?: number,
  itemAmount?: number,
): Promise<ethers.ContractTransaction> {
  const contract = new ethers.Contract(gameplayAddress, gameplayABI, provider);
  const signer = contract.connect(provider);
  return signer.feedChicken(tokenId, itemAmount);
}

export function waterChicken (
  provider?: ReturnType<Web3ReactHooks['useProvider']>,
  tokenId?: number,
  itemAmount?: number,
): Promise<ethers.ContractTransaction> {
  const contract = new ethers.Contract(gameplayAddress, gameplayABI, provider);
  const signer = contract.connect(provider);
  return signer.waterChicken(tokenId, itemAmount);
}

export function medicateChicken (
  provider?: ReturnType<Web3ReactHooks['useProvider']>,
  tokenId?: number,
  itemAmount?: number,
): Promise<ethers.ContractTransaction> {
  const contract = new ethers.Contract(gameplayAddress, gameplayABI, provider);
  const signer = contract.connect(provider);
  return signer.medicateChicken(tokenId, itemAmount);
}

export function getChickenDetails (
  provider?: ReturnType<Web3ReactHooks['useProvider']>,
  tokenId?: number,
): Promise<any> {
  const contract = new ethers.Contract(coqAddress, coqABI, provider);
  return contract.getChickenDetails(tokenId);
}
// Approve all token transfer from COQ by Gameplay
export function approveAllCoq (
  provider?: ReturnType<Web3ReactHooks['useProvider']>,
): Promise<ethers.ContractTransaction> {
  const contract = new ethers.Contract(coqAddress, coqABI, provider);
  const signer = contract.connect(provider);
  return signer.setApprovalForAll(gameplayAddress, true);
}

// Approve specific amount of COQ by Gameplay
export function approveSomeCoq (
  provider?: ReturnType<Web3ReactHooks['useProvider']>,
  amount?: number,
): Promise<ethers.ContractTransaction> {
  const contract = new ethers.Contract(coqAddress, coqABI, provider);
  const signer = contract.connect(provider);
  return signer.approve(gameplayAddress, amount);
}

// Get users Inventory Items
export function getInventory (
  provider?: ReturnType<Web3ReactHooks['useProvider']>,
  account?: string,
): Promise<any> {
  const contract = new ethers.Contract(itemsAddress, itemsABI, provider);
  return contract.getInventory();
}

