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

const hardhatAccountAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

// 写入智能合约状态的函数调用
contract.methods.setNumber(1234)
.send({ from: hardhatAccountAddress})
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

// 手工部署合约
const fs = require("fs");

// 读取编译后的合约JSON文件
const contractJson = JSON.parse(fs.readFileSync('../hardhat-tutorial/artifacts/contracts/Add.sol/Add.json', 'utf8'));
const addContractABI = contractJson.abi;
const addContractBytecode = contractJson.bytecode;

var myContract = new web3.eth.Contract(addContractABI);

var candidateNames = [
  '0x416c696365', // "Alice"
  '0x4265747479', // "Betty"
  '0x5365615361'  // "SeaSa"  
];

myContract.deploy({
    data: addContractBytecode,
    arguments: [candidateNames]
}).send({
    from: hardhatAccountAddress,
    gas: 1500000,
    gasPrice: '30000000000'
}).on('receipt', function(receipt) {
    console.log("Contract deployed at address:", receipt.contractAddress);
});

// 获取指定账户中的余额
web3.eth.getBalance(address, function(error, balance) {
    if (!error) {
        console.log("Balance of account:", balance);
    } else {
        console.error("Error fetching balance:", error);
    }
});

// 查询平均gas价格
web3.eth.getGasPrice().then(function(gasPrice) {
    console.log("Average gas price:", gasPrice);
}).catch(function(error) {
    console.error("Error fetching gas price:", error);
});

const hardhatReceiverAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // 替换为实际接收地址

// 发送交易
var transaction = {
    from: hardhatAccountAddress,
    to: hardhatReceiverAddress,
    value: web3.utils.toWei('0.1', 'ether'),
    gas: 2000000,
    gasPrice: '30000000000'
};

web3.eth.sendTransaction(transaction)
    .then(function(receipt) {
        console.log("Transaction receipt:", receipt);
    })
    .catch(function(error) {
        console.error("Error sending transaction:", error);
    });

const transactionHash = '0x4ca4558bc1a3e43a0a5ff13f717bec54c31fbf59f2b2564e985edd73f43bfcbc'; // 替换为实际交易哈希

// 查询交易信息
web3.eth.getTransaction(transactionHash)
    .then(function(transaction) {
        console.log("Transaction details:", transaction);
    })
    .catch(function(error) {
        console.error("Error fetching transaction:", error);
    });

// 查询交易收据
web3.eth.getTransactionReceipt(transactionHash)
    .then(function(receipt) {
        console.log("Check Transaction receipt:", receipt);
    })
    .catch(function(error) {
        console.error("Error fetching transaction receipt:", error);
    });