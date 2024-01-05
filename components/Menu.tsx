import React, { useState, useEffect } from 'react';
import MetaMaskCard from './connectorCards/MetaMaskCard';
import WalletConnectCard from './connectorCards/WalletConnectV2Card';
import Inventory from './Inventory';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('metamask'); // default to MetaMask

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleWalletSelection = (wallet) => {
    setSelectedWallet(wallet);
  };
 
  return (
    <>
      <button className="hamburger-button" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`menu-container ${isOpen ? 'open' : ''}`}>
        <div className="wallet-selector">
          <button onClick={() => handleWalletSelection('metamask')}>MetaMask</button>
          <button onClick={() => handleWalletSelection('walletconnect')}>WalletConnect</button>
        </div>
        {selectedWallet === 'metamask' && <MetaMaskCard />}
        {selectedWallet === 'walletconnect' && <WalletConnectCard />}
        <Inventory />
      </div>
    </>
  );
};

export default Menu;
