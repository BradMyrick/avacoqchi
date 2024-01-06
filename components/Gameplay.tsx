// Gameplay.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import AvaCoqChiABI from './abis/AvaCoqChi.json';
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
  const [avaCoqChi, setAvaCoqChi] = useState(null);
  const [tokenId, setTokenId] = useState(1); // Example token ID for testing
  const [chickenName, setChickenName] = useState(''); // Example chicken name for testing
  const [itemAmount, setItemAmount] = useState(1); // Example amount for using items
  const [coqAmount, setCoqAmount] = useState(convertBigNumbertoNumber(ethers.utils.parseEther('1000'))); // Example amount for using items
  const [coqInstance, setCoqInstance] = useState(null); // Instance of the COQ token contract
  const [eggStatus, setEggStatus] = useState<EggStatus>(EggStatus.Unminted);
  const [chickenStatus, setChickenStatus] = useState<ChickenStatus>(ChickenStatus.UnHatched);
  const [chickenDetails, setChickenDetails] = useState<ChickenDetails>({
    name: '',
    health: 0,
    hunger: 0,
    happiness: 0,
    lastinteracted: 0,
  });



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

  // Initialize the AvaCoqChi contract
  useEffect(() => {
    if (account) {
      // Create a new Web3Provider from the global window.ethereum object
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Get the signer from the provider
      const signer = provider.getSigner(account);
      const contractAddress = '0x420FcA0121DC28039145009570975747295f2329'; // Replace with your deployed contract address
      const contractInstance = new ethers.Contract(contractAddress, AvaCoqChiABI, signer);
      const coqAddress = ethers.utils.getAddress('0x420FcA0121DC28039145009570975747295f2329')
      const coqInstance = new ethers.Contract(coqAddress, COQABI, signer);
      setAvaCoqChi(contractInstance);
      setCoqInstance(coqInstance);
    }
  }, [account]);

  const [isEgg, setIsEgg] = useState(true); // [egg, hatchling, normal
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
        const transaction = await coqInstance.approve(ethers.utils.getAddress('0x420FcA0121DC28039145009570975747295f2329'), ethers.constants.MaxUint256);
        await transaction.wait();
        console.log('COQ approved!');
      } catch (error) {
        console.error('Error approving COQ:', error);
      }
    }
  }

  // Function to mint an egg
  const mintEgg = async () => {
    setEggStatus(EggStatus.Minted);
    console.log('mintEgg');
    // TODO: move this down after testing
    /*
    if (avaCoqChi) {
      try {
        const transaction = await avaCoqChi.mintEgg();
        await transaction.wait();
        console.log('Egg minted!');
      } catch (error) {
        console.error('Error minting egg:', error);
      }
    }
    */
  };

  // Function to hatch an egg
  const hatchEgg = async () => {
    // TODO: move this down after testing
    setEggStatus(EggStatus.Hatched);
    console.log('hatchEgg');
    //if (avaCoqChi && chickenName) {
    //  try {
    //    const transaction = await avaCoqChi.hatchEgg(tokenId, chickenName);
    //    await transaction.wait();
    //    console.log('Egg hatched!');
    //  } catch (error) {
    //    console.error('Error hatching egg:', error);
    //  }
    //}
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
        setChickenDetails(details);
      } catch (error) {
        console.error('Error getting chicken details:', error);
      }
    }
    else {
      console.log('avaCoqChi is null');

    }
  }, [avaCoqChi, tokenId]);

  // Render the gameplay UI here
  return (
    <div className="gameplay-container">
      <h1>Gameplay</h1>
      <input
        type="text"
        placeholder="Name your CoqChi"
        value={chickenName}
        onChange={(e) => setChickenName(e.target.value)}
      />
      <div className="play-image">
        <Image src={getImageType()} alt="CoqChi" width={500} height={500} />
      </div>
      <button onClick={mintEgg}>Mint Egg</button>

      <div className="controller-container">
        <button onClick={hatchEgg}>Hatch Egg</button>
        <button onClick={feedChicken}>Feed Chicken</button>
        <button onClick={waterChicken}>Water Chicken</button>
        <button onClick={medicateChicken}>Medicate Chicken</button>
        <button onClick={getChickenDetails}>Get Chicken Details</button>
        <button onClick={approveCoq}>Approve All COQ</button>
        <input
          type="number"
          placeholder="Amount of COQ"
          value={coqAmount}
          onChange={(e) => setItemAmount(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Gameplay;
