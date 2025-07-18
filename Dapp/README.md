# 需求
在 Sepolia 网络上部署加法器合约，在前端 Dapp 页面上点击 Add 即向合约里的 counter + 1
- 部署合约
- 创建 vue 工程
- 引入 Web3.js 依赖
- 前端连接区块链网络
    - 连接钱包
    - 与合约交互

# 软件版本
- Nodejs v18.16.0 
- Web3.js 1.8.0 
- Vue 3

# 初始化前端工程
```shell
# 初始化vue
npm init vue@latest
# 引入web3.js依赖
npm i web3@1.8.0
```