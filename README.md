# Solidity练习
# Hardhad练习
## npm方式部署
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
# 本地网络部署
npx hardhat run scripts/deploy.js
# sepolia网络部署
npx hardhat run scripts/deployFundMe.js --network sepolia
```
安装hardhat的verify插件
```shell
npm install --save-dev @nomicfoundation/hardhat-verify
npx hardhat verify --network sepolia 0xf9f24cf2A9f79e6A54ed6E28a7A55493b9AeD83c "10"
```
## yarn方式部署
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

## hardhat新增任务与插件
1、创建任务
在hardhat.config.js中添加一个accounts任务
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

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
```
2、查看命令
```shell
# 终端运行 npx hardhat
hardhat-tutorial>npx hardhat
Hardhat version 2.25.0

Usage: hardhat [GLOBAL OPTIONS] [SCOPE] <TASK> [TASK OPTIONS]

GLOBAL OPTIONS:

  --config              A Hardhat config file.
  --emoji               Use emoji in messages.
  --flamegraph          Generate a flamegraph of your Hardhat tasks
  --help                Shows this message, or a task's help if its name is provided
  --max-memory          The maximum amount of memory that Hardhat can use.
  --network             The network to connect to.
  --show-stack-traces   Show stack traces (always enabled on CI servers).
  --tsconfig            A TypeScript config file.
  --typecheck           Enable TypeScript type-checking of your scripts/tests
  --verbose             Enables Hardhat verbose logging
  --version             Shows hardhat's version.


AVAILABLE TASKS:

  accounts              Prints the list of accounts
  check                 Check whatever you need
  clean                 Clears the cache and deletes all artifacts
  compile               Compiles the entire project, building all artifacts
  console               Opens a hardhat console
  coverage              Generates a code coverage report for tests
  flatten               Flattens and prints contracts and their dependencies. If no file is passed, all the contracts in the project will be flattened.
  gas-reporter:merge
  help                  Prints this message
  hhgas:merge
  node                  Starts a JSON-RPC server on top of Hardhat Network
  run                   Runs a user-defined script after compiling the project
  test                  Runs mocha tests
  typechain             Generate Typechain typings for compiled contracts
  verify                Verifies a contract on Etherscan or Sourcify


AVAILABLE TASK SCOPES:

  ignition              Deploy your smart contracts using Hardhat Ignition
  vars                  Manage your configuration variables

To get help for a specific task run: npx hardhat help [SCOPE] <TASK>
```
3、运行任务
```shell
npx hardhat accounts
# 成功打印当前节点所控制的地址列表
hardhat-tutorial>npx hardhat accounts
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
0x90F79bf6EB2c4f870365E785982E1f101E93b906
0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc
0x976EA74026E726554dB657fA54763abd0C3a0aa9
0x14dC79964da2C08b23698B3D3cc7Ca32193d9955
0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f
0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
0xBcd4042DE499D14e55001CcbB24a551F3b954096
0x71bE63f3384f5fb98995898A86B02Fb2426c5788
0xFABB0ac9d68B0B445fB7357272Ff202C5651694a
0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec
0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097
0xcd3B766CCDd6AE721141F452C550Ca635964ce71
0x2546BcD3c84621e976D8185a91A922aE77ECEc30
0xbDA5747bFD65F08deb54cb465eB87D40e51B197E
0xdD2FD4581271e230360230F9337D5c0430Bf44C0
0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199
```

# Web3js练习
安装wb3js
```shell
# 使用v18.16.0,有的版本不支持web3
npm install web3@1.8.0
```
