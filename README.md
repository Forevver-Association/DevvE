# ERC20 Token

DevvE is an ERC20 token implemented using Solidity. The token contract includes wallet-based minting permissions with individual and global minting limits. The contracts are designed to be upgradeable, so you can upgrade the smart contracts without affecting the state (balances) of the tokens.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Testing](#testing)
- [Upgrading the Contract](#upgrading-the-contract)

## Features

- ERC20 Compliant Tokens
- Wallet-Based Access Control for Minting
- Individual and Global Minting Limits
- Contract is Upgradeable
- Written in Solidity 0.8.20

## Prerequisites

- Node.js >=12.0.0
- Yarn or NPM
- Hardhat
- Ethereum Wallet with some test Ether (if deploying to testnet/mainnet)

## Installation

1. Clone the repository:

```sh
git clone git@github.com:Forevver-Association/DevvE.git
cd DevvE-ERC-20
```

2. Install the dependencies:

```sh
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:

```sh
cp .env.example .env
```

2. Set the environment variables in the `.env` file:

- `PRIVATE_KEY`: The private key of your Ethereum account (without the `0x` prefix).
- `PROXY_ADDRESS`: (Optional) If you're upgrading an existing contract, set the address of the proxy contract here.
- `VERSION_SUFFIX`: (Optional) If you're upgrading an existing contract, set the version of the implementation contract here.

## Usage

### Compiling the Contract

```sh
npx hardhat compile
```

### Deploying the Contract

To deploy the contract to the local Hardhat network:

```sh
npx hardhat run --network localhost scripts/deploy-devve.ts
```

Note: Make sure your local Hardhat network is running. You can start it with `npx hardhat node`.

## Testing

To run the tests against the local Hardhat network, use the following command:

```sh
npx hardhat test

```

## Upgrading the Contract

We are using OpenZeppelin's Upgrades plugin to handle smart contract upgrades. Before running the upgrade script, you must have the address of the proxy contract you want to upgrade, and the version suffix of the contract you want to upgrade to (e.g., "V2" for "DevvE_V2").

1. Set the environment variables PROXY_CONTRACT_ADDRESS and CONTRACT_VERSION_SUFFIX in the `.env` file or export them in your shell session

```sh
export PROXY_CONTRACT_ADDRESS=0xYourProxyContractAddressHere
export CONTRACT_VERSION_SUFFIX=V2
```

2. Compile the new contract version if you haven't already:

```sh
npx hardhat compile
```

3. Run the upgrade script:

```sh
npx hardhat run --network localhost scripts/upgrade-devve.ts
```

Note: Replace `localhost` with any network defined in the `hardhat.config.ts`
