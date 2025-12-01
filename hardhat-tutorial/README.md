# 使用yarn安装hardhat
## 1、初始化yarn项目并安装hardhat
```shell
yarn init
yarn add --dev hardhat@^2.19.0
```
## 2、初始化hardhat
如果不初始化，编译的时候会报错，当前不是一个hardhat项目
```shell
yarn hardhat init
```
## 3、安装代码格式化插件
```shell
yarn add --dev prettier@2.8.8 prettier-plugin-solidity@1.1.0
# 添加配置文件.prettierrc
{
    "tabWidth": 4,
    "useTabs": false,
    "semi": false,
    "singleQuote": false
}
# 添加配置文件.prettierignore
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
## 4、编译合约
将合约放在 contracts 目录下
```shell
yarn hardhat compile
```
## 添加dotenv支持
配置一下 dotenv 插件，这样我们就可以使用 dotenv 来获取环境变量,开发过程中，会牵扯到很多隐私信息，如私钥等，我们会希望将其存储在 .env 文件或直接设置在终端中，比如我们的 RINKEBY_PRIVATE_TOKEN，这样我们就可以在部署脚本中使用 process.env.RINKEBY_PRIVATE_TOKEN 获取到值，无需在代码中显式写入，减少隐私泄漏风险。
```shell
yarn add --dev dotenv
```
在项目根目录创建.env文件
```shell
RINKEBY_RPC_URL=url
RINKEBY_PRIVATE_KEY=0xkey
ETHERSCAN_API_KEY=key
COINMARKETCAP_API_KEY=key
```
在hardhat.config.js中读取变量
```javascript
require("dotenv").config()

const RINKEBY_RPC_URL =
    process.env.RINKEBY_RPC_URL || "https://eth-rinkeby/example"
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key"
```

## 网络配置
往往我们的合约需要运行在不同的区块链网络上，如本地测试、开发、上线环境等等，HardHat 也提供了便捷的方式来配置网络环境。
### 启动网络
直接运行脚本来启动一个 Hardhat 自带的网络，但该网络仅仅存活于脚本运行期间，想要启动一个本地可持续的网络，需要运行 yarn hardhat node
### 定义网络
完成网络环境准备后，我们可以在项目配置 hardhat.config.js 中定义网络
```shell
const RINKEBY_RPC_URL =
    process.env.RINKEBY_RPC_URL || "https://eth-rinkeby/example"
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || "0xkey"

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        locakhost: {
            url: "http://localhost:8545",
            chainId: 31337,
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [RINKEBY_PRIVATE_KEY],
            chainId: 4,

        },
    },
    // ...,
}
```



# 使用npm安装hardhat
## 创建hardhat
```shell
npm init
npm install --save-dev hardhat@^2.19.0
npx hardhat
```
## 安装插件
```shell
npm install --save-dev @chainlink/contracts
```
## 编译合约
```shell
npx hardhat compile
```
## 合约测试
在项目的根目录创建一个名为test的新目录，并创建一个名为Token.js的文件，文件内容如下
```shell
const { expect } = require("chai");

describe("Token contract", function() {
  it("Deployment should assign the total supply of tokens to the owner", async function() {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});
``` 
在终端上运行命令
```shell
npx hardhat test
```
## 部署合约
在项目根目录的目录下创建一个新的目录scripts，并将以下内容粘贴到 deployToken.js文件中
```shell
async function main() {

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```
为了在运行任何任务时指示Hardhat连接到特定的以太坊网络，可以使用--network参数。
```shell
npx hardhat run scripts/deployToken.js --network <network-name>
```
### 部署合约到真实网络
在hardhat.config.js文件中添加一个network条目
