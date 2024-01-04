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
            {isEgg ? (
                // If the chicken is still an egg, show the naming interface
                <div className="naming-interface">
                    <div className="chicken-image">🐣</div>
                    <input
                        type="text"
                        placeholder="Name your chicken"
                        value={chickenName}
                        onChange={(e) => setChickenName(e.target.value)}
                    />
                    <button onClick={() => setIsEgg(false)}>Start Game</button>
                </div>
            ) : (
                // If the chicken has hatched, show the chicken and its care interface
                <div className="chicken-container">
                    <div className="chicken">
                        <div className="chicken-image">🐔</div>                    
                    </div>
                    <div className="chicken-status">
                        <p>Name: {chicken.name}</p>
                        <p>Health: {chicken.health}</p>
                        <p>Happiness: {chicken.happiness}</p>
                    </div>
                    {/* The chicken interactions are now handled by the Gameplay component */}
                </div>
            )}
        </div>
    );
}

export default PlayArea;
