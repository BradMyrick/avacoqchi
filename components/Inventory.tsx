// Inventory.tsx
import React, { useEffect, useState } from 'react';
import ItemsCard from './ItemCard';
import { ethers } from 'ethers';
import { getInventory } from './Interactions';
import { hooks, metaMask } from '../connectors/metaMask'
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks
const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const provider = useProvider()
  const accounts = useAccounts()

  const getInventoryItems = async () => {
    if (!provider || !accounts) return;
    const inventory = await getInventory(accounts[0]);
    setInventoryItems(inventory);
    setLoading(false);
  }

  useEffect(() => {
    getInventoryItems();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Inventory</h1>
      <div className="flex flex-wrap justify-center">
        {inventoryItems}
      </div>
    </div>
  );
}

export default Inventory;