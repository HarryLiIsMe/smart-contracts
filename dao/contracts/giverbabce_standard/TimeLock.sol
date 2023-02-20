// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    //minDelay是在执行之前必须等待的时间
    //Proposers是可以提议的地址列表
    //Executors是可以执行的地址列表
    constructor(
        uint256 minDelay,
        address[] memory proposers, //投票建议
        address[] memory executors,//投票执行
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
