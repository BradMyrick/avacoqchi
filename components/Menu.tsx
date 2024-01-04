import React, { useState, useEffect } from 'react';
import MetaMaskCard from './connectorCards/MetaMaskCard';
import WalletConnectCard from './connectorCards/WalletConnectV2Card';
import CoinbaseWalletCard from './connectorCards/CoinbaseWalletCard';
import Inventory from './Inventory';
import ItemsCard from './ItemCard';

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
        {/* TODO: Icon or text for hamburger menu */}
        ☰
      </button>
      <div className={`menu-container ${isOpen ? 'open' : ''}`}>
        <div className="wallet-selector">
          <button onClick={() => handleWalletSelection('metamask')}>MetaMask</button>
          <button onClick={() => handleWalletSelection('walletconnect')}>WalletConnect</button>
          <button onClick={() => handleWalletSelection('coinbase')}>Coinbase Wallet</button>
        </div>
        {selectedWallet === 'metamask' && <MetaMaskCard />}
        {selectedWallet === 'walletconnect' && <WalletConnectCard />}
        {selectedWallet === 'coinbase' && <CoinbaseWalletCard />}
        <Inventory />
      </div>
    </>
  );
};

export default Menu;
