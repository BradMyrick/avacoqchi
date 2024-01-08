// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Library.sol";
import "./Coqchi.sol";

contract Items is ERC1155, Ownable {
    ERC20 public COQ_INU_CONTRACT;
    CoqChi public COQCHI_CONTRACT;
    ChickenLib.Chicken public chicken;

    // Define item types
    // Feed
    uint256 public constant FEED_BASIC = 0;
    uint256 public constant FEED_PREMIUM = 1;
    uint256 public constant FEED_DELUXE = 2;

    // Water
    uint256 public constant WATER_BASIC = 3;
    uint256 public constant WATER_PREMIUM = 4;
    uint256 public constant WATER_DELUXE = 5;

    // Medicine
    uint256 public constant MEDICINE_BASIC = 6;
    uint256 public constant MEDICINE_PREMIUM = 7;
    uint256 public constant MEDICINE_DELUXE = 8;

    // Mappings
    mapping(uint256 => uint256) public itemPrices;
    mapping(uint256 => bool) public validFeedIds;
    mapping(uint256 => bool) public validWaterIds;
    mapping(uint256 => bool) public validMedicineIds;
    mapping(uint256 => uint256) public itemPower;

    address public gameplayContract;

    // only gameplay contract can call functions with this modifier
    modifier onlyTokenOwner(uint256 tokenId) {
        require(
            msg.sender == COQCHI_CONTRACT.ownerOf(tokenId),
            "Only token owner can call this function"
        );
        _;
    }

    modifier onlyApproved(uint256 amount) {
        require(
            COQ_INU_CONTRACT.allowance(msg.sender, address(this)) >= amount,
            "You must approve at least the price to spend"
        );
        _;
    }


    // Events
    event ItemUsed(
        address indexed user,
        uint256 indexed itemId,
        uint256 amount
    );
    event ItemPriceSet(uint256 indexed itemId, uint256 price);
    event ItemMinted(
        address indexed account,
        uint256 indexed itemId,
        uint256 amount
    );
    event TokensWithdrawn(address indexed owner, uint256 amount);

    constructor(address _COQ, address _COQCHI) Ownable(msg.sender) ERC1155("https://avacoqchi.io/api/items/{id}.json") {
        COQ_INU_CONTRACT = ERC20(_COQ);
        COQCHI_CONTRACT = CoqChi(_COQCHI);
        itemPrices[FEED_BASIC] = 100 ether;
        itemPower[FEED_BASIC] = 10;
        itemPrices[FEED_PREMIUM] = 200 ether;
        itemPower[FEED_PREMIUM] = 20;
        itemPrices[FEED_DELUXE] = 300 ether;
        itemPower[FEED_DELUXE] = 30;
        itemPrices[WATER_BASIC] = 10 ether;
        itemPower[WATER_BASIC] = 1;
        itemPrices[WATER_PREMIUM] = 20 ether;
        itemPower[WATER_PREMIUM] = 2;
        itemPrices[WATER_DELUXE] = 30 ether;
        itemPower[WATER_DELUXE] = 3;
        itemPrices[MEDICINE_BASIC] = 1000 ether;
        itemPower[MEDICINE_BASIC] = 25;
        itemPrices[MEDICINE_PREMIUM] = 2000 ether;
        itemPower[MEDICINE_PREMIUM] = 50;
        itemPrices[MEDICINE_DELUXE] = 3000 ether;
        itemPower[MEDICINE_DELUXE] = 75;
    }

    // Function to use feed
    function useFeed(uint256 itemId, uint256 amount) external onlyTokenOwner(token) {
        require(itemId == FEED_BASIC || itemId == FEED_PREMIUM || itemId == FEED_DELUXE, "Invalid item");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender, itemId) >= amount, "Not enough items");
        _burn(msg.sender, itemId, amount);
        // Update chicken stats
        uint256 power = 
        COQCHI_CONTRACT.updateChickenHunger(token, itemPower[itemId]);
        emit ItemUsed(msg.sender, itemId, amount);
    }

    // Function to use water
    function useWater(uint256 itemId, uint256 amount) external onlyTokenOwner(token) {
        require(itemId == WATER_BASIC || itemId == WATER_PREMIUM || itemId == WATER_DELUXE, "Invalid item");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender, itemId) >= amount, "Not enough items");
        _burn(msg.sender, itemId, amount);
        COQCHI_CONTRACT.updateChickenHunger(token, itemPower[itemId]);
        emit ItemUsed(msg.sender, itemId, amount);
    }

    // Function to use medicine
    function useMedicine(uint256 token, uint256 itemId, uint256 amount) external onlyTokenOwner(token) {
        require(itemId == MEDICINE_BASIC || itemId == MEDICINE_PREMIUM || itemId == MEDICINE_DELUXE, "Invalid item");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender, itemId) >= amount, "Not enough items");
        _burn(msg.sender, itemId, amount);
        COQCHI_CONTRACT.updateChickenHealth(token, itemPower[itemId]);
        emit ItemUsed(msg.sender, itemId, amount);
    }

    // Function to set item prices
    function setItemPrices(uint256 itemId, uint256 price, uint256 power) external onlyOwner {
        itemPrices[itemId] = price;
        itemPower[itemId] = power;
        emit ItemPriceSet(itemId, price);
    }

    // Function to mint items
    function mintItem(uint256 itemId, uint256 amount) external onlyApproved(itemPrices[itemId] * amount) {
        require( validFeedIds[itemId] || validWaterIds[itemId] || validMedicineIds[itemId], "Invalid item");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= 100, "Amount must be less than or equal to 100");
        require(itemPrices[itemId] > 0, "Item not for sale");
        COQ_INU_CONTRACT.transferFrom(
            msg.sender,
            address(this),
            itemPrices[itemId]
        );
        emit ItemMinted(msg.sender, itemId, amount);
        _mint(msg.sender, itemId, amount, "");
    }

    // Function to get the price of an item
    function getItemPrice(uint256 itemId) external view returns (uint256) {
        return itemPrices[itemId];
    }

    // Function to check if an item ID is valid
    function isValidItem(uint256 itemId) public view returns (bool) {
        return itemPrices[itemId] != 0;
    }

    // Function to transfer items between users
    function transferItem(
        address from,
        address to,
        uint256 itemId,
        uint256 amount
    ) external {
        require(from != address(0) && to != address(0), "Invalid address");
        require(balanceOf(from, itemId) >= amount, "Insufficient item balance");
        safeTransferFrom(from, to, itemId, amount, "");
    }

    // Override withdraw to emit an event
    function withdraw() external onlyOwner {
        uint256 balance = COQ_INU_CONTRACT.balanceOf(address(this));
        COQ_INU_CONTRACT.transfer(msg.sender, balance);
        emit TokensWithdrawn(msg.sender, balance);
    }

    function getInventory(
        address user
    ) external view returns (uint256[] memory, uint256[] memory) {
        uint256[] memory ids = new uint256[](9);
        uint256[] memory amounts = new uint256[](9);
        for (uint256 i = 0; i < 9; i++) {
            ids[i] = i;
            amounts[i] = balanceOf(user, i);
        }
        return (ids, amounts);
    }

    // Gameplay mechanics

    // instead of a gameplay contract, this contract will be the items and gameplay contract


}
