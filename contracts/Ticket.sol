//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Ticket is ERC721Enumerable {
    constructor() ERC721("Punk Mystery Box Vol.1", "PBOX") {
    }
}