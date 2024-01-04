// Inventory.tsx
import React from 'react';
import ItemsCard from './ItemCard';

const Inventory = () => {
  // TODO: Fetch the inventory items from backend
  const inventoryItems = [
    { id: 1, name: 'Feed', description: 'Sustenance for chickens' },
    { id: 2, name: 'Water', description: 'Hydration is key' },
    { id: 3, name: 'Medicine', description: 'Heals wounds' },
  ];

  return (
    <div className="inventory">
      <h3>Inventory</h3>
      {inventoryItems.map(item => (
        <ItemsCard key={item.id} name={item.name} description={item.description} />
      ))}
    </div>
  );
};

export default Inventory;
