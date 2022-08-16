const SIGNING_DOMAIN = "PunkRedeemer";
const SIGNATURE_VERSION = "1";

async function createTicket(
  ticketContract,
  ticketId,
  tokens,
  redeemer,
  signer
) {
  const values = {
    ticketContract,
    ticketId,
    tokens,
    redeemer,
  };

  const domain = {
    name: SIGNING_DOMAIN,
    version: SIGNATURE_VERSION,
    verifyingContract: contract.address,
    chainId,
  };

  const types = {
    Ticket: [
      { name: "ticketContract", type: "address" },
      { name: "ticketId", type: "uint256" },
      { name: "tokens", type: "uint256[]" },
      { name: "redeemer", type: "address" },
    ],
  };

  const signature = await signer._signTypedData(domain, types, values);

  const Info = {
    ...values,
    signature,
  };
  return Info;
}

module.exports = {
  createTicket,
};
