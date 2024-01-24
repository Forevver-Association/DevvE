import { ethers, upgrades } from "hardhat";
import { expect } from "chai";
import { Contract, ContractFactory } from "@ethersproject/contracts";

describe("DevvE", function () {
  let DevvE: ContractFactory;
  let devvE: Contract;
  let accounts: any;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    DevvE = await ethers.getContractFactory("DevvE");
    devvE = await upgrades.deployProxy(DevvE, [], {
      initializer: "initialize",
    });
    await devvE.deployed();
  });

  describe("Minting", function () {
    it("Should allow the minter to mint within limit", async function () {
      await devvE.grantRole(await devvE.MINTER_ROLE(), accounts[1].address);
      await devvE.setMinterLimit(accounts[1].address, 2000);
      await devvE.connect(accounts[1]).mint(accounts[2].address, 1000);
      expect(await devvE.balanceOf(accounts[2].address)).to.equal(1000);
      expect(await devvE.getMintedAmountBy(accounts[1].address)).to.equal(1000);
    });

    it("Should not allow non-minter to mint", async function () {
      await expect(
        devvE.connect(accounts[3]).mint(accounts[3].address, 1000)
      ).to.be.revertedWith("Caller does not have the minter role");
    });

    it("Should not allow minting above global limit", async function () {
      const amount = ethers.BigNumber.from("210000000001");
      await expect(
        devvE.connect(accounts[1]).mint(accounts[1].address, amount)
      ).to.be.revertedWith("Minting this amount would exceed the global limit");
    });

    it("Should not allow minter to mint above individual limit", async function () {
      await devvE.grantRole(await devvE.MINTER_ROLE(), accounts[1].address);
      await devvE.setMinterLimit(accounts[1].address, 1000);
      await devvE.connect(accounts[1]).mint(accounts[2].address, 1000);
      await expect(
        devvE.connect(accounts[1]).mint(accounts[2].address, 1000)
      ).to.be.revertedWith("Mint amount exceeds the caller's minting limit");
    });

    it("Should allow minter to mint after limit has been adjusted", async function () {
      await devvE.grantRole(await devvE.MINTER_ROLE(), accounts[1].address);
      await devvE.setMinterLimit(accounts[1].address, 1000);
      await devvE.connect(accounts[1]).mint(accounts[2].address, 1000);
      expect(await devvE.balanceOf(accounts[2].address)).to.equal(1000);
      await devvE.setMinterLimit(accounts[1].address, 2000);
      await devvE.connect(accounts[1]).mint(accounts[2].address, 500);
      expect(await devvE.balanceOf(accounts[2].address)).to.equal(1500);
      expect(await devvE.getMintedAmountBy(accounts[1].address)).to.equal(1500);
    });

    it("Should update the amount minted by minter correctly", async function () {
      const [admin, minter, receiver] = await ethers.getSigners();
      await devvE.grantRole(await devvE.MINTER_ROLE(), minter.address);
      await devvE.setMinterLimit(minter.address, 5000);
      await devvE.connect(minter).mint(receiver.address, 2000);
      expect(await devvE.getMintedAmountBy(minter.address)).to.equal(2000);
    });
  });

  describe("Minter limits", function () {
    it("Should allow admin to set minter limit", async function () {
      await devvE.grantRole(await devvE.MINTER_ROLE(), accounts[1].address);
      await devvE.setMinterLimit(accounts[1].address, 1000);
      expect(await devvE.getMinterLimit(accounts[1].address)).to.equal(1000);
    });

    it("Should not allow non-admin to set minter limit", async function () {
      await expect(
        devvE.connect(accounts[1]).setMinterLimit(accounts[1].address, 1000)
      ).to.be.revertedWith("Caller is not allowed to set minter limit");
    });

    it("Should not allow admin to mint", async function () {
      const [admin, receiver] = await ethers.getSigners();
      await expect(
        devvE.connect(admin).mint(receiver.address, 1)
      ).to.be.revertedWith("Caller does not have the minter role");
    });

    it("Should enforce minter limits correctly with multiple minters", async function () {
      const [admin, minter1, minter2, receiver] = await ethers.getSigners();
      await devvE.grantRole(await devvE.MINTER_ROLE(), minter1.address);
      await devvE.grantRole(await devvE.MINTER_ROLE(), minter2.address);
      await devvE.setMinterLimit(minter1.address, 2000);
      await devvE.setMinterLimit(minter2.address, 3000);
      await devvE.connect(minter1).mint(receiver.address, 1000);
      await devvE.connect(minter2).mint(receiver.address, 2000);
      expect(await devvE.balanceOf(receiver.address)).to.equal(3000);
    });
  });

  describe("Minter Role", function () {
    it("Should allow admin to assign MINTER_ROLE", async function () {
      await devvE.grantRole(await devvE.MINTER_ROLE(), accounts[1].address);
      expect(
        await devvE.hasRole(await devvE.MINTER_ROLE(), accounts[1].address)
      ).to.be.true;
    });

    it("Should not allow non-admin to assign MINTER_ROLE", async function () {
      const DEFAULT_ADMIN_ROLE = await devvE.DEFAULT_ADMIN_ROLE();
      await expect(
        devvE
          .connect(accounts[1])
          .grantRole(
            await devvE.MINTER_ROLE(),
            accounts[2].address.toLowerCase()
          )
      ).to.be.revertedWith(
        `AccessControl: account ${accounts[1].address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`
      );
    });

    it("Should allow changing admin role", async function () {
      const newAdmin = accounts[1].address;
      const currentAdminRole = await devvE.DEFAULT_ADMIN_ROLE();
      await devvE.grantRole(currentAdminRole, newAdmin);
      expect(await devvE.hasRole(currentAdminRole, newAdmin)).to.be.true;
    });

    it("Should prevent an address from minting after minter role is revoked", async function () {
      const [admin, minter, receiver] = await ethers.getSigners();
      await devvE.grantRole(await devvE.MINTER_ROLE(), minter.address);
      await devvE.setMinterLimit(minter.address, 5000);
      await devvE.revokeRole(await devvE.MINTER_ROLE(), minter.address);
      await expect(
        devvE.connect(minter).mint(receiver.address, 2000)
      ).to.be.revertedWith("Caller does not have the minter role");
    });
  });
});

describe("DevvE Contract Upgrade", function () {
  let DevvE: ContractFactory;
  let DevvE_V2: ContractFactory;
  let devvE: Contract;

  beforeEach(async function () {
    DevvE = await ethers.getContractFactory("DevvE");
    DevvE_V2 = await ethers.getContractFactory("DevvE_V2");
    devvE = await upgrades.deployProxy(DevvE, [], {
      initializer: "initialize",
    });
  });

  it("Should be able to deploy the V2 contract", async function () {
    const devvE_V2 = await upgrades.upgradeProxy(devvE.address, DevvE_V2);
    expect(devvE_V2.address).to.be.properAddress;
  });

  it("Should have burn function in V2", async function () {
    const accounts = await ethers.getSigners();
    const devvE_V2 = (await upgrades.upgradeProxy(
      devvE.address,
      DevvE_V2
    )) as Contract;
    await devvE.setMinterLimit(accounts[1].address, 2000);
    await devvE.connect(accounts[1]).mint(accounts[0].address, 1000);
    await devvE_V2.connect(accounts[0]).burn(1000);
    const balance = await devvE_V2.balanceOf(accounts[0].address);
    expect(balance).to.equal(0);
  });

  it("Should keep state after upgrade", async function () {
    const accounts = await ethers.getSigners();
    await devvE.setMinterLimit(accounts[1].address, 2000);
    await devvE.connect(accounts[1]).mint(accounts[0].address, 1000);
    const devvE_V2 = (await upgrades.upgradeProxy(
      devvE.address,
      DevvE_V2
    )) as Contract;
    const balance = await devvE_V2.balanceOf(accounts[0].address);
    expect(balance).to.equal(1000);
  });
});
