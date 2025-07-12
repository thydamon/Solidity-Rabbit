const {task} = require("hardhat/config");

task("depoly-fundme").setAction(async (taskArgs, hre) => {
    const { ethers, run, network } = hre;

    // create a contract factory for the FundMe contract
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    // deploy the contract from the factory
    const fundMe = await fundMeFactory.deploy(10);
    // wait for the deployment to finish
    await fundMe.waitForDeployment();
    console.log(`FundMe contract deployed to: ${fundMe.target}`);

    // verify fundMe
    if (hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...");
        await fundMe.deployTransaction.wait(6);
        console.log("Verifying contract...");
        // await varifyFundMe(fundMe.target, [300]);
        await run("verify:verify", {
            address: fundMe.target,
            constructorArguments: [10],
        });
    } else {
        console.log("Skipping verification, not on Sepolia or Etherscan API key not set.");
    }

});

module.exports = {}