import { ethers, network } from "hardhat";
import address from "../address.json";
import { FUNC, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION } from "./utils";
import fs from "fs";
import path from "path";
const filePath = path.join(__dirname, "../proposals.json")

export const execute = async () => {
    const box = await ethers.getContractAt("Box", address.box);
    console.log("box value",await box.retrieve());
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, [NEW_STORE_VALUE])
    const governor = await ethers.getContractAt("GovernanceContract", address.governanceContract);
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
    const executeTx = await governor.execute(
        [address.box],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await executeTx.wait(1)
    console.log("box value",await box.retrieve());
    const file = fs.readFileSync(filePath, "utf-8");
    const proposals = JSON.parse(file);
    const proposalId = proposals[network.config.chainId!][0];

    const proposalState = await governor.state(proposalId);
    const proposalSnapShot = await governor.proposalSnapshot(proposalId);
    const proposalDeadline = await governor.proposalDeadline(proposalId);
    //提案的状态。1未通过。0已通过。
    console.log(`提案的状态。1未通过。0已通过,7执行完成: ${proposalState}`)
    // 该提案是哪个区块的快照
    console.log(`该提案是哪个区块的快照: ${proposalSnapShot}`)
    // 提案投票截止的区块编号
    console.log(`提案投票截止的区块编号: ${proposalDeadline}`)
}


// execute()
//     .then(_ => {
//         console.log("vote success")
//         process.exit(0)
//     })
//     .catch(err => {
//         console.log(err);
//         process.exit(1);
//     })
