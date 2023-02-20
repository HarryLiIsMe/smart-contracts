import { mine,time } from "@nomicfoundation/hardhat-network-helpers";
import { latestBlock } from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time";
import { ethers } from "hardhat"
import address from "../address.json"
import { FUNC, MIN_DELAY, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION } from "./utils";


/**
 * 执行提案
 */
export const queue = async () => {
    const box = await ethers.getContractAt("Box", address.box);
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, [NEW_STORE_VALUE])
    // 提案内容转hash
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
    console.log(descriptionHash,"success message");
    const governor = await ethers.getContractAt("GovernanceContract", address.governanceContract);
    const queueTx = await governor.queue([box.address], [0], [encodedFunctionCall], descriptionHash)
    await queueTx.wait(1)

    console.log(await latestBlock(),  await time.latest());
    await time.increase(MIN_DELAY);
    await mine(1)
    await time.increase(MIN_DELAY + 1)
    console.log(await latestBlock(),  await time.latest());


    console.log('queue success!');
}


// queue()
//     .then(_ => {
//         console.log("vote success")
//         process.exit(0)
//     })
//     .catch(err => {
//         console.log(err);
//         process.exit(1);
//     })
