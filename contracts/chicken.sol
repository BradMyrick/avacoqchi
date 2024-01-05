// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract AvaCoqChi is ERC1155, Ownable, Pausable{
    IERC20 public coqToken;
    uint256 public eggPrice;
    uint256 private _tokenIds;

    // Constants for item types
    uint256 public constant ITEM_FEED = 0;
    uint256 public constant ITEM_WATER = 1;
    uint256 public constant ITEM_MEDICINE = 2;

    struct Chicken {
        string name;
        uint256 health;
        uint256 happiness;
        bool isHatched;
        uint256 lastInteraction;
    }

    // Mapping from token ID to Chicken struct for chickens
    mapping(uint256 => Chicken) public chickens;

    // Mapping from token ID to item count for items
    mapping(uint256 => uint256) public items;

    // Mapping of item ID to coq cost
    mapping(uint256 => uint256) public itemCosts;

    event EggPurchased(address indexed buyer, uint256 tokenId);
    event EggHatched(address indexed owner, uint256 tokenId);
    event ChickenNamed(address indexed owner, uint256 tokenId, string name);
    event ItemMinted(address indexed owner, uint256 itemId, uint256 amount);
    event ItemUsed(address indexed owner, uint256 tokenId, uint256 itemId, uint256 amount);
    event ChickenFed(address indexed owner, uint256 tokenId, uint256 amount);
    event ChickenWatered(address indexed owner, uint256 tokenId, uint256 amount);
    event ChickenMedicated(address indexed owner, uint256 tokenId, uint256 amount);

    constructor(address _coqTokenAddress, uint256 _eggPrice) ERC1155("https://avacoqchi/metadata/") Ownable(msg.sender){
        coqToken = IERC20(_coqTokenAddress);
        eggPrice = _eggPrice;
    }

    function mintEgg() external whenNotPaused {
        require(coqToken.balanceOf(msg.sender) >= eggPrice, "Insufficient COQ balance");
        require(coqToken.allowance(msg.sender, address(this)) >= eggPrice, "Insufficient allowance");
        coqToken.transferFrom(msg.sender, address(this), eggPrice);
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _mint(msg.sender, newItemId, 1, ""); // Mint a single chicken NFT
        chickens[newItemId] = Chicken("", 100, 100, false, block.timestamp);
        emit EggPurchased(msg.sender, newItemId);
    }

    function hatchEgg(uint256 tokenId, string memory name) external {
        require(chickens[tokenId].isHatched == false, "Chicken already hatched");
        chickens[tokenId].isHatched = true;
        chickens[tokenId].name = name;
        emit EggHatched(msg.sender, tokenId);
        emit ChickenNamed(msg.sender, tokenId, name);
    }

    function getChickenDetails(uint256 tokenId) external view returns (Chicken memory) {
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        return chickens[tokenId];
    }

    function mintItem(uint256 itemId, uint256 amount) external {
        require(coqToken.balanceOf(msg.sender) >= itemCosts[itemId] * amount, "Insufficient COQ balance");
        require(coqToken.allowance(msg.sender, address(this)) >= itemCosts[itemId] * amount, "Insufficient allowance");
        coqToken.transferFrom(msg.sender, address(this), itemCosts[itemId] * amount);
        items[itemId] += amount;
        _mint(msg.sender, itemId, amount, "");
        emit ItemMinted(msg.sender, itemId, amount);
    }

    function _useItem(uint256 tokenId, uint256 itemId, uint256 amount) internal {
        require(balanceOf(msg.sender, itemId) >= amount, "Insufficient item balance");
        // burn the item from the user
        _burn(msg.sender, itemId, amount);
        // update the item count
        items[itemId] -= amount;
        emit ItemUsed(msg.sender, tokenId, itemId, amount);
    }


    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setItemCost(uint256 itemId, uint256 cost) external onlyOwner {
        itemCosts[itemId] = cost;
    }

    // two week hackathon, no need to make it too complicated
    // if its a success, we can decentralize the rewards contract withdrawal
    function withdraw() external onlyOwner {
        uint256 balance = coqToken.balanceOf(address(this));
        coqToken.transfer(msg.sender, balance);
    }
    
    // if someone sends tokens to the contract other than coq 
    function withdrawOtherTokens(address _tokenAddress) external onlyOwner {
        IERC20 otherToken = IERC20(_tokenAddress);
        uint256 balance = otherToken.balanceOf(address(this));
        otherToken.transfer(msg.sender, balance);
    }

    // if someone sends avax to the contract
    function withdrawAvax() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function setEggPrice(uint256 _eggPrice) external onlyOwner {
        eggPrice = _eggPrice;
    }

    function setItemPrice(uint256 itemId, uint256 cost) external onlyOwner {
        itemCosts[itemId] = cost;
    }

    // GAME MECHANICS

    // feed chicken
    function feedChicken(uint256 tokenId, uint256 amount) external whenNotPaused {
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        _useItem(tokenId, ITEM_FEED, amount);
        chickens[tokenId].health += amount;
        chickens[tokenId].happiness += amount;
        emit ChickenFed(msg.sender, tokenId, amount);
    }

    // give chicken water
    function waterChicken(uint256 tokenId, uint256 amount) external whenNotPaused {
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        _useItem(tokenId, ITEM_WATER, amount);
        chickens[tokenId].health += amount;
        chickens[tokenId].happiness += amount;
        emit ChickenWatered(msg.sender, tokenId, amount);
    }

    // give chicken medicine
    function medicateChicken(uint256 tokenId, uint256 amount) external whenNotPaused {
        require(chickens[tokenId].isHatched == true, "Chicken not hatched");
        _useItem(tokenId, ITEM_MEDICINE, amount);
        chickens[tokenId].health += amount;
        chickens[tokenId].happiness += amount;
        emit ChickenMedicated(msg.sender, tokenId, amount);
    }

    function schrodingerChicken(uint256 tokenId) external returns (Chicken memory) {
        // update chicken health and happiness based on time since last interaction
        // and some random number generation for fun
        Chicken memory chicken = chickens[tokenId];
        uint256 timeSinceLastInteraction = block.timestamp - chicken.lastInteraction;
        uint256 random = block.prevrandao;
        uint256 healthChange = random % 10;
        uint256 happinessChange = random % 10;
        // update chicken health and happiness based on time since last interaction
        // this is a bit of a hack, but it works for now
        if (timeSinceLastInteraction > 1 days) {
            chicken.health -= healthChange;
            chicken.happiness -= happinessChange;
        } else if (timeSinceLastInteraction > 12 hours) {
            chicken.health -= healthChange / 2;
            chicken.happiness -= happinessChange / 2;
        } else if (timeSinceLastInteraction > 6 hours) {
            chicken.health -= healthChange / 4;
            chicken.happiness -= happinessChange / 4;
        } else if (timeSinceLastInteraction > 3 hours) {
            chicken.health -= healthChange / 8;
            chicken.happiness -= happinessChange / 8;
        } else if (timeSinceLastInteraction > 1 hours) {
            chicken.health -= healthChange / 16;
            chicken.happiness -= happinessChange / 16;
        } else if (timeSinceLastInteraction > 30 minutes) {
            chicken.health -= healthChange / 32;
            chicken.happiness -= happinessChange / 32;
        } else if (timeSinceLastInteraction > 15 minutes) {
            chicken.health -= healthChange / 64;
            chicken.happiness -= happinessChange / 64;
        } else if (timeSinceLastInteraction > 5 minutes) {
            chicken.health -= healthChange / 128;
            chicken.happiness -= happinessChange / 128;
        } else if (timeSinceLastInteraction > 1 minutes) {
            chicken.health -= healthChange / 256;
            chicken.happiness -= happinessChange / 256;
        } else if (timeSinceLastInteraction > 30 seconds) {
            chicken.health -= healthChange / 512;
            chicken.happiness -= happinessChange / 512;
        } else if (timeSinceLastInteraction > 10 seconds) {
            chicken.health -= healthChange / 1024;
            chicken.happiness -= happinessChange / 1024;
        } else if (timeSinceLastInteraction > 5 seconds) {
            chicken.health -= healthChange / 2048;
            chicken.happiness -= happinessChange / 2048;
        } else if (timeSinceLastInteraction > 1 seconds) {
            chicken.health -= healthChange / 4096;
            chicken.happiness -= happinessChange / 4096;
        } else {
            chicken.health -= healthChange / 8192;
            chicken.happiness -= happinessChange / 8192;
        }
        
        // cap health and happiness low at 0 and high at 100
        if (chicken.health < 0) {
            chicken.health = 0;
        } else if (chicken.health > 100) {
            chicken.health = 100;
        }
        chicken.lastInteraction = block.timestamp;


        chickens[tokenId] = chicken;
        return chicken;
    }
}