import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const mumbaiRpcUrl = process.env.POLYGON_MUMBAI_RPC_URL;
const privateKey = process.env.TESTNET_PRIVATE_KEY;
const polygonscanApiKey = process.env.POLYGONSCAN_API_KEY;

if (!mumbaiRpcUrl) {
  console.warn("POLYGON_MUMBAI_RPC_URL not found in .env file.");
}
if (!privateKey) {
  console.warn("TESTNET_PRIVATE_KEY not found in .env file. Deployments to testnet will fail.");
}

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
    },
    mumbai: {
      url: mumbaiRpcUrl || "",
      accounts: privateKey !== undefined ? [privateKey] : [],
    },
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS === 'true') ? true : false,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: {
       polygonMumbai: polygonscanApiKey || ""
    }
  },
};

export default config;