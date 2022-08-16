//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
pragma abicoder v2;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "hardhat/console.sol";
import "./Item.sol";


contract PunkRedeemer is EIP712, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private constant SIGNING_DOAMIN = "PunkRedeemer";
    string private constant SIGNATURE_VERSION = "1";
    bytes32 public constant INFO_TYPED_HASH = keccak256("Ticket(address ticketContract,uint256 ticketId,uint256[] tokens,address redeemer)");

    struct Ticket {
        address ticketContract;
        uint256 ticketId;
        uint256[] tokens;
        address redeemer;
        bytes signature;
    }

    address itemContract;

    event Redeemed(address redeemer, uint256[] tokens);

    constructor(address minter) EIP712(SIGNING_DOAMIN, SIGNATURE_VERSION) {
        _setupRole(MINTER_ROLE, minter);
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function setItemContract(address item) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), 'unauthorized');
        itemContract = item;
    }

    function redeem(Ticket calldata info) public {
        address signer = _verify(info);
        console.log("signer: %s", signer);
        require(hasRole(MINTER_ROLE, signer), 'invalid signature or unauthorized');
        Item(itemContract).minterMint(info.tokens, info.redeemer);

        emit Redeemed(info.redeemer,info.tokens);
    }


    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _hash(Ticket calldata info) internal view returns(bytes32) {
        bytes32 h =  _hashTypedDataV4(
            keccak256(abi.encode(
                INFO_TYPED_HASH,
                info.ticketContract,
                info.ticketId,
                keccak256(abi.encodePacked(info.tokens)),
                info.redeemer
            ))); 
        // console.logBytes32(h);
        return h;
    }

    function _verify(Ticket calldata info) internal view returns(address) {
        bytes32 digest = _hash(info);
        return ECDSA.recover(digest, info.signature);
    }

    function getChainId() external view returns(uint256){
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }
}