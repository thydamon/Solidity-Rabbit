# Solidity练习
# Hardhad练习
## 项目安装
初始化Node项目
```shell
npm init
```
安装Hardhat
```shell 
npm install --save-dev hardhat
```
在安装Hardhat的目录运行
```shell
npx hardhat
```
创建好的 Hardhat 工程包含下列文件：
- contracts：智能合约目录
- scripts ：部署脚本文件
- test：智能合约测试用例文件夹。
- hardhat.config.js：配置文件，配置hardhat连接的网络及编译选项。
安装chainlink依赖
```shell
npm install @chainlink/contracts --save-dev
```
项目编译
```shell
npx hardhat compile
```
合约依赖安装
```shell
npm install @chainlink/contracts --save-dev
```
合约部署
```shell
npx hardhat run scripts/deploy.js
```
安装yarn
```shell
npm install --global yarn
```
安装hardhat工具箱
```shell
npm install --save-dev @nomicfoundation/hardhat-toolbox
# 安装之后不能在使用 npx hardhat compile编译，会有冲突
```
编译
```shell
# 使用yarn编译，需执行删除node_modules,yarn.lock, yarn clean cache，新执行yarn install
yarn hardhat compile
```
安装代码美化依赖
```shell
yarn add --dev prettier prettier-plugin-solidity
```
新建.prettierrc
```shell
{
  "tabWidth": 4,
  "useTabs": false,
  "semi": false,
  "singleQuote": false
}
```
新建.prettierignore文件
```shell
node_modules
package.json
img
artifacts
cache
coverage
.env
.*
README.md
coverage.json
```
部署
```shell
yarn hardhat run scripts/deploy.js
```

## 部署合约到本地Hardhat节点
1、启动本地节点
```shell
# 这会启动一个本地区块链节点，，监听在127.0.0.1:8545
npx hardhat node
```
2、运行部署脚本
```shell
npx hardhat run --network localhsot scripts/deployAdd.js
```
3、运行测试
创建在test目录测试文件
```javascript
const { expect } = require("chai");

describe("Add", function () {
  it("should return the sum of two numbers", async function () {
    const Add = await ethers.getContractFactory("Add");
    const add = await Add.deploy();

    const result = await add.add(2, 3);
    expect(result).to.equal(5);
  });
});
```
运行测试
```shell
npx hardhat test
```

## 部署至sepolia测试网络
安装hardhat工具箱
```shell
npm install --save-dev @nomicfoundation/hardhat-toolbox
```
安装环境变量配置依赖
```shell
npm install dotenv --save
```
新建.env
```shell
GOERLI_RPC_URL=XXXXX
PRIVATE_KEY=XXXXXXX
```
修改hardhat.config.js配置
```javascript
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
```
合约部署
```shell
npx hardhat run --network sepolia scripts/deploy.js
```


# Web3js练习
安装wb3js
```shell
# 使用v18.16.0,有的版本不支持web3
npm install web3@1.8.0
```
