// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Library.sol";

contract CoqChi is ERC721, Ownable {
    ERC20 public COQ_INU_CONTRACT;
    address public ITEMS_CONTRACT;

    uint256 public eggPrice;
    // only if at least the price of amount is approved to spend of COQ_INU_CONTRACT
    modifier onlyApproved(uint256 amount) {
        require(
            COQ_INU_CONTRACT.allowance(msg.sender, address(this)) >= amount,
            "You must approve at least the price to spend"
        );
        _;
    }

    // only if msg.sender is ITEMS_CONTRACT
    modifier onlyItems() {
        require(msg.sender == ITEMS_CONTRACT, "Only items contract can call this function");
        _;
    }

    modifier onlyAlive(uint256 tokenId) {
        require(chickens[tokenId].isAlive == true, "Chicken is dead");
        _;
    }

    // Mapping from token ID to Chicken struct for chickens
    mapping(uint256 => ChickenLib.Chicken) public chickens;

    uint256 private _tokenId;

    // Events
    event EggMinted(address indexed owner, uint256 tokenId, string name);
    event EggHatched(address indexed owner, uint256 tokenId, string name);
    event ChickenStatusUpdated(address indexed owner, uint256 tokenId, uint256 health, uint256 happiness, uint256 lastFed, uint256 lastPlayed);
    event ChickenDead(address indexed owner, uint256 tokenId);
    event TokensWithdrawn(address indexed owner, uint256 amount);
    
    constructor(address _COQ, address _ITEMS)Ownable(msg.sender) ERC721("CoqChi", "CQC") {
        COQ_INU_CONTRACT = ERC20(_COQ);
        ITEMS_CONTRACT = _ITEMS;
        eggPrice = 1000 ether;
    }

    function setEggPrice(uint256 _eggPrice) external onlyOwner {
        eggPrice = _eggPrice;        
    }

    function setCoqContract(address _COQ) external onlyOwner {
        COQ_INU_CONTRACT = ERC20(_COQ);
    }

    function mintEgg(string memory _name) external onlyApproved(eggPrice) {
        COQ_INU_CONTRACT.transferFrom(msg.sender, address(this), eggPrice);
        _tokenId++;
        _mint(msg.sender, _tokenId);
        chickens[_tokenId] = ChickenLib.Chicken(_name, 100, 100, 100, false, block.timestamp, block.timestamp, true);
        emit EggMinted(msg.sender, _tokenId, _name);
    }

    function hatchEgg(uint256 tokenId, string memory name) external {
        require(ownerOf(tokenId) == msg.sender, "You must own the egg to hatch it");
        require(chickens[tokenId].isHatched == false, "Chicken already hatched");
        chickens[tokenId].isHatched = true;
        chickens[tokenId].name = name;
        emit EggHatched(msg.sender, tokenId, name);
    }

    function getChickenDetails(uint256 tokenId) external view onlyAlive(_tokenId) returns (ChickenLib.Chicken memory) {
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        return chickens[tokenId];
    }

    function updateChickenHealth(uint256 tokenId, uint256 health) external onlyItems onlyAlive(_tokenId) {
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        chickens[tokenId].health += health;
        if (chickens[tokenId].health > 100) {
            chickens[tokenId].health = 100;
        }
        emit ChickenStatusUpdated(msg.sender, tokenId, health, chickens[tokenId].happiness, chickens[tokenId].lastFed, chickens[tokenId].lastPlayed);
    }

    function PlayWihCoq(uint256 tokenId) external onlyAlive(_tokenId) {
        require(ownerOf(tokenId) == msg.sender, "You must own the chicken to interact with it");
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        chickens[tokenId].happiness = 100;
        chickens[tokenId].lastPlayed = block.timestamp;
        emit ChickenStatusUpdated(msg.sender, tokenId, chickens[tokenId].health, happiness, chickens[tokenId].lastFed, chickens[tokenId].lastPlayed);
    }

    function updateChickenHunger(uint256 tokenId, uint256 hunger) external onlyItems onlyAlive(_tokenId) {
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        chickens[tokenId].hunger += hunger;
        if (chickens[tokenId].hunger > 100) {
            chickens[tokenId].hunger = 100;
        }
        chickens[tokenId].lastFed = block.timestamp;
        emit ChickenStatusUpdated(msg.sender, tokenId, chickens[tokenId].health, chickens[tokenId].happiness, chickens[tokenId].lastFed, chickens[tokenId].lastPlayed);
    }


    // function to update chicken stats on a regular basis to simulate hunger and happiness
    // deteriorating over time. This function will be called by the timer contract
    function gameplayUpdate() external onlyOwner {
        for (uint256 i = 1; i <= _tokenId; i++) {
            if (chickens[i].isHatched == true && chickens[i].isAlive == true) {
                if (block.timestamp - chickens[i].lastFed >= 6 hours) {
                    chickens[i].hunger -= 10;
                    chickens[i].lastFed = block.timestamp;
                }
                if (block.timestamp - chickens[i].lastPlayed >= 12 hours) {
                    chickens[i].happiness -= 10;
                    chickens[i].lastPlayed = block.timestamp;
                }
                // random chance of chicken getting injured and losing health
                if (block.timestamp % 2 == 0) {
                    chickens[i].health -= 10;
                }
                if (chickens[i].hunger <= 0 || chickens[i].happiness <= 0 || chickens[i].health <= 0) {
                    chickens[i].isAlive = false;
                    emit ChickenDead(msg.sender, i);
                }
            }
        }
    }

    function withdraw() external onlyOwner {
        uint256 balance = COQ_INU_CONTRACT.balanceOf(address(this));
        COQ_INU_CONTRACT.transfer(msg.sender, balance);
        emit TokensWithdrawn(msg.sender, balance);
    }
}

