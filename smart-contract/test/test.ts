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

  it("Should get count NFTs available", async ()=>{
    const instance = await getInstance();

    expect(await instance.getCountNFTsAvailable()).to.equal(50);
  });

  it("Should mint NFT", async ()=> {
    const instance = await getInstance();

    const [_owner, addr1] = await ethers.getSigners();
    const randomURI = Math.random().toString(36).substring(7);
    await instance.connect(addr1).safeMint(addr1.address, randomURI, {value: ethers.utils.parseEther("0.1")});

    expect(await instance.getCountNFTsAvailable()).to.equal(49);
  });

  it("Should mint NFT with invalid address", async ()=>{
    const instance = await getInstance();

    const [_owner, addr1] = await ethers.getSigners();
    const randomURI = Math.random().toString(36).substring(7);
    await expect(instance.connect(addr1).safeMint("0x0000000000000000000000000000000000000000", randomURI, {value: ethers.utils.parseEther("0.1")})).to.be.revertedWith("You can't mint to the zero address");
  });

  it("Should mint NFT with invalid price", async ()=>{
    const instance = await getInstance();

    const [_owner, addr1] = await ethers.getSigners();
    const randomURI = Math.random().toString(36).substring(7);
    await expect(instance.connect(addr1).safeMint(addr1.address, randomURI, {value: ethers.utils.parseEther("0.01")})).to.be.revertedWith("You must pay the correct price");
  });

  it("Should mint NFT with invalid URI", async ()=>{
    const instance = await getInstance();

    const [_owner, addr1] = await ethers.getSigners();
    await expect(instance.connect(addr1).safeMint(addr1.address, "", {value: ethers.utils.parseEther("0.1")})).to.be.revertedWith("You must provide a token URI to mint a token");
  });

  it("Should mint all tokens", async ()=> {
    const instance = await getInstance();

    const [_owner, addr1] = await ethers.getSigners();
    for (let i = 0; i < 50; i++) {
      const randomURI = Math.random().toString(36).substring(7);
      await instance.connect(addr1).safeMint(addr1.address, randomURI, {value: ethers.utils.parseEther("0.1")});
    }
    const randomURI = Math.random().toString(36).substring(7);
    await expect(instance.connect(addr1).safeMint(addr1.address, randomURI, {value: ethers.utils.parseEther("0.1")})).to.be.revertedWith("All tokens have been minted");
  })
});
