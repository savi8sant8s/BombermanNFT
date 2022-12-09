import { expect } from "chai";
import { ethers } from "hardhat";

describe("BombermanNFT", function () {
  it("Test contract", async function () {
    const ContractFactory = await ethers.getContractFactory("BombermanNFT");

    const instance = await ContractFactory.deploy();
    await instance.deployed();

    expect(await instance.name()).to.equal("BombermanNFT");
  });
});
