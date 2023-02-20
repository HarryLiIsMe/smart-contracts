
require("@nomiclabs/hardhat-ethers");
const { config } = require("dotenv");
config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks:{
    goerli:{
        url:"https://goerli.blockpi.network/v1/rpc/public",
        accounts:[process.env.PRIVATE]
    }
  }
};
