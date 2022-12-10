import Image from "next/image";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi } from "../abi";
const SMART_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_SMART_CONTRACT_ADDRESS as string;

export default function Home() {
  const [nft, setNFT] = useState({
    title: "",
    symbol: "",
    description:
      "NFT criado por Sávio Santos para o desafio proposto na Formação em Blockchain e Metaverso realizado pela UPE - Garanhuns, 2022.",
    techs:
      "Hardhat, Next.js, Alchemy, Goerli Faucet, MetaMask, Solidity, React e Typescript.",
    image: "/bomberman.png",
  });
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");

  const handleGoToSource = () => {
    window.open("https://github.com/savi8sant8s/bomberman-nft");
  };

  const connectToMetamask = async () => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAddress(accounts[0]);
  };

  const getContract = async () => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(SMART_CONTRACT_ADDRESS, abi, signer);
    return contract;
  };

  const getCountNFTsAvailable = async () => {
    const contract = await getContract();
    const count = await contract.getCountNFTsAvailable();
    const amount = count.toNumber();
    setAmount(amount);
  };

  const handleBuyNFT = async () => {
    if (!address) {
      return await connectToMetamask();
    }
    const contract = await getContract();
    const transaction = await contract.mintNFT(address).catch(() => {
      alert("Compra cancelada!");
    });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    alert("NFT comprado com sucesso!");
    await getCountNFTsAvailable();
  };

  const getNameAndSymbol = async () => {
    const contract = await getContract();
    const title = await contract.name();
    const symbol = await contract.symbol();
    setNFT({
      ...nft,
      title,
      symbol,
    });
  };

  useEffect(() => {
      // @ts-ignore
      if (window.ethereum) {
        connectToMetamask();
      }
  }, []);

  useEffect(() => {
    if (address) {
      getNameAndSymbol();
      getCountNFTsAvailable();
    }
  }, [address]);

  return (
    <div className="padding">
      <div className="justify-between">
        <h1>
          NFT: {nft.title} ({nft.symbol})
        </h1>
        <Image
          onClick={handleGoToSource}
          className="pointer"
          src="/github.png"
          width={25}
          height={25}
          alt="Github"
        />
      </div>
      <p>
        <strong>Descrição: </strong> {nft.description}
      </p>
      <p>
        <strong>Tecnologias utilizadas: </strong> {nft.techs}
      </p>
      <div className="container">
        <Image
          className="nft"
          src={nft.image}
          alt="Bomberman"
          width={300}
          height={300}
        />
        <p>Quantidade disponível: {amount}</p>
        <button className="buy" onClick={handleBuyNFT}>
          Adquirir NFT
        </button>
      </div>
    </div>
  );
}
