// PlayArea.tsx
import React, { useState, useEffect } from 'react';
import Gameplay from './Gameplay';

const PlayArea = () => {
    const [isEgg, setIsEgg] = useState(true); // State to determine if the chicken is still an egg
    const [chickenName, setChickenName] = useState('');
    const [chicken, setChicken] = useState({
        tokenId: null, // Token ID of the chicken NFT
        name: '',
        health: 100,
        happiness: 100,
        // Additional chicken states can be added here
    });

    // TODO: Fetch chicken state from smart contract
    // This effect could be used to fetch the current state of the chicken from the blockchain
    useEffect(() => {
        // Fetch chicken details throu Gameplay component
        
    }, []);

    // Function to update the local state with the chicken's details from the blockchain
    const updateChickenState = (details) => {
        setChicken({
            tokenId: details.tokenId,
            name: details.name,
            health: details.health,
            happiness: details.happiness,
            // Set additional states if needed
        });
    };

    return (
        <div className="play-area">
            <Gameplay/>
        </div>
    );
}

export default PlayArea;
