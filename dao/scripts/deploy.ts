import { writeFileSync } from "fs";
import { ethers } from "hardhat";
import { propose } from "./1.propose";
import { vote } from "./2.vote";
import { queue } from "./3.queue";
import { execute } from "./4.execute";
import { ADDRESS_ZERO, FUNC, MIN_DELAY, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION, QUORUM_PERCENTAGE, VOTING_DELAY, VOTING_PERIOD } from "./utils";
let address = {
    governanceToken: "",
    timeLock: "",
    governanceContract: "",
    box: "",
}

export const deployContract = async () => {
    const [signer] = await ethers.getSigners();
    console.log("my address",signer.address);

    const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
    const governanceToken = await GovernanceToken.deploy();
    await governanceToken.deployed();
    // 投票权 
    const delagateTx = await governanceToken.delegate(signer.address);
    await delagateTx.wait();
    // 投票记录
    console.log(`Checkpoints: ${await governanceToken.numCheckpoints(signer.address)}`)


    const TimeLock = await ethers.getContractFactory("TimeLock");
    const timeLock = await TimeLock.deploy(
        MIN_DELAY,
        [],
        [],
        signer.address
    );
    await timeLock.deployed();


    const GovernanceContract = await ethers.getContractFactory("GovernanceContract");
    const governanceContract = await GovernanceContract.deploy(
        governanceToken.address,
        timeLock.address,
        QUORUM_PERCENTAGE,
        VOTING_PERIOD,
        VOTING_DELAY
    );
    await governanceContract.deployed();


    const proposerRole = await timeLock.PROPOSER_ROLE();
    const exexutorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();
    // 投票合约 只有这个合约可以发起投票
    const proposerTx = await timeLock.grantRole(proposerRole, governanceContract.address);
    await proposerTx.wait();
    // 执行合约 执行投票权限  0x00 是所有人都能投票 上线要控制权限
    const executorTx = await timeLock.grantRole(exexutorRole, ADDRESS_ZERO);
    await executorTx.wait();
    // 管理员
    const revokeTx = await timeLock.revokeRole(adminRole, signer.address);
    await revokeTx.wait();


    const Box = await ethers.getContractFactory("Box");
    const box = await Box.deploy();
    await box.deployed();
    console.log("box value", await box.retrieve())

    const transferOwnerTx = await box.transferOwnership(timeLock.address);
    await transferOwnerTx.wait();

    address = {
        governanceToken: governanceToken.address,
        timeLock: timeLock.address,
        governanceContract: governanceContract.address,
        box: box.address,
    }

    console.log(address);
    await writeFileSync("address.json", JSON.stringify(address));

    // 1. 发起投票
    await propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
        .then(_ => {
            console.log("proposeal success")
        })
        .catch(err => {
            console.log(err);
            process.exit(1);
        })

    // 2.投票
    await vote(0)
        .then(_ => {
            console.log("vote success")
        })
        .catch(err => {
            console.log(err);
            process.exit(1);
        })
        await queue()
    .then(_ => {
        console.log("vote success")
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    })
    await execute()
    .then(_ => {
        console.log("vote success")
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    })
}


deployContract()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
