// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "hardhat/console.sol";

contract Token {
    string public name = "My Hardhat Token";
    string public symbol = "MBT";

    uint256 public totalSupply = 1000000;
    address public owner;
    mapping(address => uint256) public balances;

    /**
     * 合约构造函数
     */
    constructor() {
        owner = msg.sender;
        balances[owner] = totalSupply;
    }

    /**
     * 代币转账
     */
    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");


        console.log(
            "Transferring %s tokens from %s to %s",
            amount,
            msg.sender,
            to
        );

        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns(uint256) {
        return balances[account];
    }
}