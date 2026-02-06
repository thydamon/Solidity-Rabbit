// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 完善合约，实现以下功能：

// 设置 Token 名称（name）："BaseERC20"
// 设置 Token 符号（symbol）："BERC20"
// 设置 Token 小数位decimals：18
// 设置 Token 总量（totalSupply）:100,000,000

contract MinimalBaseERC20 {
    string public name; 
    string public symbol; 
    uint8 public decimals; 

    uint256 public totalSupply; 

    mapping (address => uint256) private _balances; 

    mapping (address => mapping (address => uint256)) allowances; 

    // 防止重复初始化
    bool private _initialized;

    // 合约拥有者地址
    address private _owner;

    // 铸币权限地址
    address private _minter;

    // 合约暂停状态
    bool private _paused;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    // 只能部署一个合约实例，参数硬编码，最小代理合约需支持多个实例参数可配置
    constructor() {
        // write your code here
        // set name,symbol,decimals,totalSupply
        name = "BaseERC20";
        symbol = "BERC20";
        decimals = 18;
        // 10^26
        // 10 ** uint256(decimals) = 10^18
        totalSupply = 100000000 * (10 ** uint256(decimals));

        _balances[msg.sender] = totalSupply;  

        _initialized = true;
        _owner = msg.sender;
    }

    // @dev 初始化函数，设置合约参数
    function initialize(
        address owner_,
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        uint8 decimals_
        ) external { 
            require(!_initialized, "MinimalBaseERC20: already initialized");

            name = name_;
            symbol = symbol_;
            decimals = decimals_;
            _owner = owner_;
            _minter = owner_;

            if (initialSupply > 0) {
                totalSupply = initialSupply * (10 ** uint256(decimals));
                _balances[owner_] = totalSupply;
                emit Transfer(address(0), owner_, totalSupply);
            }

            _initialized = true;
    }

    // @dev 暂停合约功能，只有合约拥有者可以调用
    function pause() public {
        require(msg.sender == _owner, "MinimalERC20: Only owner can pause");
        _paused = true;
    }

    // @dev 铸币权限设置，只有合约拥有者可以调用
    function setMinter(address minter_) public {
        require(msg.sender == _owner, "MinimalERC20: Only owner can set minter");
        _minter = minter_;
    }

    // @dev 铸造新代币，只有拥有铸币权限的地址可以调用
    function mint(address to, uint256 amount) public returns (bool) {
        require(msg.sender == _minter, "MinimalERC20: Only minter can mint");
        require(!_paused, "MinimalERC20: minting is paused");

        totalSupply += amount;
        unchecked {
            _balances[to] += amount;
        }

        emit Transfer(address(0), to, amount);
        emit TokensMinted(to, amount);
        return true;
    }

    // @dev 销毁调用者账户的代币
    function burn(uint256 amount) public returns (bool) {
        address account = msg.sender;
        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "MinimalERC20: burn amount exceeds balance");

        unchecked {
            _balances[account] = accountBalance - amount;
            totalSupply -= amount;
        }

        emit Transfer(account, address(0), amount);
        emit TokensBurned(account, amount);
        return true;
    }

    // @dev 内部销毁代币逻辑
    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "MinimalERC20: burn from the zero address");

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "MinimalERC20: burn amount exceeds balance");

        unchecked {
            _balances[account] = accountBalance - amount;
            totalSupply -= amount;
        }

        emit Transfer(account, address(0), amount);
        emit TokensBurned(account, amount);
    }

    // @dev 从指定账户销毁代币，调用者必须具有足够的授权额度
    function burnFrom(address account, uint256 amount) public returns (bool) {
        address spender = msg.sender;
        _spendAllowance(account, spender, amount);

        _burn(account, amount);
        return true;
    }

    // @dev 增加授权额度
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, allowances[owner][spender] + addedValue);

        return true;
    }

    // @dev 减少授权额度
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        address owner = msg.sender;
        uint256 currentAllowance = allowances[owner][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    // @dev 转移合约拥有者权限，只有当前拥有者可以调用
    function transferOwnership(address newOwner) public {
        require(msg.sender == _owner, "MinimalERC20: Only owner can transfer ownership");
        require(newOwner != address(0), "MinimalERC20: new owner is the zero address");
        _owner = newOwner;
    }

    // @dev 返回账户的代币余额
    // @param account 要查询余额的地址
    function balanceOf(address _owner) public view returns (uint256 balance) {
        // write your code here
        return _balances[_owner];
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

        // 新增：检查合约是否暂停
        require(!_paused, "ERC20: token transfer while paused");

        uint256 fromBalance = _balances[_from];
        require(fromBalance >= _values, "ERC20: transfer amount exceeds balance");

        unchecked {
            _balances[_from] = fromBalance - _values;
            _balances[_to] += _values;
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