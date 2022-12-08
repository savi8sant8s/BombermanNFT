// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Bomberman4 {
    uint private amountTokens;

    constructor() {
        amountTokens = 50;
    }

    function getAmountTokens() public view returns (uint) {
        return amountTokens;
    }
}
