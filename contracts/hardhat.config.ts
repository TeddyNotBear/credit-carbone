import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

import { config } from "dotenv";
config({ path: require('find-config')('.env') });

const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const POLYGON_API_KEY = process.env.POLYGON_API_KEY || "";

const hhConfig: HardhatUserConfig = {
  networks: {
    hardhat: {
    },
   
  },

  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  gasReporter: {
    enabled: true
  }
};

export default hhConfig;