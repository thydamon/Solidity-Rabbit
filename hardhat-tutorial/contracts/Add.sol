// SPDX-License-Identifier: GPL-3.0
// Hardhat 中文网: http://hardhat.cn
pragma solidity >=0.8.2 <0.9.0;

contract Add {
    uint number;

    event myEvent(uint name);

    function add(uint a, uint b) public pure returns(uint) {
        return a+b;
    }

    function setNumber(uint _number) public {
        number = _number;
    }

    function getNumber() public view returns(uint) {
        return number;
    }
}