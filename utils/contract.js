const ethers = require("ethers");

// Provider setup for Binance Smart Chain (BSC)
const provider = new ethers.JsonRpcProvider("https://bsc.drpc.org/");

// Contract details
const contractAddress = "0xD615Eb3ea3DB2F994Dce7d471A02d521B8E1D22d";

const contractABI = [
  "function checkIn() public", // Phương thức mint
];

// Function to mint a passport
async function checkInDaily(wallet) {
  try {
    // Create wallet instance

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // const balance = await provider.getBalance(wallet.address);

    const gasLimit = 300000;

    // Mint passport with manual gas limit
    const tx = await contract.checkIn(wallet.address, {
      gasLimit: gasLimit,
    });

    // Wait for transaction confirmation
    await tx.wait();

    return {
      tx: tx.hash,
      success: true,
      message: `Checkin successfully! Transaction hash: ${tx.hash}`,
    };
  } catch (error) {
    return {
      tx: null,
      success: false,
      message: `Error minting passport: ${error.message}`,
    };
  }
}

module.exports = { checkInDaily };
