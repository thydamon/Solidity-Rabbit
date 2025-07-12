const {task} = require("hardhat/config");

task("interact-fundme")
    .addParam("addr", "fundme contract address")
    .setAction(async (taskArgs, hre) => {
    const { ethers, run, network } = hre;

    // get the deployed contract address
    const fundMeFactory = await ethers.getContractAt("FundMe");
    const fundMe = fundMeFactory.attach(taskArgs.addr);

    // init 2 accounts
    const [firstAccount, secondAccount] = await ethers.getSigners();

    // fund contract with first account
    const fundTx = await fundMe.connect(firstAccount).fund({value: ethers.parseEther("0.5")});
    await fundTx.wait();
    
    // check balance of the contract
    const balanceOfContract = await ethers.provider.getBalance(fundMeAddress);
    console.log(`Balance of contract: ${ethers.formatEther(balanceOfContract)} ETH`);

    // fund contract with second account
    const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.5")});
    await fundTxWithSecondAccount.wait();

    // check balance of the contract again
    const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMeAddress);
    console.log(`Balance of contract after second fund: ${ethers.formatEther(balanceOfContractAfterSecondFund)} ETH`);

    // check mapping fundersToAmount
    const amountFromFirstAccount = await fundMe.fundersToAmount(firstAccount.address);
    console.log(`Amount funded by first account: ${ethers.formatEther(amountFromFirstAccount)} ETH`);
    
    const amountFromSecondAccount = await fundMe.fundersToAmount(secondAccount.address);
    console.log(`Amount funded by second account: ${ethers.formatEther(amountFromSecondAccount)} ETH`);
});

module.exports = {};