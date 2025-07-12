require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const ETH_SEPOILA_URL = process.env.ETH_SEPOILA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  // defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      // 可选的有Alchemy, Infura，QuikNode等
      url: ETH_SEPOILA_URL,
      accounts: [PRIVATE_KEY,PRIVATE_KEY2] 
    }
  },
  requestTimeout: 60000, // 60秒
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY, 
  },
  solidity: "0.8.20",
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
