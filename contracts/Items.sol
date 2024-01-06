// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Items is ERC1155, Ownable {
    ERC20 public constant COQ_INU_CONTRACT =
        ERC20(0x420FcA0121DC28039145009570975747295f2329);
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

    address public gameplayContract;

    // only gameplay contract can call functions with this modifier
    modifier onlyGameplay() {
        require(msg.sender == gameplayContract, "Only gameplay contract can call this function");
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

    constructor() Ownable(msg.sender) ERC1155("https://avacoqchi.io/api/items/{id}.json") {
        validFeedIds[FEED_BASIC] = true;
        validFeedIds[FEED_PREMIUM] = true;
        validFeedIds[FEED_DELUXE] = true;
        validWaterIds[WATER_BASIC] = true;
        validWaterIds[WATER_PREMIUM] = true;
        validWaterIds[WATER_DELUXE] = true;
        validMedicineIds[MEDICINE_BASIC] = true;
        validMedicineIds[MEDICINE_PREMIUM] = true;
        validMedicineIds[MEDICINE_DELUXE] = true;
    }

    // Function to use feed
    function useFeed(uint256 itemId, uint256 amount) external onlyGameplay {
        require(validFeedIds[itemId], "Invalid item");
        require(amount == 1, "Amount must be 1");
        require(balanceOf(msg.sender, itemId) >= amount, "Not enough items");
        _burn(msg.sender, itemId, amount);
        emit ItemUsed(msg.sender, itemId, amount);
    }

    // Function to use water
    function useWater(uint256 itemId, uint256 amount) external onlyGameplay {
        require(validWaterIds[itemId], "Invalid item");
        require(amount == 1, "Amount must be 1");
        require(balanceOf(msg.sender, itemId) >= amount, "Not enough items");
        _burn(msg.sender, itemId, amount);
        emit ItemUsed(msg.sender, itemId, amount);
    }

    // Function to use medicine
    function useMedicine(uint256 itemId, uint256 amount) external onlyGameplay {
        require(validMedicineIds[itemId], "Invalid item");
        require(amount == 1, "Amount must be 1");
        require(balanceOf(msg.sender, itemId) >= amount, "Not enough items");
        _burn(msg.sender, itemId, amount);
        emit ItemUsed(msg.sender, itemId, amount);
    }

    // Function to set item prices
    function setItemPrices(uint256 itemId, uint256 price) external onlyOwner {
        itemPrices[itemId] = price;
        emit ItemPriceSet(itemId, price);
    }

    // Function to mint items
    function mint(address account, uint256 itemId, uint256 amount) external {
        require(
            COQ_INU_CONTRACT.balanceOf(msg.sender) >= itemPrices[itemId],
            "Not enough Coq Inu"
        );
        require( validFeedIds[itemId] || validWaterIds[itemId] || validMedicineIds[itemId], "Invalid item");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= 100, "Amount must be less than or equal to 100");
        require(itemPrices[itemId] > 0, "Item not for sale");
        require(
            COQ_INU_CONTRACT.allowance(msg.sender, address(this)) >=
                itemPrices[itemId] * amount,
            "Not enough allowance"
        );
        COQ_INU_CONTRACT.transferFrom(
            msg.sender,
            address(this),
            itemPrices[itemId]
        );
        emit ItemMinted(account, itemId, amount);
        _mint(account, itemId, amount, "");
    }

    // Function to get the price of an item
    function getItemPrice(uint256 itemId) external view returns (uint256) {
        return itemPrices[itemId];
    }

    // Function to check if an item ID is valid
    function isValidItem(uint256 itemId) public view returns (bool) {
        return itemPrices[itemId] != 0;
    }

    // Function to get the balance of an item for a user
    function balanceOfItem(
        address user,
        uint256 itemId
    ) external view returns (uint256) {
        return balanceOf(user, itemId);
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

}
