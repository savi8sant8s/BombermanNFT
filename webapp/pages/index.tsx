import Image from "next/image";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi } from '../abi'
const SMART_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS as string;

export default function Home() {
  const [bombermanNFT, setBombermanNFT] = useState({
    title: "",
    symbol: "",
    description:
      "NFT criado por Sávio Santos para o desafio proposto na Formação em Blockchain e Metaverso realizado pela UPE - Garanhuns, 2022.",
    techs:
      "Hardhat, Next.js, Alchemy, Goerli Faucet, MetaMask, Solidity, React e Typescript.",
    image: "/bomberman.gif",
  });
  const [amount, setAmount] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const handleGoToSource = () => {
    window.open("https://github.com/savi8sant8s/BombermanNFT");
  };

  const connectToMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    setSelectedAddress(accounts[0])
    await getNameAndSymbol()
    await getCountNFTsAvailable()
  }

  const getContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const contract = new ethers.Contract(SMART_CONTRACT_ADDRESS, abi, signer)
    return contract
  }

  const getCountNFTsAvailable = async () => {
    const contract = await getContract()
    const count = await contract.getCountNFTsAvailable()
    const countNumber = count.toNumber()
    setAmount(countNumber)
  }

  const handleBuyNFT = async () => {
    if (!selectedAddress) {
      connectToMetamask()
      return
    }
    const contract = await getContract()
    const transaction = await contract.mintNFT(selectedAddress)
    await transaction.wait()
    alert("NFT comprado com sucesso!")
  }

  const getNameAndSymbol = async () => {
    const contract = await getContract()
    const name = await contract.name()
    const symbol = await contract.symbol()
    setBombermanNFT({
      ...bombermanNFT,
      title: name,
      symbol,
    })
  }

  useEffect(() => {
    if (window.ethereum) {
      connectToMetamask();
    }
  }, []);

  return (
    <div className="padding">
      <div className="justify-between">
        <h1>NFT: {bombermanNFT.title} ({bombermanNFT.symbol})</h1>
        <Image
          onClick={handleGoToSource}
          className="source"
          src="/github.png"
          width={25}
          height={25}
          alt="Github"
        />
      </div>
      <div>
        <div>
          <strong>Descrição: </strong>
          {bombermanNFT.description}
        </div>
        <div>
          <strong>Tecnologias utilizadas: </strong>
          {bombermanNFT.techs}
        </div>
      </div>
      <div className="container">
     
      <Image
        src={bombermanNFT.image}
        alt="Bomberman"
        width={300}
        height={300}
      />
      <p><strong>Quantidade disponível: </strong> {amount}</p>
      <div className="buy" onClick={handleBuyNFT}>Adquirir NFT</div>
      </div>
    </div>
  );
}
