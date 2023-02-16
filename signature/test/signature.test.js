const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("signature", () => {
    it("Verify", async () => {
        const [owner] = await ethers.getSigners();
        const Signature = await ethers.getContractFactory("Signature");
        const signature = await Signature.deploy();
        await signature.deployed();
        console.log(signature.address);

        const to = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
        const amount = "100000";
        const nonce = "123";
        const message = "message signature";


        // 调用合约中的hash
        // const hash = await signature.getMessageHash(to, amount, nonce, message);
        // 调用ethers
        const hash = ethers.utils.solidityKeccak256(["address","uint256","uint256","string"], [to, amount, nonce, message]);
        const hasByte = ethers.utils.arrayify(hash);
        const sig = await owner.signMessage(hasByte);
        console.log(sig);

        const { v, r, s } = ethers.utils.splitSignature(sig);
        // 签名
        expect(await signature.verify(owner.address, to, amount, nonce, message, v, r, s)).to.equal(true);

        
        // 根据签名返回调用者地址
        const receverHash = await signature.getEthSignedMessageHash(hash)
        console.log("recovered signer", await signature.recoverSigner(receverHash, sig))
    })
})