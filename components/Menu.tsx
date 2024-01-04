// Menu.tsx
import React, { useState } from 'react';
import MetaMaskCard from './connectorCards/MetaMaskCard';
import WalletConnectCard from './connectorCards/WalletConnectV2Card';
import CoinbaseWalletCard from './connectorCards/CoinbaseWalletCard';

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
        {/* Icon or text for hamburger menu */}
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
      </div>

      <style jsx>{`
        .hamburger-button {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 100;
          cursor: pointer;
        }
        .menu-container {
          position: fixed;
          top: 0;
          right: -100%;
          width: 300px;
          height: 100%;
          background: white;
          box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
          transition: right 0.3s ease;
          z-index: 90;
          padding: 1rem;
          display: flex;
          flex-direction: column;
        }
        .menu-container.open {
          right: 0;
        }
        .wallet-selector {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }
        .wallet-selector button {
          margin-bottom: 0.5rem;
          padding: 0.5rem;
          background: #f0f0f0;
          border: none;
          cursor: pointer;
        }
        .wallet-selector button:hover {
          background: #e0e0e0;
        }
      `}</style>
    </>
  );
};

export default Menu;
