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