const { ethers } = require("hardhat");

// 定义主函数
async function main() {
  // 在Hardhat本地网络中，默认有20个预配置的测试账户
  // ethers.getSigners() 返回一个 Promise，解析为可用账户列表
  // [deployer] 使用数组解构获取第一个账户
  // await 等待异步操作完成
  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  // ethers v6 语法：通过 provider 获取余额
  // ethers.provider 是区块链网络提供者，负责与区块链通信
  // getBalance(deployer.address) 查询指定地址的余额
  // 返回的是 BigNumber 对象，表示 wei 单位的余额
  // await 等待网络响应
  const balance = await ethers.provider.getBalance(deployer.address);
  // ethers.formatEther(balance) 将 wei 转换为以太币（ETH）单位的字符串表示
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();

  // ethers v6 语法：等待部署完成并获取地址
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  
  console.log("Token address:", tokenAddress);

  // 可选：显示代币信息
  const name = await token.name();
  const symbol = await token.symbol();
  const totalSupply = await token.totalSupply();
  
  console.log("Token details:");
  console.log("  Name:", name);
  console.log("  Symbol:", symbol);
  console.log("  Total Supply:", totalSupply.toString());
}

main()
  .then(() => {
    console.log("Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });