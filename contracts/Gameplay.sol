// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Library.sol";
import "./Coqchi.sol";
import "./Items.sol";



contract Gameplay is Ownable {
    CoqChi public chickenContract;
    Items public itemsContract;
    ERC20 public coqContract;

    uint256 public playAmount;

    uint256 public eggPrice;
    // Events
    event ChickenFed(address indexed owner, uint256 tokenId, uint256 amount);
    event ChickenWatered(
        address indexed owner,
        uint256 tokenId,
        uint256 amount
    );
    event ChickenMedicated(
        address indexed owner,
        uint256 tokenId,
        uint256 amount
    );
    event ChickenPlayed(address indexed owner, uint256 tokenId);
    event ChickenHatched(address indexed owner, uint256 tokenId, string name);
    event ChickenLastInteractionUpdated(
        address indexed owner,
        uint256 tokenId,
        uint256 lastInteraction
    );
    event ChickenDead(address indexed owner, uint256 tokenId);
    event UpdatedLastInteraction(address indexed owner, uint256 tokenId);

    mapping(uint256 => uint256) public chickenFeedPower;
    mapping(uint256 => uint256) public chickenWaterPower;
    mapping(uint256 => uint256) public chickenMedicinePower;

    // constructor
    constructor(
        address _chickenAddress,
        address _itemsAddress
    ) Ownable(msg.sender) {
        playAmount = 60;
        chickenContract = CoqChi(_chickenAddress);
        itemsContract = Items(_itemsAddress);
    }

    // set chicken contract address
    function setChickenContract(address _chickenAddress) external onlyOwner {
        chickenContract = CoqChi(_chickenAddress);
    }

    // set items contract address
    function setItemsContract(address _itemsAddress) external onlyOwner {
        itemsContract = Items(_itemsAddress);
    }

    // set play amount
    function setPlayAmount(uint256 _playAmount) external onlyOwner {
        playAmount = _playAmount;
    }

    // set Conq Inu contract address
    function setCoqContract(address _coqAddress) external onlyOwner {
        coqContract = ERC20(_coqAddress);
    }

    // set egg price
    function setEggPrice(uint256 _eggPrice) external onlyOwner {
        eggPrice = _eggPrice;
    }

    // use feed
    function useFeed(uint256 itemId, uint256 amount) external {
        require(
            chickenContract.ownerOf(itemId) == msg.sender,
            "Not the owner of the chicken"
        );
        emit ChickenFed(msg.sender, itemId, amount);
        itemsContract.useFeed(itemId, amount);
        chickenContract.updateChickenHunger(
            itemId,
            chickenFeedPower[itemId] * amount
        );
    }

    // use water
    function useWater(uint256 itemId, uint256 amount) external {
        require(
            chickenContract.ownerOf(itemId) == msg.sender,
            "Not the owner of the chicken"
        );
        emit ChickenWatered(msg.sender, itemId, amount);
        itemsContract.useWater(itemId, amount);
        chickenContract.updateChickenHunger(
            itemId,
            chickenWaterPower[itemId] * amount
        );
    }

    // use medicine
    function useMedicine(uint256 tokenId, uint256 itemId, uint256 amount) external {
        require(
            chickenContract.ownerOf(tokenId) == msg.sender,
            "Not the owner of the chicken"
        );
        emit ChickenMedicated(msg.sender, tokenId, amount);
        itemsContract.useMedicine(itemId, amount);
        chickenContract.updateChickenHunger(
            itemId,
            chickenMedicinePower[itemId] * amount
        );
    }

    // hatch egg
    function hatchEgg(uint256 tokenId, string memory name) external {
        require(
            chickenContract.ownerOf(tokenId) == msg.sender,
            "Not the owner of the chicken"
        );
        emit ChickenHatched(msg.sender, tokenId, name);
        chickenContract.hatchEgg(tokenId, name);
    }

    // play with chicken
    function playWithChicken(uint256 tokenId) external {
        require(
            chickenContract.ownerOf(tokenId) == msg.sender,
            "Not the owner of the chicken"
        );
        emit ChickenPlayed(msg.sender, tokenId);
        chickenContract.updateChickenHappiness(tokenId, playAmount);
    }

    // update last interaction
    function updateChickenLastInteraction(uint256 tokenId) external {
        require(
            chickenContract.ownerOf(tokenId) == msg.sender,
            "Not the owner of the chicken"
        );
        // update chicken status based off time passed
        ChickenLib.Chicken memory chicken = chickenContract.getChickenDetails(tokenId);
        
        if (chicken.hunger > 0) {
            uint256 hungerDamage = _calculateHungerDamage(chicken.lastInteraction);
            if (hungerDamage > chicken.hunger) {
                _deadChicken(tokenId);
                emit ChickenDead(msg.sender, tokenId);
            } else {
                chickenContract.updateChickenHealth(
                    tokenId,
                    chicken.hunger - hungerDamage
                );
            }
        } 
        else if (chicken.happiness > 0) {
            uint256 happinessDamage = _calculateHappinessDamage(chicken.lastInteraction);
            if (happinessDamage > chicken.happiness) {
                _deadChicken(tokenId);
                emit ChickenDead(msg.sender, tokenId);
            } else {
                chickenContract.updateChickenHealth(
                    tokenId,
                    chicken.health - happinessDamage
                );
            }
        } 
        else if (chicken.health > 0) {
            uint256 healthDamage = _calculateHealthDamage(tokenId);
            if (healthDamage > chicken.health) {
                _deadChicken(tokenId);
                emit ChickenDead(msg.sender, tokenId);
            } else {
                chickenContract.updateChickenHealth(
                    tokenId,
                    chicken.health - healthDamage
                );
            }
        } 
        else {
            emit ChickenDead(msg.sender, tokenId);
            _deadChicken(tokenId);
        }
        emit ChickenLastInteractionUpdated(
            msg.sender,
            tokenId,
            block.timestamp
        );
        chickenContract.updateChickenLastInteraction(tokenId, block.timestamp);
    }

    // dead chicken
    function _deadChicken(uint256 tokenId) internal {
        chickenContract.deadChicken(tokenId);
    }

    // calculate hunger damage
    function _calculateHungerDamage(
        uint256 lastInteraction
    ) internal view returns (uint256) {
        // 1 - 100 range for hunger time since last interaction increases damage
        // 2 days without food = 100% damage
        uint256 timePassed = block.timestamp - lastInteraction;
        if (timePassed > 2 days) {
            return 100;
        } else if (timePassed > 1 days) {
            return 50;
        } else if (timePassed > 12 hours) {
            return 25;
        } else if (timePassed > 6 hours) {
            return 10;
        } else if (timePassed > 3 hours) {
            return 5;
        } else if (timePassed > 1 hours) {
            return 2;
        } else if (timePassed > 30 minutes) {
            return 1;
        } else {
            return 0;
        }
    }

    // calculate happiness damage
    function _calculateHappinessDamage(
        uint256 lastInteraction
    ) internal view returns (uint256) {
        // 1 - 100 range for happiness time since last interaction increases damage
        // 4 days without play = 100% damage
        uint256 timePassed = block.timestamp - lastInteraction;

        if (timePassed > 4 days) {
            return 100;
        } else if (timePassed > 2 days) {
            return 50;
        } else if (timePassed > 1 days) {
            return 25;
        } else if (timePassed > 12 hours) {
            return 10;
        } else if (timePassed > 6 hours) {
            return 5;
        } else if (timePassed > 3 hours) {
            return 2;
        } else if (timePassed > 1 hours) {
            return 1;
        } else {
            return 0;
        }
    }

    // calculate health damage
    function _calculateHealthDamage(
        uint256 tokenId
    ) internal view returns (uint256) {
        // random chance of damage that must be healed with medicine
        // 2 - 8 possible damage if random hits
        uint256 random = uint256(
            keccak256(abi.encodePacked(block.timestamp, tokenId))
        );
        if (random % 2 == 0) {
            return random % 8;
        } else {
            return 0;
        }
    }

    // withdraw tokens
    function withdrawTokens(address tokenAddress, uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        IERC20 token = IERC20(tokenAddress);
        token.transfer(msg.sender, amount);
    }

    // mint egg
    function mintEgg(string calldata _name) external onlyOwner {
        require(coqContract.balanceOf(msg.sender) >= eggPrice, "Not enough Coq Inu");
        chickenContract.mintEgg(_name);
    }

    // get chicken details
    function getChickenDetails(uint256 tokenId) external view returns (ChickenLib.Chicken memory) {
        return chickenContract.getChickenDetails(tokenId);
    }

}
