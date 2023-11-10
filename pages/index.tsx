// @ts-nocheck
import React, { useState } from 'react';
import {
  useAddress,
  useMetamask,
  useDisconnect,
  useNFTCollection,
  useOwnedNFTs,
  ConnectWallet
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Link from 'next/link';
import propertiesData from '../public/properties.json'; // Adjust the path as necessary

const Home: NextPage = () => {
  const [passwords, setPasswords] = useState({});
  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();
  const nftCollection = useNFTCollection(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const { data: ownedNFTs, isLoading } = useOwnedNFTs(nftCollection, address);

  const handlePasswordChange = (propertyName, value) => {
    setPasswords({ ...passwords, [propertyName]: value });
  };

  const renderPropertyLinks = () => {
    return propertiesData.map((property) => (
      <div key={property.number} className="relative flex flex-col space-y-3 bg-white shadow-2xl">
        {/* <div className="absolute top-3 right-3 font-bold">{property.number}</div> */}
        <div className="flex flex-col space-y-3 p-3">
          <img src={`/${property.image}`} alt={property.name} className="w-20 h-20" />
          <h2 className="text-2xl">{property.description}</h2>
        </div>
        <div className="flex flex-col space-y-px p-3 bg-gray-200">
          <input
            className="border border-black/30 p-3 w-full text-center rounded-none shadow-sm"
            type="password"
            placeholder="Wachtwoord om door te gaan"
            onChange={(e) => handlePasswordChange(property.name, e.target.value)}
          />
          {passwords[property.name] === property.password && (
            <Link href={`/kaart/${property.name.toLowerCase()}`}>
              <div className="w-full mt-2 inline-block bg-black text-center text-white p-3">Volgende</div>
            </Link>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="max-w-sm mx-auto font-spaghetiX">
      {address ? (
        <div className="p-5 pt-16 bg-yellow-500">
          <div className="fixed inset-0 bottom-auto z-20 py-2 text-center bg-yellow-500 shadow-xl">
            <pre onClick={() => disconnect()}>{address}</pre>
          </div>
          {isLoading ? (
            <p>Loading NFTs...</p>
          ) : ownedNFTs && ownedNFTs.length > 0 ? (
            <div className="flex flex-col space-y-5 gap-4">
              {renderPropertyLinks()}
            </div>
          ) : (
            <p>You do not own any NFTs from the contract.</p>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col p-5 space-y-5">
           <img className="mx-auto w-64" src="/logo.svg" />
          <ConnectWallet
            theme={"dark"}
            modalTitle={"CONNECT G"}
            modalSize={"wide"}
            welcomeScreen={{
              img: {
                src: "https://app.pastayolo.com/logo.svg",
                width: 250,
                height: 250,
              },
              title: "TINGELINGELING",
              subtitle: "CONNECT YOUR MONEY WALLET",
            }}
            modalTitleIconUrl={
              "https://app.pastayolo.com/logo.svg"
            }
          />
        </div>
      )}
    </div>
  );
};

export default Home;
