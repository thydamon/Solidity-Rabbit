// import ethers.js
// create main function
// execute main function

const { ethers, run, network } = require("hardhat");

// 只有在异步函数中才能使用 await
async function main() {
    // create a contract factory for the Greeter contract
    // 必须等待合约工厂创建完成后才能使用
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    // deploy the contract from the factory
    const fundMe = await fundMeFactory.deploy(10);
    // wait for the deployment to finish
    // 这一步是必须的，因为部署合约是一个异步操作
    await fundMe.waitForDeployment();
    console.log(`FundMe contract deployed to: ${fundMe.target}`);

    // init 2 accouts
    const [firstAccount, secondAccount] = await ethers.getSigners();
    // fund contract with first account
    const fundTx = await fundMe.fund({value: ethers.parseEther("0.5")});
    await fundTx.wait()
    // check balance of the contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target);
    console.log(`Balance of contract: ${ethers.formatEther(balanceOfContract)} ETH`);
    // fund conract with second account
    const fundTxWithSecondAccout = await fundMe.fund({value: ethers.parseEther("0.5")});
    await fundTxWithSecondAccout.wait()
    // check balance of the contract again
    const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target);
    console.log(`Balance of contract after second fund: ${ethers.formatEther(balanceOfContractAfterSecondFund)} ETH`);
    // check mapping fundersToAmount
    fundMe.fundersToAmount(firstAccount.address).then((amount) => {
        console.log(`Amount funded by first account: ${ethers.formatEther(amount)} ETH`);
    });
    fundMe.fundersToAmount(secondAccount.address).then((amount) => {
        console.log(`Amount funded by second account: ${ethers.formatEther(amount)} ETH`);
    });
}

// async main
// async function main() {
//   const [deployer] = await ethers.getSigners();
//   console.log("Deploying contracts with the account:", deployer.address);
//   const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
//   console.log("Deploying contract...")
//   const simpleStorage = await SimpleStorageFactory.deploy()
//   // 等待合约部署确认（替代原来的 deployed()）
//   await simpleStorage.deploymentTransaction().wait()
  
//   // 获取合约地址（使用 getAddress() 或 .target 属性）
//   const address = await simpleStorage.getAddress()
//   // 或者: const address = simpleStorage.target
  
//   console.log(`Deployed contract to: ${address}`)
// }

// execute the main function and handle error
main().then().catch((error) => {
    console.error(error);
    process.exit(1); // 设置退出码为 1，表示有错误发生
})