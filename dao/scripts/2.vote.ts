import fs from "fs";
import { ethers, network } from "hardhat";

import address from "../address.json";
import { latestBlock } from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import { VOTING_DELAY, VOTING_PERIOD } from "./utils";
import path from "path";

const filePath = path.join(__dirname, "../proposals.json")


// 投票
/**
 * 0 返回
 * 1 赞成
 * 2 弃权
 * @param proposakIndex 
 */
export const vote = async (proposakIndex: number) => {
    const file = fs.readFileSync(filePath, "utf-8");
    const proposals = JSON.parse(file);
    const proposalId = proposals[network.config.chainId!][proposakIndex];

    console.log(await latestBlock());
    const governor = await ethers.getContractAt("GovernanceContract", address.governanceContract);
    console.log(proposalId);

    const voteTxResponse = await governor.castVoteWithReason(proposalId, 1, "I lika do da cha cha", { gasLimit: 30000000 })
    await voteTxResponse.wait();



    console.log(await latestBlock());
    await mine(VOTING_DELAY + 2)
    console.log(await latestBlock());

    const proposalState = await governor.state(proposalId);
    const proposalSnapShot = await governor.proposalSnapshot(proposalId);
    const proposalDeadline = await governor.proposalDeadline(proposalId);
    //提案的状态。1未通过。0已通过。
    console.log(`提案的状态。1未通过。0已通过: ${proposalState}`)
    // 该提案是哪个区块的快照
    console.log(`该提案是哪个区块的快照: ${proposalSnapShot}`)
    // 提案投票截止的区块编号
    console.log(`提案投票截止的区块编号: ${proposalDeadline}`)
    console.log("voted readt to go!~");

}

// vote(0)
//     .then(_ => {
//         console.log("vote success")
//         process.exit(0)
//     })
//     .catch(err => {
//         console.log(err);
//         process.exit(1);
//     })
