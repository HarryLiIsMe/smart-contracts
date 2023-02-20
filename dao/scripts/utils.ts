import { ethers, network } from "hardhat"
export const MIN_DELAY = 3600; // 投票时间
export const QUORUM_PERCENTAGE = 4; //  投票人数
export const VOTING_PERIOD = 5; //  投票区将
export const VOTING_DELAY = 1;  //  提案创建后延迟至投票开始 投票提案后的延迟确认区块
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

export const NEW_STORE_VALUE = 77
export const FUNC = "store"
export const PROPOSAL_DESCRIPTION = "Proposal #1 77 in the Box!1111111";



// enum ProposalState {
//     Pending,    //没有发起投票
//     Active,     //可以投票
//     Canceled,   //投票取消
//     Defeated,   //失败
//     Succeeded,  //已经投过票 投票成功
//     Queued,     //等待排队执行
//     Expired,    //开始执行
//     Executed    //执行成功
// }