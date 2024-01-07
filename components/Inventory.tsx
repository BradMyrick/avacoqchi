// Inventory.tsx
import React, { useEffect, useState } from 'react';
import ItemsCard from './ItemCard';
import { ethers } from 'ethers';
import { getInventory } from './Interactions';

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getItems = async () => {
      const items = await getInventory();
      setInventoryItems(items);
      setLoading(false);
    };
    getItems();
  }, []);

  const renderItems = () => {
    return inventoryItems.map((item, index) => {
      return <ItemsCard key={index} name={item.name} description={item.description} />;
    });
  };

  return (
    <div className="inventory">
      <h1>Inventory</h1>
      <div className="inventory-items">{renderItems()}</div>
    </div>
  );

}
