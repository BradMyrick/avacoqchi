// Gameplay.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { mintEgg, hatchEgg, feedChicken, waterChicken, medicateChicken, getChickenDetails, approveAllCoq, approveSomeCoq } from './Interactions';
import { hooks, metaMask } from '../connectors/metaMask'
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks

import Image from 'next/image';
// import images from constants
// eggs
import {
  EGG1_IMAGE_PATH,
  EGG2_IMAGE_PATH,
  EGG3_IMAGE_PATH,
  HATCHLING1_IMAGE_PATH,
  NORMAL1_IMAGE_PATH,
  NORMAL2_IMAGE_PATH,
  NORMAL3_IMAGE_PATH,
  ANGRY1_IMAGE_PATH,
  ANGRY2_IMAGE_PATH,
  ANGRY3_IMAGE_PATH,
  HUNGRY1_IMAGE_PATH,
  HUNGRY2_IMAGE_PATH,
  HUNGRY3_IMAGE_PATH,
} from '../constants';

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

const Gameplay = () => {
  // State variables
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
      // show EGG3_IMAGE_PATH for 5 seconds then show HATCHLING1_IMAGE_PATH
      setTimeout(() => {
        setIsEgg(false);
        setIsHatchling(true);
        setIsNormal(false);
      }, 3000);
      // show HATCHLING1_IMAGE_PATH for 5 seconds then show NORMAL1_IMAGE_PATH
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
      return HATCHLING1_IMAGE_PATH;
    }
    else if (isNormal) {
      return getChickenImage();
    }
  }

  const getEggImage = () => {
    console.log('eggStatus', eggStatus);
    switch (eggStatus) {
      case EggStatus.Unminted:
        return EGG1_IMAGE_PATH;
      case EggStatus.Minted:
        return EGG2_IMAGE_PATH;
      case EggStatus.Hatched:
        return EGG3_IMAGE_PATH;
      default:
        return EGG1_IMAGE_PATH; // Default to unminted egg image
    }
  };

  const getChickenImage = () => {
    console.log('Get Normal Image');
    switch (chickenStatus) {
      case ChickenStatus.Normal:
        // return a random normal image
        const normalImages = [NORMAL1_IMAGE_PATH, NORMAL2_IMAGE_PATH, NORMAL3_IMAGE_PATH];
        const randomNormalImage = normalImages[Math.floor(Math.random() * normalImages.length)];
        return randomNormalImage;
      case ChickenStatus.Angry:
        // return a random angry image
        const angryImages = [ANGRY1_IMAGE_PATH, ANGRY2_IMAGE_PATH, ANGRY3_IMAGE_PATH];
        const randomAngryImage = angryImages[Math.floor(Math.random() * angryImages.length)];
        return randomAngryImage;
      case ChickenStatus.Sick:
        // return a random sick image
        return NORMAL1_IMAGE_PATH;
      case ChickenStatus.Hungry:
        // return a random hungry image
        const hungryImages = [HUNGRY1_IMAGE_PATH, HUNGRY2_IMAGE_PATH, HUNGRY3_IMAGE_PATH];
        const randomHungryImage = hungryImages[Math.floor(Math.random() * hungryImages.length)];
        return randomHungryImage;
      default:
        return NORMAL1_IMAGE_PATH; // Default to NORMAL1_IMAGE_PATH image
    }
  };



  const handleMintEgg = async () => {
    await mintEgg(
      useProvider(),
      chickenName,
    );
  };

  const handleHatchEgg = async () => {
    await hatchEgg(
      useProvider(),
      tokenId,
    );
  };

  const handleFeedChicken = async () => {
    await feedChicken(
      useProvider(),
      tokenId,
      itemAmount,
    );
  };

  const handleWaterChicken = async () => {
    await waterChicken(
      useProvider(),
      tokenId, 
      itemAmount);
  };

  const handleMedicateChicken = async () => {
    await medicateChicken(      
      useProvider(),
      tokenId, 
      itemAmount
      );
  };

  const handleGetChickenDetails = async () => {
    const details = await getChickenDetails(
      useProvider(),
      tokenId,
    );
    console.log('details', details);
    setChickenDetails(details);
  };

  const handleApproveAllCoq = async () => {
    await approveAllCoq();
  };

  const handleApproveSomeCoq = async () => {
    await approveSomeCoq(
      useProvider(),
      Number(ethers.utils.parseEther(coqAmount)),
      );
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
          <button onClick={handleMintEgg}>Mint Egg</button>
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
        <button onClick={handleApproveAllCoq}>Approve All COQ</button>
        <input
          type="number"
          placeholder="Amount of COQ"
          value={coqAmount}
          onChange={(e) => setCoqAmount(e.target.value)}
        />
        <button onClick={handleApproveSomeCoq}>Aprove Set Amount of COQ</button>
      </div>
    </div>
  );
};

export default Gameplay;
