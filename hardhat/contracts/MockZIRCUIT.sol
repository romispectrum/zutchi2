// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockZIRCUIT is ERC20 {
    constructor() ERC20("ZIRCUIT", "ZIRCUIT") {
        // Mint initial supply to deployer
        _mint(msg.sender, 1000000 * 10**18); // 1 million tokens
    }
    
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
} 