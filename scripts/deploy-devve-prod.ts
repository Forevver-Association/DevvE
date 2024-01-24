import { ethers, upgrades } from "hardhat";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';

async function main() {
    const ethProvider = require('eth-provider'); // eth-provider is a simple EIP-1193 provider
    const frame = ethProvider('frame'); // Connect to Frame       
    const DevvE = await ethers.getContractFactory("DevvE");
    const tx = await DevvE.getDeployTransaction();
    tx.from = (await frame.request({ method: 'eth_requestAccounts' }))[0];
    const devve = await frame.request({ method: 'eth_sendTransaction', params: [tx] });
    console.log(JSON.stringify(devve));
    console.log("DevvE proxy deployed to:", devve.address);
    const implementationAddress = await getImplementationAddress(ethProvider, devve.address);
    console.log("DevvE implementation deployed to:", implementationAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
