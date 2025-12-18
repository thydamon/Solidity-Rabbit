// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BaseERC20.sol";


contract BankToken {
    // 存储结构
    mapping(address => mapping(address => uint256)) balances;

    // 存款事件
    event Deposited(address indexed user,
                    address indexed token,
                    uint256 amount,
                    uint256 timestamp);
    // 取款事件 
    event Withdrawn(address indexed user,
                    address indexed token,
                    uint256 amount,
                    uint256 timestamp);

    /**
     * @dev 存款函数：用户将BaseERC20代币存入银行
     * @param tokenAddress 要存入的代币合约地址
     * @param amount 要存入的代币数量
     * 
     * 注意：在调用此函数前，用户需要先授权合约操作其代币
     * 例如：调用 token.approve(TokenBank地址, amount)
     */
    function deposit(address tokenAddress, uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(tokenAddress != address(0), "Invalid token address");
        // 转移代币到合约地址
        BaseERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        // 更新用户余额
        balances[msg.sender][tokenAddress] += amount;
        // 触发存款事件
        emit Deposited(msg.sender, tokenAddress, amount, block.timestamp);
    }

    /**
     * @dev 取款函数：用户从银行取出之前存入的代币
     * @param tokenAddress 要取出的代币合约地址
     * @param amount 要取出的代币数量
     */
    function withdraw(address tokenAddress, uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(tokenAddress != address(0), "Invalid token address");
        // 检查用户余额是否足够
        require(balances[msg.sender][tokenAddress] >= amount, "Insufficient balance");

        // 更新用户余额
        balances[msg.sender][tokenAddress] -= amount;
        // 转移代币到用户地址
        BaseERC20(tokenAddress).transfer(msg.sender, amount);
        // 触发取款事件
        emit Withdrawn(msg.sender, tokenAddress, amount, block.timestamp);
    }
}