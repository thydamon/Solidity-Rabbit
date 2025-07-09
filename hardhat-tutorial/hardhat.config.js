require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const ETH_SEPOILA_URL = process.env.ETH_SEPOILA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      url: ETH_SEPOILA_URL,
      accounts: [PRIVATE_KEY] 
    }
  },

  solidity: "0.8.20",
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
