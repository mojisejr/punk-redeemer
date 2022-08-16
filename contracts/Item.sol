//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "hardhat/console.sol";

contract Item is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    constructor() ERC721("Punk Mystery Box Vol.1", "PBOX") {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC721) returns(bool) {
        return super.supportsInterface(interfaceId);
    }

    function minterMint(uint256[] calldata tokensId, address redeemer) public {
        require(hasRole(MINTER_ROLE, _msgSender()), 'unauthorized');
        require(tokensId.length > 0, 'invalid tokens input');
        require(redeemer != address(0), 'cannot be address 0');
        console.log('item redeemer: %s', redeemer);
        console.log('tokenId', tokensId[0]);
        console.log('tokenId', tokensId[1]);
        uint256 num = tokensId.length;
        for(uint256 i = 0; i < num; i++) {
            _safeMint(redeemer, tokensId[i]);
        }
    }

}