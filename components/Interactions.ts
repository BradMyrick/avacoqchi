// Interactions.ts contains all the functions that interact with the smart contracts

import { ethers } from 'ethers';
import { Provider } from './getLibrary';
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { COQ_ADDRESS, ITEMS_ADDRESS, GAMEPLAY_ADDRESS, COQCHI_ADDRESS } from '../constants';
import COQ_ABI from './abis/COQ.json';
import COQCHI_ABI from './abis/Coqchi.json';
import ITEMS_ABI from './abis/Items.json';
import GAMEPLAY_ABI from './abis/Gameplay.json';
import { Accounts } from './Accounts';

export function mintEgg(
  name?: string,
): Promise<ethers.ContractTransaction> {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(GAMEPLAY_ADDRESS, GAMEPLAY_ABI, provider);
  const signer = provider.getSigner();
  return signer.sendTransaction({to: GAMEPLAY_ADDRESS, data: contract.interface.encodeFunctionData('mintEgg', [name]), gasLimit: 3000000});
}


export function hatchEgg(
  tokenId?: number,
): Promise<ethers.ContractTransaction> {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(GAMEPLAY_ADDRESS, GAMEPLAY_ABI, provider);
  const signer = contract.connect(provider);
  return signer.sendTransaction({to: GAMEPLAY_ADDRESS, data: contract.interface.encodeFunctionData('hatchEgg', [tokenId])});
}

export function feedChicken (
  tokenId?: number,
  itemAmount?: number,
): Promise<ethers.ContractTransaction> {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(GAMEPLAY_ADDRESS, GAMEPLAY_ABI, provider);
  const signer = contract.connect(provider);
  return signer.sendTransaction({to: GAMEPLAY_ADDRESS, data: contract.interface.encodeFunctionData('feedChicken', [tokenId, itemAmount])});
}

export function waterChicken (
  tokenId?: number,
  itemAmount?: number,
): Promise<ethers.ContractTransaction> {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(GAMEPLAY_ADDRESS, GAMEPLAY_ABI, provider);
  const signer = contract.connect(provider);
  return signer.sendTransaction({to: GAMEPLAY_ADDRESS, data: contract.interface.encodeFunctionData('waterChicken', [tokenId, itemAmount])});
}

export function medicateChicken (
  tokenId?: number,
  itemAmount?: number,
): Promise<ethers.ContractTransaction> {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(GAMEPLAY_ADDRESS, GAMEPLAY_ABI, provider);
  const signer = contract.connect(provider);
  return signer.sendTransaction({to: GAMEPLAY_ADDRESS, data: contract.interface.encodeFunctionData('medicateChicken', [tokenId, itemAmount])});
}

export function getChickenDetails (
  tokenId?: number,
): Promise<any> {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner();
  const contract = new ethers.Contract(GAMEPLAY_ADDRESS, GAMEPLAY_ABI, signer);
  return signer.sendTransaction({to: GAMEPLAY_ADDRESS, data: contract.interface.encodeFunctionData('getChickenDetails', [tokenId])});
}

// Approve all token transfer from COQ by Gameplay
export function approveAllCoq (
): Promise<ethers.ContractTransaction> {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(COQ_ADDRESS, COQ_ABI, provider);
  const signer = provider.getSigner();
  // send a large number to approve all
  var amount = ethers.BigNumber.from(2).pow(256).sub(1);
  return signer.sendTransaction({to: COQ_ADDRESS, data: contract.interface.encodeFunctionData('approve', [GAMEPLAY_ADDRESS, amount])});
}

// Approve specific amount of COQ by Gameplay
export function approveSomeCoq (
  amount?: ethers.BigNumberish,
): Promise<ethers.ContractTransaction> {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(COQ_ADDRESS, COQ_ABI, provider);
  const signer = provider.getSigner();
  return signer.sendTransaction({to: COQ_ADDRESS, data: contract.interface.encodeFunctionData('approve', [GAMEPLAY_ADDRESS, amount])});
}

// Get users Inventory Items
export function getInventory (
  account?: string,
): Promise<any> {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner();
  const contract = new ethers.Contract(ITEMS_ADDRESS, ITEMS_ABI, signer);
  return signer.sendTransaction({to: ITEMS_ADDRESS, data: contract.interface.encodeFunctionData('getInventory', [account])});
}