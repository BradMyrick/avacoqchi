// Menu.tsx is a component that renders a menu that allows the user to select a wallet and interact with the game.
import React, { useState, useEffect } from 'react';
import MetaMaskCard from './connectorCards/MetaMaskCard';
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
        </div>
        {selectedWallet === 'metamask' && <MetaMaskCard />}
        <Inventory />
      </div>
    </>
  );
};

export default Menu;
