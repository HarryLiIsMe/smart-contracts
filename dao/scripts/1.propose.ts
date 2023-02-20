import { ethers, network } from "hardhat"
import { FUNC, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION } from "./utils";

import address from "../address.json";
import { readFileSync, writeFileSync } from "fs";
import { moveBlocks, VOTING_DELAY } from "./utils";
import path from "path";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import { latestBlock } from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time";
const developmentChains = ["hardhat", "localhost"];

const filePath = path.join(__dirname,"../proposals.json")


// 发起提案
export const propose = async (args: any[], functionToCall: string, proposalDescription: string) => {

    const governor = await ethers.getContractAt("GovernanceContract", address.governanceContract);
    const box = await ethers.getContractAt("Box", address.box);
    // 调用的合约和参数达成abi.enode
    const encodeFunctionCall = box.interface.encodeFunctionData(functionToCall, args);
    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposal Description:\n  ${proposalDescription}`)
    // 上报提案
    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodeFunctionCall],// store(Proposal #1 77 in the Box!)
        proposalDescription,
        {gasLimit:3000000}
    )

    console.log(await latestBlock());
    await mine(VOTING_DELAY + 1)
    console.log(await latestBlock());

    const proposeReceipt: any = await proposeTx.wait();
    
    const proposalId = proposeReceipt.events[0].args.proposalId;
    console.log(proposalId);


    const proposalState = await governor.state(proposalId);
    const proposalSnapShot = await governor.proposalSnapshot(proposalId);
    const proposalDeadline = await governor.proposalDeadline(proposalId);
     //提案的状态。1未通过。0已通过。
    console.log(`提案的状态。1未通过。0已通过: ${proposalState}`)
    // 该提案是哪个区块的快照
    console.log(`该提案是哪个区块的快照: ${proposalSnapShot}`)
    // 提案投票截止的区块编号
    console.log(`提案投票截止的区块编号: ${proposalDeadline}`)
    console.log(await latestBlock());

    
    let proposals = JSON.parse(readFileSync(filePath, "utf-8"));
    proposals[network.config.chainId!.toString()].unshift(proposalId.toString());
    writeFileSync(filePath, JSON.stringify(proposals));
}



// propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
//         .then(_ => {
//             console.log("proposeal success")
//             process.exit(0)
//         })
//         .catch(err => {
//             console.log(err);
//             process.exit(1);
//         })
