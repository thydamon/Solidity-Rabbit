require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const ETH_SEPOILA_URL = process.env.ETH_SEPOILA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  // defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      // 可选的有Alchemy, Infura，QuikNode等
      url: ETH_SEPOILA_URL,
      accounts: [PRIVATE_KEY] 
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
