import { ethers, upgrades } from "hardhat";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';

async function main() {
    const DevvE = await ethers.getContractFactory("DevvE");
    const devve = await upgrades.deployProxy(DevvE, [], { initializer: 'initialize' });
    const provider = ethers.provider;
    console.log("DevvE proxy deployed to:", devve.address);
    const implementationAddress = await getImplementationAddress(provider, devve.address);
    console.log("DevvE implementation deployed to:", implementationAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
