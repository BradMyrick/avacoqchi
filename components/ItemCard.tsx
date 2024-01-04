// ItemsCard.tsx
import React from 'react';

const ItemsCard = ({ name, description }) => {
  return (
    <div className="items-card">
      <h4>{name}</h4>
      <p>{description}</p>
    </div>
  );
};

export default ItemsCard;
