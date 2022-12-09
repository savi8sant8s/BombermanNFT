import { ethers } from "hardhat";

async function main() {
  const ContractFactory = await ethers.getContractFactory("BombermanNFT");

  const instance = await ContractFactory.deploy();
  await instance.deployed();

  console.log(`Contract deployed to ${instance.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
