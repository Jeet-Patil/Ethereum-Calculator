// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Calculator {
    int256 public lastResult;
    event Calculated(address indexed caller, string operation, int256 a, int256 b, int256 result);

    function add(int256 a, int256 b) external returns (int256) {
        int256 res = a + b;
        lastResult = res;
        emit Calculated(msg.sender, "add", a, b, res);
        return res;
    }

    function sub(int256 a, int256 b) external returns (int256) {
        int256 res = a - b;
        lastResult = res;
        emit Calculated(msg.sender, "sub", a, b, res);
        return res;
    }

    function mul(int256 a, int256 b) external returns (int256) {
        int256 res = a * b;
        lastResult = res;
        emit Calculated(msg.sender, "mul", a, b, res);
        return res;
    }

    function div(int256 a, int256 b) external returns (int256) {
        require(b != 0, "Divide by zero");
        int256 res = a / b;
        lastResult = res;
        emit Calculated(msg.sender, "div", a, b, res);
        return res;
    }
}
