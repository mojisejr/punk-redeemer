const { ethers } = require("hardhat");

async function main() {
  const [deployer, minter] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("Item");
  const item = await factory.deploy(deployer.address, minter.address);
  await item.deployed();

  console.log("deployed contract address: ", item.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
