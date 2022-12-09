import { expect } from "chai";
import { ethers } from "hardhat";

describe("BombermanNFT unit test", function () {

  const getInstance = async () => {
    const BombermanNFT = await ethers.getContractFactory("BombermanNFT");
    const instance = await BombermanNFT.deploy();
    await instance.deployed();
    return instance;
  }

  it("Should get NFT name and symbol", async function () {
    const instance = await getInstance();

    expect(await instance.symbol()).to.equal("BBMN");
    expect(await instance.name()).to.equal("BombermanNFT");
  });

  it("Should return count NFTs available", async ()=>{
    const instance = await getInstance();

    expect(await instance.getCountNFTsAvailable()).to.equal(50);
  });

  it("Should mint NFT", async ()=> {
    const instance = await getInstance();

    const [_owner, addr1] = await ethers.getSigners();
    await instance.connect(addr1).mintNFT(addr1.address);

    expect(await instance.getCountNFTsAvailable()).to.equal(49);
  });
});
