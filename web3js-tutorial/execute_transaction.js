require("dotenv").config();

const ETH_SEPOILA_URL = process.env.ETH_SEPOILA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

let Web3 = require('web3')
let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545"))

// 查看是否连接到节点
web3.eth.net.isListening().then(() => {
    console.log("Web3 is connected to the Ethereum node.");
}).catch(e => {
    console.log("Web3 is not connected to the Ethereum node:", e);
});

// 发送者地址
const fromAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
// 接收者地址
const toAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
// 发送的金额
const etherAmount = web3.utils.toWei('1', 'ether');
// gas配置
const gasPrice =  web3.utils.toWei('10', 'gwei');
const gasLimit = 21000;

// 构建交易对象
const transactionObject = {
    from: fromAddress,
    to: toAddress,
    value: etherAmount,
    gas: gasLimit,
    gasPrice: gasPrice
};

// 签署交易
const fromAddressPrivateKey = PRIVATE_KEY; // 以太坊账户的私钥

const signedTransaction = web3.eth.accounts.signTransaction(transactionObject, fromAddressPrivateKey)
    .then(signedTx => {
        console.log("Signed transaction:", signedTx);
        return signedTx;
    })
    .catch(error => {
        console.error("Error signing transaction:", error);
    });

// 发送签署后的交易
// web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
//     .on('transactionHash', (txHash) => {
//         console.log("Transaction hash:", txHash);
//     })
//     .on('receipt', (receipt) => {
//         console.log("Transaction receipt:", receipt);
//     })
//     .on('error', (error) => {
//         console.error("Transaction error:", error);
//     });


// ...existing code...

async function sendTx() {
    try {
        const signedTx = await web3.eth.accounts.signTransaction(transactionObject, fromAddressPrivateKey);
        console.log("Signed transaction:", signedTx);

        web3.eth.sendSignedTransaction(signedTx.rawTransaction)
            .on('transactionHash', (txHash) => {
                console.log("Transaction hash:", txHash);
            })
            .on('receipt', (receipt) => {
                console.log("Transaction receipt:", receipt);
            })
            .on('error', (error) => {
                console.error("Transaction error:", error);
            });
    } catch (error) {
        console.error("Error signing transaction:", error);
    }
}

sendTx();