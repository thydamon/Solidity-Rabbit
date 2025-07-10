// 创建连接
let Web3 = require("web3")
// let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"))
let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545"))
// 查看是否连接到节点
web3.eth.net.isListening().then(() => {
    console.log("Web3 is connected to the Ethereum node.");
}).catch(e => {
    console.log("Web3 is not connected to the Ethereum node:", e);
});
// 获取节点信息
web3.eth.getNodeInfo().then(console.log);

// 访问合约
const abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "a",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "b",
          "type": "uint256"
        }
      ],
      "name": "add",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    }
  ]
const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
// 根据 abi 和 合约地址创建智能合约对象
const contract = new web3.eth.Contract(abi, address);
