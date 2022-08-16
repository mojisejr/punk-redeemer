const { ethers, network } = require("hardhat");
const { expect } = require("chai");
const { createTicket } = require("../helper/createTicket");

let minter;
let customer;
let deployer;
let contract;
let nft;
let chainId;

describe("Punk Redeemer Test", function () {
  before(async function () {
    [deployer, minter, customer] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("PunkRedeemer");
    const nftFactory = await ethers.getContractFactory("Ticket");
    contract = await factory.deploy(minter.address);
    nft = await nftFactory.deploy();
    await contract.deployed();
    chainId = await contract.getChainId();
    console.log("deployed address: ", contract.address);
    console.log("nft address: ", nft.address);
    console.log("minter address: ", minter.address);
    console.log("customer ddress: ", customer.address);
    console.log("chainId", chainId.toString());
  });

  it("should be able redeem by anyone with given signature", async function () {
    //create signTypedData
    const Info = await createTicket(
      nft.address,
      1,
      [1, 2],
      customer.address,
      minter
    );
    const result = await contract.connect(customer).redeem(Info);
    expect(result).to.true;
  });
});
