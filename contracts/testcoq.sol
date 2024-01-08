// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CoqInu is ERC20 {
    constructor() ERC20("Coq Inu", "COQINU") {
        _mint(msg.sender, 10000 ether);
    }

    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }
}