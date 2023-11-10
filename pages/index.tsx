// @ts-nocheck
import React, { useState } from 'react';
import Link from 'next/link';
import {
  useAddress,
  useMetamask,
  useDisconnect,
  useNFTCollection,
  useOwnedNFTs,
  ConnectWallet
} from "@thirdweb-dev/react";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();
  const nftCollection = useNFTCollection(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const { data: ownedNFTs, isLoading } = useOwnedNFTs(nftCollection, address);

  const [passwords, setPasswords] = useState({});

  const handlePasswordChange = (property, value) => {
    setPasswords({ ...passwords, [property]: value });
  };

  const renderNFTPropertiesAsCards = (nft) => {
    const properties = nft.metadata.attributes.reduce((acc, attribute) => {
      acc[attribute.trait_type] = attribute.value;
      return acc;
    }, {});

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
        {Object.entries(properties).map(([property, value], index) => (
          <div key={property} className="mb-4">
            {/* <label className="block mb-2">{property}</label> */}
            <input 
              type="password" 
              placeholder="Enter password" 
              onChange={(e) => handlePasswordChange(property, e.target.value)}
              className="w-full p-5"
            />
            {passwords[property] === 'ABC' && (
              <Link href={`/kaart/${property.toLowerCase()}`}>
                <div className="p-5 bg-black text-white">Go to {property}</div>
              </Link>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {address ? (
        <div className="p-5 pt-16 bg-yellow-500">
          <div className="fixed inset-0 bottom-auto z-20 py-1 text-center bg-yellow-500 shadow-xl">
            <pre onClick={() => disconnect()}>{address}</pre>
          </div>
          {isLoading ? (
            <p>Loading NFTs...</p>
          ) : ownedNFTs && ownedNFTs.length > 0 ? (
            <>
              {ownedNFTs.map((nft) => (
                <div key={nft.metadata.id.toString()} className="py-5 mb-8">
                  {renderNFTPropertiesAsCards(nft)}
                </div>
              ))}
            </>
          ) : (
            <p>You do not own any NFTs from the contract.</p>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col p-5 space-y-5">
          <img className="w-64" src="/logo.svg" />
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
