import Image from "next/image";
import { useState } from "react";

type BombermanNFT = {
  title: string;
  description: string;
  techs: string;
  image: string;
};

export default function Home() {
  const [bombermanNFT, setBombermanNFT] = useState<BombermanNFT>({
    title: "Bomberman NFT",
    description:
      "NFT criado por Sávio Santos para o desafio proposto na Formação em Blockchain e Metaverso realizado pela UPE - Garanhuns, 2022.",
    techs:
      "Hardhat, Next.js, Alchemy, Goerli Faucet, MetaMask, Solidity, Pinata, IPFS, React e Typescript.",
    image: "/bomberman.gif",
  });
  const [amount, setAmount] = useState(50);
  const [value, setValue] = useState(0.5);

  const handleGoToSource = () => {
    window.open("https://github.com/savi8sant8s/BombermanNFT");
  };

  return (
    <div className="padding">
      <div className="justify-between">
        <h1>Título: {bombermanNFT.title}</h1>
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
      <p>
        <strong>Quantidade disponível: </strong>
        {amount} / <strong>Preço:</strong> {value} Goerli ETH
      </p>
      <div className="buy">Adquirir NFT</div>
      <footer>
        Desafio proposto na Formação em Blockchain e Metaverso realizado pela
        UPE - Garanhuns, 2022.
      </footer>
      </div>
    </div>
  );
}
