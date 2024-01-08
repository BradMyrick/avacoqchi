// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library ChickenLib {
    struct Chicken {
        string name;
        uint256 health;
        uint256 happiness;
        uint256 hunger;
        bool isHatched;
        uint256 lastFed;
        uint256 lastPlayed;
        bool isAlive;
    }
    
}