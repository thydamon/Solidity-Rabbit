// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import MinimalERC20 contract
import "./MinimalERC20.sol";

/**
 * @title MinimalProxyERC20Factory - ERC20 最小代理工厂
 * @dev 该合约用于部署 MinimalERC20 的最小代理合约的工厂
 */
contract MinimalProxyERC20Factory {
    // 逻辑合约地址
    address public immutable erc20Logic;

    // 事件
    event ERC20ProxyCreated(
        address indexed proxy,
        address indexed owner,
        string name,
        string symbol,
        uint256 initialSupply 
    );

    event LogicUpdated(address indexed oldLogic, address indexed newLogic);

    // 管理员地址
    address public _owner;

    // 所有已部署的代理合约
    address[] public _deployedProxies;

    // 每个用户的代理映射
    mapping(address => address[]) public _userProxies;

    // 代理到信息的映射
    mapping(address => TokenInfo) public _tokenInfo;

    // 代币信息结构
    struct TokenInfo {
        address owner;
        string name;
        string symbol;
        uint256 initialSupply;
        uint8 decimals;
        uint256 totalSupply;
    }

    /**
     * @dev 构造函数，部署逻辑合约
     */
    constructor() {
        _owner = msg.sender;

        // 部署一次逻辑合约
        MinimalBaseERC20 logic = new MinimalBaseERC20();
        erc20Logic = address(logic);

        emit LogicUpdated(address(0), erc20Logic);
    }

    /**
     * @dev 创建 MinimalERC20 代理合约
     */
    function createERC20Proxy(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals
    ) external returns (address proxy) {
        return _createProxy(
            name,
            symbol,
            initialSupply,
            decimals,
            msg.sender
        );
    }

    /**
     * @dev 使用CREATE2创建可预测地址的代币代理
     */
    function createERC20ProxyDeterministic(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals,
        bytes32 salt
    ) external returns (address proxy) {
        // 先计算出预期地址
        address prodicted = computeProxyAddress(
            name,
            symbol,
            initialSupply,
            decimals,
            msg.sender,
            salt
        );

        // 再用相同参数创建代理
        proxy = _createProxyWithSalt(
            name,
            symbol,
            initialSupply,
            decimals,
            msg.sender,
            salt
        );

        require(proxy == prodicted, "Address mismatch");
        return proxy;
    }

    /**
     * @dev 批量创建多个 MinimalERC20 代理合约
     */
    function batchCreateProxies(
        string[] memory names,
        string[] memory symbols,
        uint256[] memory initialSupplies,
        uint8[] memory decimalsList
    ) external returns (address[] memory proxies) {
        require(
            names.length == symbols.length &&
            names.length == initialSupplies.length &&
            names.length == decimalsList.length,
            "Array length mismatch"
        );

        proxies = new address[](names.length);

        for (uint256 i = 0; i < names.length; i++) {
            proxies[i] = _createProxy(
                names[i],
                symbols[i],
                initialSupplies[i],
                decimalsList[i],
                msg.sender
            );
        }

        return proxies;
    }

    /**
     * @dev 提前算出“如果用同样的 salt + 同样的部署字节码(init_code) 去 create2 部署”，
     *      最终会得到的代理合约地址。
     */
    function computeProxyAddress(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals,
        address owner_,
        bytes32 salt
    ) public view returns (address) {
        // initCode 是 EIP-1167 最小代理的创建代码（里面包含 erc20Logic 地址）
        bytes memory initCode = _getProxyCreationCode();
        // 生成对initialize的ABI编码calldata(4字节selector + 参数编码)
        bytes memory initData = abi.encodeWithSignature(
            "initialize(address,string,string,uint256,uint8)",
            owner_,
            name,
            symbol,
            initialSupply,
            decimals
        );

        // 计算init_code的哈希值，这里算出来的是未来部署输入字节码的hash
        bytes32 initCodeHash = keccak256(
            abi.encodePacked(initCode, initData) // initCode || initData简单拼接
        );

        // CREATE2 地址计算公式 
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),   // 固定前缀，用于避免与RLP规则冲突（规范要求）
                address(this),  // 部署者地址，这里就是工厂合约地址（因为create2是工厂执行的）
                salt,           // 用户提供的盐值
                initCodeHash    // 部署字节码的hash
            )
        );

        // 取低20字节作为地址返回
        return address(uint160(uint256(hash)));
    }

    /**
     * @dev 获取用户的所有代币代理
     */
    function getProxiesByUser(address user) external view returns (address[] memory) {
        return _userProxies[user];
    }

    /** 
     * @dev 获取所有已部署的代理合约
     */
    function getAllProxies() external view returns (address[] memory) {
        return _deployedProxies;
    }     

    /**
     * @dev 获取代币信息
     */
    function getTokenInfo(address proxy) external view returns (TokenInfo memory) {
        return _tokenInfo[proxy];
    }

    /** 
     * @dev 获取代理合约数量
     */
    function getProxyCount() external view returns (uint256) {
        return _deployedProxies.length;
    }

    /**
     * @dev 检查地址是否为 ERC20 代理合约
     */
    function isERC20Proxy(address proxy) external view returns (bool) {
        if (proxy.code.length != 45) {  // EIP-1167 代理合约的字节码长度为 45 字节
            return false;
        }

        (bool success, bytes memory data) = proxy.staticcall(
            abi.encodeWithSignature("owner()")
        );

        if (!success) return false;

        // 如果能够成功调用owner()函数，说明是有效的代理
        return true;
    }

    /**
     * @dev 内部函数：创建代理合约，地址不固定，部署后显式初始化
     */
    function _createProxy(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals,
        address owner_
    ) internal returns (address proxy) {
        // 获取代理创建代码
        bytes memory code = _getProxyCreationCode();

        // 使用汇编指令创建代理合约
        assembly {
            // 用code的内存地址和长度来创建合约，返回新合约地址
            proxy := create(0, add(code, 0x20), mload(code))
        }

        require(proxy != address(0), "Failed to deploy proxy");

        // 初始化代理合约
        _initializeProxy(proxy, name, symbol, initialSupply, decimals, owner_);

        // 记录信息
        _recordProxy(proxy, name, symbol, initialSupply, decimals, owner_);

        return proxy;
    }

    /**
     * @dev 内部函数：使用 CREATE2 创建代理合约，地址固定
     */
    function _createProxyWithSalt(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals,
        address owner_,
        bytes32 salt
    ) internal returns (address proxy) {
        bytes memory code = _getProxyCreationCode();

        // 准备初始化数据
        bytes memory initData = abi.encodeWithSignature(
            "initialize(address,string,string,uint256,uint8)",
            owner_,
            name,
            symbol,
            initialSupply,
            decimals
        );

        // 组合创建代码和初始化数据，代理创建码+初始化参数数据的简单拼接
        bytes memory creationCode = abi.encodePacked(code, initData);

        // 使用CREATE2部署代理合约
        assembly {
            proxy := create2(0, add(creationCode, 0x20), mload(creationCode), salt)
        }

        require(proxy != address(0), "Failed to deploy proxy");

        // 记录信息
        _recordProxy(proxy, name, symbol, initialSupply, decimals, owner_);

        return proxy;
    }

    /**
     * @dev 内部函数：初始化代理合约
     */
    function _initializeProxy(
        address proxy,
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals,
        address owner_
    ) internal {
        // 在代理合约部署完成后，立即通过一次外部调用call去执行代理合约的initialize函数，
        // 从而吧ERC20的初始化参数写入“代理自己的存储”里
        (bool success, ) = proxy.call(
            abi.encodeWithSignature(
                "initialize(address,string,string,uint256,uint8)", // 函数选择器
                owner_,
                name,
                symbol,
                initialSupply,
                decimals
            )
        );

        require(success, "Initialization failed");
    }

    /**
     * @dev 内部函数：记录代理信息
     */
    function _recordProxy(
        address proxy,
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals,
        address owner_
    ) internal {
        // 添加到全局列表
        _deployedProxies.push(proxy);
        // 添加到用户映射
        _userProxies[owner_].push(proxy);

        // 存储代币信息
        _tokenInfo[proxy] = TokenInfo({
            owner: owner_,
            name: name,
            symbol: symbol,
            initialSupply: initialSupply,
            decimals: decimals,
            totalSupply: initialSupply
        });

        // 触发事件
        emit ERC20ProxyCreated(proxy, owner_, name, symbol, initialSupply);
    }

    /**
     * @dev 内部函数：获取代理创建代码
     */
    function _getProxyCreationCode() internal view returns (bytes memory) {
        // EIP-1167 最小代理字节码
        return abi.encodePacked(  // 简单拼接不做32字节对齐，abi.encode会填充并做32字节对齐
            hex"3d602d80600a3d3981f3",   // 10字节 - 初始化代码
            hex"363d3d373d3d3d363d73",   // 10字节 - 委托调用前缀
            erc20Logic,                  // 20字节 - 逻辑合约地址
            hex"5af43d82803e903d91602b57fd5bf3"  // 15字节 - 委托调用后缀
        );
    }

    /**
     * @dev 获取所有者
     */
    function owner() external view returns (address) {
        return _owner;
    }

    /**
     * @dev 转移工厂所有权
     */
    function transferOwnership(address newOwner) external {
        require(msg.sender == _owner, "Only owner can transfer ownership");
        require(newOwner != address(0), "New owner is the zero address");
        _owner = newOwner;
    }

}