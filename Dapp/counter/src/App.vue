import TheWelcome from './components/TheWelcome.vue'
<script> 
import Web3 from 'web3';

export default {
  data() {
    return {
      account: null,
      web3: null,
      contract: null,
      counter: '请先连接钱包',
      hash: null
    };
  },
  methods: {
    // 获取counter合约的地址
    async getCounter() {
      this.counter = await this.contract.methods.count().call();
    },
    // 连接钱包
    async connectWallet() {
      if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        // 使用MetaMask的Ethereum提供商
        this.web3 = new Web3(window.ethereum || window.web3.currentProvider);

        try {
          // 请求连接钱包
          const accounts = await this.web3.eth.requestAccounts();
          this.account = accounts[0];
          console.log('Connected account:', this.account);
        } catch (error) {
          console.error('User denied account access or error occurred:', error);
        }
      } else {
        console.error('No Ethereum provider detected. Please install MetaMask or another wallet.');
      }
    }
  },
}
</script>
<template>

</template>

