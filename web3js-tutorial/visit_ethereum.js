// 创建连接
let Web3 = require("web3")
let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"))
// 查看是否连接到节点
web3.eth.net.isListening().then(() => {
    console.log("Web3 is connected to the Ethereum node.");
}).catch(e => {
    console.log("Web3 is not connected to the Ethereum node:", e);
});
// 获取节点信息
web3.eth.getNodeInfo().then(console.log);