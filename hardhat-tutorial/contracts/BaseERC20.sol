// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 完善合约，实现以下功能：

// 设置 Token 名称（name）："BaseERC20"
// 设置 Token 符号（symbol）："BERC20"
// 设置 Token 小数位decimals：18
// 设置 Token 总量（totalSupply）:100,000,000

contract BaseERC20 {
    string public name; 
    string public symbol; 
    uint8 public decimals; 

    uint256 public totalSupply; 

    mapping (address => uint256) balances; 

    mapping (address => mapping (address => uint256)) allowances; 

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        // write your code here
        // set name,symbol,decimals,totalSupply
        name = "BaseERC20";
        symbol = "BERC20";
        decimals = 18;
        // 10^26
        // 10 ** uint256(decimals) = 10^18
        totalSupply = 100000000 * (10 ** uint256(decimals));

        balances[msg.sender] = totalSupply;  
    }

    // @dev 返回账户的代币余额
    // @param account 要查询余额的地址
    function balanceOf(address _owner) public view returns (uint256 balance) {
        // write your code here
        return balances[_owner];
    }

    // @dev 将调用者账户的代币转移到指定地址
    // @param to 接收代币的地址
    // @param amount 转移的代币数量
    // @return 成功返回 true
    function transfer(address _to, uint256 _value) public returns (bool success) {
        // write your code here
        _transfer(msg.sender, _to, _value);

        emit Transfer(msg.sender, _to, _value);  
        return true;   
    }

    // @dev 从from账户转移amount数量的代币到to账户
    // 调用者必须具有足够的授权额度
    // @param from 发送代币的地址
    // @param to 接收代币的地址
    // @param amount 转移的代币数量
    // @return 成功返回 true
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        // write your code here
        address spender = msg.sender;
        _spendAllowance(_from, spender, _value);
        _transfer(_from, _to, _value); 
        emit Transfer(_from, _to, _value); 
        return true; 
    }

    // @dev 内部授权逻辑
    // @param owner 所有者地址
    // @param spender 被授权者地址
    // @param amount 授权数量
    function approve(address _spender, uint256 _value) public returns (bool success) {
        // write your code here
        address owner = msg.sender;
        _approve(owner, _spender, _value);

        emit Approval(msg.sender, _spender, _value); 
        return true; 
    }

    // @dev 返回owner授权给spender的代币数量
    // @param owner 代币所有者地址
    // @param spender 被授权者地址
    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {   
        // write your code here     
        return allowances[_owner][_spender];
    }

    // @dev 内部转账逻辑
    // @param from 发送地址
    // @param to 接收地址
    // @param amount 转账数量
    function _transfer(address _from, address _to, uint256 _values) internal {
        require(_from != address(0), "ERC20: transfer from the zero address");
        require(_to != address(0), "ERC20: transfer to the zero address");

        uint256 fromBalance = balances[_from];
        require(fromBalance >= _values, "ERC20: transfer amount exceeds balance");

        unchecked {
            balances[_from] = fromBalance - _values;
            balances[_to] += _values;
        }
    }

    // @dev 内部消费授权额度逻辑
    // @param owner 所有者地址
    // @param spender 被授权者地址
    // @param amount 要消费的数量
    function _spendAllowance(address _owner, address _spender, uint256 _values) internal {
        uint256 currentAllowance = allowances[_owner][_spender];
        require(currentAllowance >= _values, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(_owner, _spender, currentAllowance - _values);
        }
    }

    // @dev 内部授权逻辑
    // @param owner 所有者地址
    // @param spender 被授权者地址
    // @param amount 授权数量
    function _approve(address _owner, address _spender, uint256 _values) internal {
        require(_owner != address(0), "ERC20: approve from the zero address");
        require(_spender != address(0), "ERC20: approver to the zero address");

        allowances[_owner][_spender] = _values;
    }
}