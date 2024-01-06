// Gameplay.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { mintEgg, hatchEgg, feedChicken, waterChicken, medicateChicken, getChickenDetails } from './Interactions';

import COQABI from './abis/COQ.json';
import Image from 'next/image';
// import images
// eggs
import egg1 from './images/coq/egg/1.png';
import egg2 from './images/coq/egg/2.png';
import egg3 from './images/coq/egg/3.png';
// hachling
import hackling1 from './images/coq/hachling/1.png';
// normal
import normal1 from './images/coq/normal/1.png';
import normal2 from './images/coq/normal/2.png';
import normal3 from './images/coq/normal/3.png';
// angry
import angry1 from './images/coq/angry/1.png';
import angry2 from './images/coq/angry/2.png';
import angry3 from './images/coq/angry/3.png';
// sick
// hungry
import hungry1 from './images/coq/hungry/1.png';
import hungry2 from './images/coq/hungry/2.png';
import hungry3 from './images/coq/hungry/3.png';

enum EggStatus {
  Unminted,
  Minted,
  Hatched,
  Finished,
}

enum ChickenStatus {
  UnHatched,
  Normal,
  Angry,
  Sick,
  Hungry
}

type ChickenDetails = {
  name: string;
  health: number;
  hunger: number;
  happiness: number;
  lastinteracted: number;
};


function convertBigNumbertoNumber(bigNumber: ethers.BigNumber) {
  return parseInt(bigNumber.toString());
}

const Gameplay = () => {
  // State variables
  const ItemsAddress = '0x420FcA0121DC28039145009570975747295f2329';
  const CoqAddress = '0x420FcA0121DC28039145009570975747295f2329';
  const [tokenId, setTokenId] = useState(0);
  const [chickenName, setChickenName] = useState('');
  const [itemAmount, setItemAmount] = useState(0);
  const [coqAmount, setCoqAmount] = useState('');
  const [coqInstance, setCoqInstance] = useState(null); // Instance of the COQ token contract
  const [eggStatus, setEggStatus] = useState<EggStatus>(EggStatus.Unminted);
  const [chickenStatus, setChickenStatus] = useState<ChickenStatus>(ChickenStatus.UnHatched);
  const [isEgg, setIsEgg] = useState(true); // [egg, hatchling, normal

  const [chickenDetails, setChickenDetails] = useState<ChickenDetails>({
    name: '',
    health: 0,
    hunger: 0,
    happiness: 0,
    lastinteracted: 0,
  });

  useEffect(() => {
    // update the chicken details
    setChickenDetails({
      name: chickenName,
      health: 100,
      hunger: 100,
      happiness: 100,
      lastinteracted: 0,
    });
  }, [chickenName]);


  // Get the signer and chain ID from the Web3 React context
  const { account } = useWeb3React();

  // refresh the image anytime the eggStatus or chickenStatus changes
  useEffect(() => {
    console.log('eggStatus', eggStatus);
    console.log('chickenStatus', chickenStatus);
    console.log('isEgg', isEgg);

    if (eggStatus === EggStatus.Minted) {
      setIsEgg(true);
      setIsHatchling(false);
      setIsNormal(false);
    }
    else if (eggStatus === EggStatus.Hatched) {
      // show egg3 for 5 seconds then show hatchling1
      setTimeout(() => {
        setIsEgg(false);
        setIsHatchling(true);
        setIsNormal(false);
      }, 3000);
      // show hatchling1 for 5 seconds then show normal1
      setTimeout(() => {
        setIsEgg(false);
        setIsHatchling(false);
        setIsNormal(true);
        setChickenStatus(ChickenStatus.Normal);
      }, 6000);
    }

  }, [eggStatus]);

  const [isHatchling, setIsHatchling] = useState(false);
  const [isNormal, setIsNormal] = useState(false);

  const getImageType = () => {
    console.log('Get Image Type');
    if (isEgg) {
      return getEggImage();
    }
    else if (isHatchling) {
      return hackling1;
    }
    else if (isNormal) {
      return getChickenImage();
    }
  }

  const getEggImage = () => {
    console.log('eggStatus', eggStatus);
    switch (eggStatus) {
      case EggStatus.Unminted:
        return egg1;
      case EggStatus.Minted:
        return egg2;
      case EggStatus.Hatched:
        return egg3;
      default:
        return egg1; // Default to unminted egg image
    }
  };

  const getChickenImage = () => {
    console.log('Get Normal Image');
    switch (chickenStatus) {
      case ChickenStatus.Normal:
        // return a random normal image
        const normalImages = [normal1, normal2, normal3];
        const randomNormalImage = normalImages[Math.floor(Math.random() * normalImages.length)];
        return randomNormalImage;
      case ChickenStatus.Angry:
        // return a random angry image
        const angryImages = [angry1, angry2, angry3];
        const randomAngryImage = angryImages[Math.floor(Math.random() * angryImages.length)];
        return randomAngryImage;
      case ChickenStatus.Sick:
        // return a random sick image
        return normal1;
      case ChickenStatus.Hungry:
        // return a random hungry image
        const hungryImages = [hungry1, hungry2, hungry3];
        const randomHungryImage = hungryImages[Math.floor(Math.random() * hungryImages.length)];
        return randomHungryImage;
      default:
        return normal1; // Default to normal1 image
    }
  };


  // Function to request a signature from the user and setup the contract instance
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

  // Approve COQ token for spending
  const approveCoq = async () => {
    console.log('approving COQ');
    if (coqInstance) {
      try {
        const transaction = await coqInstance.approve(ethers.utils.getAddress(CoqAddress), ethers.constants.MaxUint256);
        await transaction.wait();
        console.log('COQ approved!');
      } catch (error) {
        console.error('Error approving COQ:', error);
      }
    }
  }


  // Function to approve COQ token for spending
  const approveSetCoq = async () => {
    if (coqInstance) {
      try {
        const transaction = await coqInstance.approve(ethers.utils.getAddress(ItemsAddress), ethers.utils.parseEther(coqAmount.toString()));
        await transaction.wait();
        console.log('COQ approved!');
      } catch (error) {
        console.error('Error approving COQ:', error);
      }
    }
  }


  // Example function to handle minting an egg
  const handleMintEgg = async () => {
    await mintEgg(chickenName);
  };

  // Example function to handle hatching an egg
  const handleHatchEgg = async () => {
    await hatchEgg(tokenId);
  };

  // Example function to handle feeding a chicken
  const handleFeedChicken = async () => {
    await feedChicken(tokenId, itemAmount);
  };

  // Example function to handle watering a chicken
  const handleWaterChicken = async () => {
    await waterChicken(tokenId, itemAmount);
  };

  // Example function to handle medicating a chicken
  const handleMedicateChicken = async () => {
    await medicateChicken(tokenId, itemAmount);
  };

  // Example function to get chicken details
  const handleGetChickenDetails = async () => {
    const details = await getChickenDetails(tokenId);
    // Do something with the details
  };


  // Render the gameplay UI here
  return (
    <div className="gameplay-container">
      <div className="play-image">
        <Image src={getImageType()} alt="CoqChi" width={500} height={500} />
      </div>

      {eggStatus === EggStatus.Unminted ? (
        <>
          <input
            type="text"
            placeholder="Name your CoqChi"
            value={chickenName}
            onChange={(e) => setChickenName(e.target.value)}
          />
          <button onClick={mintEgg}>Mint Egg</button>
        </>

      ) : (

        <>
          <div className="chicken-name">
            <p>Name: {chickenDetails.name}</p>
          </div>
          <div className="chicken-status">
            <p>Health: {chickenDetails.health}</p>
            <p>Hunger: {chickenDetails.hunger}</p>
            <p>Happiness: {chickenDetails.happiness}</p>
            <p>Last Interacted: {chickenDetails.lastinteracted}</p>
          </div>
        </>
      )}

      <div className="controller-container">
        <button onClick={handleHatchEgg}>Hatch Egg</button>
        <button onClick={handleFeedChicken}>Feed Chicken</button>
        <button onClick={handleWaterChicken}>Water Chicken</button>
        <button onClick={handleMedicateChicken}>Medicate Chicken</button>
        <button onClick={handleGetChickenDetails}>Get Chicken Details</button>
        <button onClick={approveCoq}>Approve All COQ</button>
        <input
          type="number"
          placeholder="Amount of COQ"
          value={coqAmount}
          onChange={(e) => setCoqAmount(e.target.value)}
        />
        <button onClick={approveSetCoq}>Aprove Set Amount of COQ</button>
      </div>
    </div>
  );
};

export default Gameplay;
