// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BombermanNFT is ERC721 {
    uint256 private _countTokens = 50;

    constructor() ERC721("BombermanNFT", "BBMN") {}
    
    function mintNFT(address to) public {
        require(to != address(0), "You can't mint to the zero address");
        require(_countTokens > 0, "All tokens have been minted");
        _countTokens = _countTokens - 1;
        _safeMint(to, _countTokens);
    }

    function getCountNFTsAvailable() public view returns (uint256) {
        return _countTokens;
    }
}