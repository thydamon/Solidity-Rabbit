// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// 预言机的使用 https://docs.chain.link/data-feeds/price-feeds/addresses?page=1&testnetPage=1&network=ethereum
// 1.创建一个接收函数
// 2.记录投资人并且查看
// 3.在锁定期内，达到目标值，生产商可以提款
// 4.在锁定期内，没有达到目标值，投资人在锁定期以后退款
contract FundMe {
    mapping(address => uint256) public fundersToAmount;

    uint256 constant MINIMUM_VALUE = 1 * 10 ** 18; // USD

    AggregatorV3Interface internal dataFeed;

    uint256 constant TARGET = 1000 * 10 ** 18; // USD

    // 部署合约人
    address public owner;

    // 合约部署的时间点
    uint256 deploymentTimestamp;
    uint256 lockTime;

    // 变量初始化，只在合约构造的时候调用
    constructor(uint256 _lockTime) {
        // sepolia testnet
        dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306); // 0.000%
        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }
    
    function setDataFeed(address _dataFeed) external {
        dataFeed = AggregatorV3Interface(_dataFeed);
    }

    function fund() external payable {
        require(convertEthToUsd(msg.value) >= MINIMUM_VALUE, "Send more ETH");
        require(block.timestamp < deploymentTimestamp + lockTime, "Window is closed");
        fundersToAmount[msg.sender] = msg.value;
    }

    /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function convertEthToUsd(uint256 ethAmount) internal view returns(uint256) {
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice / (10 ** 8);
    }

    function transferOwnership(address newOwner) public {
        require(msg.sender == owner, "this function can only be call by owner");
        owner = newOwner;
    }

    function getFund() external windowClose onlyOwner {
        // wei --> USD
        require(convertEthToUsd(address(this).balance) >= TARGET, "Target is not reached");
        // require(msg.sender == owner, "this function can only be call by owner");
        // require(block.timestamp >= deploymentTimestamp + lockTime, "Window is not closed");
        // transfer: transfer ETH and revert if tx failed
        // payable(msg.sender).transfer(address(this).balance);
        // send: transfer ETH and return false if failed
        // bool success = payable(msg.sender).send(address(this).balance);
        // call: transfer ETH with data return value of function and bool
        bool success;
        (success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "transfer tx failed");
        fundersToAmount[msg.sender] = 0;
    }

    function refund() external windowClose onlyOwner {
        require(convertEthToUsd(address(this).balance) < TARGET, "Target is reached");
        // require(fundersToAmount[msg.sender] != 0, "there is no fund for you");
        // require(block.timestamp >= deploymentTimestamp + lockTime, "Window is not closed");
        bool success;
        (success, ) = payable(msg.sender).call{value: fundersToAmount[msg.sender]}("");
        require(success, "transfer tx failed");
        fundersToAmount[msg.sender] = 0;
    }

    modifier windowClose() {
        require(block.timestamp >= deploymentTimestamp + lockTime, "Window is not closed");
        _;
    }

    modifier onlyOwner() {
        require(fundersToAmount[msg.sender] != 0, "there is no fund for you");
        _;
    }
}