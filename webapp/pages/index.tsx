import Image from "next/image";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi } from "../abi";
const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_SMART_CONTRACT_ADDRESS as string;
const METADATA_URI = process.env.NEXT_PUBLIC_METADATA_URI as string;
const PINATA_URL = process.env.NEXT_PUBLIC_PINATA_URL as string;

export default function Home() {
  const [nft, setNFT] = useState({
    name: "",
    title: "",
    symbol: "",
    description: "",
    image: "",
    uri: "",
  });
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");
  const [tokenURIs, setTokenURIs] = useState<string[]>([]);

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
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
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
    const transaction = await contract
      .safeMint(address, nft.uri, { value: ethers.utils.parseEther("0.1") })
      .catch(() => {
        alert("Compra cancelada!");
      });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    alert("NFT comprado com sucesso!");
    await getCountNFTsAvailable();
    await getTokenURIs();
  };

  const getInfo = async () => {
    const contract = await getContract();
    const title = await contract.name();
    const symbol = await contract.symbol();
    const metadata = await fetch(`${PINATA_URL}/${METADATA_URI}`).then((res) =>
      res.json()
    );

    setNFT({
      ...nft,
      title,
      symbol,
      name: metadata.name,
      description: metadata.description,
      image: `${PINATA_URL}/${metadata.image}`,
      uri: metadata.image,
    });
  };

  const getTokenURIs = async () => {
    const contract = await getContract();
    const count = await contract.getCountNFTsAvailable();
    const amount = 50 - count.toNumber();
    const tokenURIs = [];
    for (let i = 0; i < amount; i++) {
      const tokenURI = await contract.tokenURI(i);
      tokenURIs.push(tokenURI);
    }
    setTokenURIs(tokenURIs);
  };

  useEffect(() => {
    // @ts-ignore
    if (window.ethereum) {
      connectToMetamask();
    }
  }, []);

  useEffect(() => {
    if (address) {
      getInfo();
      getCountNFTsAvailable();
      getTokenURIs();
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
      <div className="container">
        {nft.image != "" && (
          <Image
            className="nft"
            src={nft.image}
            alt="Bomberman"
            width={300}
            height={300}
          />
        )}
        <p>Quantidade disponível: {amount}</p>
        <button className="buy" onClick={handleBuyNFT}>
          Adquirir {nft.name}
        </button>
      </div>
      {tokenURIs.length > 0 && (
          <div>
            <h2>Token URIs</h2>
            <ul>
              {tokenURIs.map((tokenURI, index) => (
                <li key={index}>{tokenURI}</li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}
