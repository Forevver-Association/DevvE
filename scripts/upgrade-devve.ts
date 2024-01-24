import { ethers, upgrades } from "hardhat";

async function main() {
    const proxyAddress = process.env.PROXY_CONTRACT_ADDRESS;
    const contractVersionSuffix = process.env.CONTRACT_VERSION_SUFFIX;

    if (!proxyAddress) {
        console.error('Set the PROXY_CONTRACT_ADDRESS environment variable before running the script');
        process.exit(1);
    }

    if (!contractVersionSuffix) {
        console.error('Set the CONTRACT_VERSION_SUFFIX environment variable before running the script');
        process.exit(1);
    }

    const contractVersion = `DevvE_${contractVersionSuffix}`;

    console.log("Upgrading contract at:", proxyAddress);
    console.log("Using contract version:", contractVersion);

    const ContractFactory = await ethers.getContractFactory(contractVersion);
    const upgradedContract = await upgrades.upgradeProxy(proxyAddress, ContractFactory);

    console.log("Contract upgraded:", upgradedContract.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
