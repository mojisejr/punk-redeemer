const { ethers, network } = require("hardhat");
const { expect } = require("chai");
const { createTicket } = require("../helper/createTicket");

let minter;
let customer;
let deployer;
let contract;
let nft;
let chainId;

let tokenPending = [3, 4, 5, 6, 7, 8, 9, 10];
let tokenMinted = [];

let gasOption = {
  gasPrice: ethers.utils.parseUnits("20", "gwei"),
  gasLimit: 5500000,
};

function randomTokenToMint() {
  let tokens = [];
  let currentLegnth = tokenPending.length - 1;
  for (i = 0; i < 2; i++) {
    let position = Math.floor(Math.random() * currentLegnth) + 1;
    tokens.push(tokenPending[position]);
    updateMintedToken(tokenPending[position]);
    currentLegnth -= 1;
    console.log(
      `After token number ${i + 1} selected has ${tokenPending} left`
    );
  }
  return tokens;
}

function updateMintedToken(token) {
  tokenMinted.push(token);
  tokenPending = tokenPending.filter((r) => r != token);
}

describe("Punk Redeemer Test", function () {
  before(async function () {
    [deployer, minter, customer] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("PunkRedeemer");
    const nftFactory = await ethers.getContractFactory("Ticket");
    const itemFactory = await ethers.getContractFactory("Item");
    contract = await factory.deploy(minter.address);
    await contract.deployed();
    nft = await nftFactory.deploy();
    await nft.deployed();
    item = await itemFactory.deploy();
    await item.deployed();
    const role = await item.MINTER_ROLE();
    await item.grantRole(role, contract.address);
    await contract.setItemContract(item.address);
    chainId = await contract.getChainId();
    console.log("deployment: ", {
      redeemContract: contract.address,
      ticketContract: nft.address,
      itemContract: item.address,
      minterAddress: minter.address,
      redeemerAddress: customer.address,
      chainId: chainId.toString(),
    });
  });

  it("should be able redeem by anyone with given signature", async function () {
    //create signTypedData
    const Info = await createTicket(
      nft.address,
      1,
      [1, 2],
      customer.address,
      minter,
      contract.address,
      chainId
    );
    await expect(contract.connect(customer).redeem(Info, gasOption)).to.emit(
      contract,
      "Redeemed"
    );
  });

  it("random from backend and mint with signature round 1", async () => {
    const tokens = randomTokenToMint();

    console.log("randomed token: ", tokens);
    const Info = await createTicket(
      nft.address,
      2,
      tokens,
      customer.address,
      minter,
      contract.address,
      chainId
    );

    await expect(contract.connect(customer).redeem(Info, gasOption)).to.emit(
      contract,
      "Redeemed"
    );
    expect(tokens.length).to.equal(2);
  });
  it("random from backend and mint with signature round 2", async () => {
    const tokens = randomTokenToMint();
    console.log("randomed token: ", tokens);

    const Info = await createTicket(
      nft.address,
      3,
      tokens,
      customer.address,
      minter,
      contract.address,
      chainId
    );

    await expect(contract.connect(customer).redeem(Info, gasOption)).to.emit(
      contract,
      "Redeemed"
    );
    expect(tokens.length).to.equal(2);
  });
});
