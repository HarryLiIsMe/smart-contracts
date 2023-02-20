const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("chainlink price", () => {
    it("chainlink price", async () => {
        const ChainlinkPrice = await ethers.getContractFactory("ChainlinkPrice");
        const chainlinkPrice = await ChainlinkPrice.deploy();
        await chainlinkPrice.deployed();
        console.log(chainlinkPrice.address);    //  0xCDe8DEBE70Ac93661ccb27281081c9E5549DFf8E
        const price = await chainlinkPrice.getPrice();
        console.log(price);
    })
})