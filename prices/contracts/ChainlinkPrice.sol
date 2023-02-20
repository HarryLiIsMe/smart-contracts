// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ChainlinkPrice {
    AggregatorV3Interface internal priceFeed;

    constructor() {
        // BTC/USD
        priceFeed = AggregatorV3Interface(0xA39434A63A52E749F02807ae27335515BA4b07F7);
    }

    function getPrice() public view returns(int256){
        (, int256 answer,,,) = priceFeed.latestRoundData();
        return answer;
    }
}
