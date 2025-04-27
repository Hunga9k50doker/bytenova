const ethers = require("ethers");

// Provider setup for Binance Smart Chain (BSC)
const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.bnbchain.org/");

// Contract details
const contractAddress = "0xd9b017B890B47f7DEeE51ee0EAa75a2375D34fA9";
const contractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "mintAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Function to mint a passport
async function mintPass(privateKey) {
  try {
    // Create wallet instance
    const wallet = new ethers.Wallet(privateKey, provider);

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Check wallet balance
    const balance = await provider.getBalance(wallet.address);

    // Fetch current fee data
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.utils.parseUnits("5", "gwei"); // Fallback to 5 gwei if feeData is undefined

    // Manual gas limit
    const gasLimit = ethers.utils.parseUnits("5000000", 0); // Set a higher gas limit for the transaction

    // Set maximum gas price to 5 gwei
    const maxGasPriceGwei = 5; // Set your gas price limit
    const maxGasPrice = ethers.utils.parseUnits(maxGasPriceGwei.toString(), "gwei");

    // Ensure effectiveGasPrice does not exceed maxGasPrice
    const effectiveGasPrice = gasPrice.gt(maxGasPrice) ? maxGasPrice : gasPrice;

    // Ensure sufficient balance for the transaction cost
    const transactionCost = effectiveGasPrice.mul(gasLimit);
    if (balance.lt(transactionCost)) {
      return {
        success: false,
        message: "Insufficient balance to mint. Please add more BNB.",
      };
    }

    // Mint passport with manual gas limit
    const tx = await contract.mintPassport(wallet.address, {
      gasLimit: gasLimit,
      gasPrice: effectiveGasPrice,
    });

    // Wait for transaction confirmation
    await tx.wait();

    return {
      success: true,
      message: `Passport minted successfully! Transaction hash: ${tx.hash}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error minting passport: ${error.message}`,
    };
  }
}

module.exports = { mintPass };
