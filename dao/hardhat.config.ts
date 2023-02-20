import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.18",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
  defaultNetwork:"localhost",
  networks: {
    localhost: {
        chainId: 31337,
        allowUnlimitedContractSize: true,
        gas:30000000
        // mining: {
        //     auto: true,
        //     interval: 1000
        // }
    },
  }
};

export default config;
