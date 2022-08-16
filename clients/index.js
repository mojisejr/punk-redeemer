//MintingInfo : { minter: address, tokenId: uint256 },

//create domain seperator
//1 name
//2 version
//3 chainId
//4 verifyingContract
//5 salt
let provider;
let signer;
if (window.ethereum != null) {
  connect();
}

async function connect() {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  console.log(signer);
}

const domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const mintingInfo = [
  { name: "minter", type: "address" },
  { name: "tokenId", type: "uint256" },
];

const domainData = {
  name: "Punk Item Redemption V.1",
  version: "1",
  chainId: ethereum.chainId,
  verifyContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
};

const message = {
  minter: "0x4C06524B1bd7AA002747252257bBE0C472735A6D",
  tokenId: "1",
};

const data = JSON.stringify({
  types: {
    EIP712Domain: domain,
    MintingInfo: mintingInfo,
  },
  domain: domainData,
  primaryType: "Mintinginfo",
  message: message,
});

console.log(data);
