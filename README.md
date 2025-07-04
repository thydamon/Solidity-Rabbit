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
yarn hardhat compile
```

# Web3js练习
安装wb3js
```shell
# 使用v18.16.0,有的版本不支持web3
npm install web3@1.8.0
```
