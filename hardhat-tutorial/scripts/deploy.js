// import ethers.js
// create main function
// execute main function

const { ethers } = require("hardhat");

// 只有在异步函数中才能使用 await
async function main() {
    // create a contract factory for the Greeter contract
    // 必须等待合约工厂创建完成后才能使用
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    // deploy the contract from the factory
    const fundMe = await fundMeFactory.deploy();
    // wait for the deployment to finish
    // 这一步是必须的，因为部署合约是一个异步操作
    await fundMe.waitForDeployment();
    console.log(`FundMe contract deployed to: ${fundMe.target}`);
}

// execute the main function and handle error
main().then().catch((error) => {
    console.error(error);
    process.exit(1); // 设置退出码为 1，表示有错误发生
})