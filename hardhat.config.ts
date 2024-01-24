import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers";
import '@openzeppelin/hardhat-upgrades';
import { HardhatUserConfig } from 'hardhat/config';
import "@nomicfoundation/hardhat-ledger";

const ledgerAccounts = [
  0x37d0A81aD6A85945Db59E33C40cEa53275aC5694
];

const config: HardhatUserConfig = {
  solidity: '0.8.10',
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: `https://mainnet.infura.io/v3/ebc274e4ba0d4de59c022a63fe5897b5`,
      ledgerAccounts: ledgerAccounts
    }
  },
  localhost: {
      url: "http://127.0.0.1:8545",
      accounts: ledgerAccounts,
  },
  etherscan: {
    apiKey: `XN59PJ3FP5GT8GKE56AXEIVZEPTRCFUYAC`
  }
};
export default config;
