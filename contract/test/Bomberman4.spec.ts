import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Bomberman4", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Bomberman4 = await ethers.getContractFactory("Bomberman4");
    const instance = await Bomberman4.deploy();

    return { instance, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should have 50 tokens", async function () {
      const { instance } = await loadFixture(deployFixture);

      expect(await instance.getAmountTokens()).to.equal(50);
    });
  });
});
