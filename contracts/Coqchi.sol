// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Library.sol";
contract CoqChi is ERC721, Ownable {
    address public gameplayContract;

    // only gameplay contract can call functions with this modifier
    modifier onlyGameplay() {
        require(msg.sender == gameplayContract, "Only gameplay contract can call this function");
        _;
    }

    // Mapping from token ID to Chicken struct for chickens
    mapping(uint256 => ChickenLib.Chicken) public chickens;

    uint256 private _tokenIds;

    // Events
    event EggMinted(address indexed owner, uint256 tokenId, string name);
    event EggHatched(address indexed owner, uint256 tokenId, string name);
    event ChickenStatusUpdated(address indexed owner, uint256 tokenId, uint256 health, uint256 happiness, uint256 lastInteraction);
    event ChickenDead(address indexed owner, uint256 tokenId);

    constructor()Ownable(msg.sender) ERC721("CoqChi", "CQC") {}

    function setGameplayContract(address _gameplayContract) external onlyOwner {
        gameplayContract = _gameplayContract;
    }

    function mintEgg(string calldata _name) external onlyGameplay {
        _tokenIds++;
        uint256 newChickenId = _tokenIds;
        _mint(msg.sender, newChickenId);
        chickens[newChickenId] = ChickenLib.Chicken(_name, 100, 100, 100, false, block.timestamp);
        emit EggMinted(msg.sender, newChickenId, _name);
    }

    function hatchEgg(uint256 tokenId, string memory name) external onlyGameplay {
        require(chickens[tokenId].isHatched == false, "Chicken already hatched");
        chickens[tokenId].isHatched = true;
        chickens[tokenId].name = name;
        emit EggHatched(msg.sender, tokenId, name);
    }

    function getChickenDetails(uint256 tokenId) external view returns (ChickenLib.Chicken memory) {
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        return chickens[tokenId];
    }

    function updateChickenHealth(uint256 tokenId, uint256 health) external onlyGameplay {
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        chickens[tokenId].health = health;
        emit ChickenStatusUpdated(msg.sender, tokenId, health, chickens[tokenId].happiness, chickens[tokenId].lastInteraction);
    }

    function updateChickenHappiness(uint256 tokenId, uint256 happiness) external onlyGameplay {
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        chickens[tokenId].happiness = happiness;
        emit ChickenStatusUpdated(msg.sender, tokenId, chickens[tokenId].health, happiness, chickens[tokenId].lastInteraction);
    }

    function updateChickenLastInteraction(uint256 tokenId, uint256 lastInteraction) external onlyGameplay {
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        chickens[tokenId].lastInteraction = lastInteraction;
        emit ChickenStatusUpdated(msg.sender, tokenId, chickens[tokenId].health, chickens[tokenId].happiness, lastInteraction);
    }

    function updateChickenHunger(uint256 tokenId, uint256 hunger) external onlyGameplay {
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        chickens[tokenId].hunger = hunger;
        emit ChickenStatusUpdated(msg.sender, tokenId, chickens[tokenId].health, chickens[tokenId].happiness, chickens[tokenId].lastInteraction);
    }

    function deadChicken(uint256 tokenId) external onlyGameplay {
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        require(chickens[tokenId].health == 0, "Chicken not dead");
        _burn(tokenId);
        delete chickens[tokenId];
        emit ChickenDead(msg.sender, tokenId);
    }
}
