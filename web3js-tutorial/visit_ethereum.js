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
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "name",
          "type": "uint256"
        }
      ],
      "name": "myEvent",
      "type": "event"
    },
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
    },
    {
      "inputs": [],
      "name": "getNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_number",
          "type": "uint256"
        }
      ],
      "name": "setNumber",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
// 根据 abi 和 合约地址创建智能合约对象
const contract = new web3.eth.Contract(abi, address);

// 读取智能合约状态的函数调用
contract.methods.getNumber().call(function(error, result) {
    if (!error) {
        console.log("Current number in contract:", result);
    } else {
        console.error("Error calling getNumber:", error);
    }
})

// 写入智能合约状态的函数调用
contract.methods.setNumber(1234)
.send({ from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'})
.on('receipt', function(receipt) {
    console.log("Transaction receipt:", receipt);
})

// 执行事件查询
contract.getPastEvents('AllEvents', {
    fromBlock: 0,
    toBlock: 'latest'
}, function(error, events) {
    if (!error) {
        console.log("Past events:", events);
    } else {
        console.error("Error fetching past events:", error);
    }
});