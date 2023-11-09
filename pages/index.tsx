// pages/index.js or pages/index.tsx
import React, { useState } from 'react';
import {
  useAddress,
  useMetamask,
  useDisconnect,
  useNFTCollection,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import NFTPropertyCard from '../components/NFTPropertyCard'; // adjust the path as necessary

const renderNFTPropertiesAsCards = (nft) => {
  const properties = nft.metadata.attributes.reduce((acc, attribute) => {
    acc[attribute.trait_type] = attribute.value;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
      {Object.entries(properties).map(([property, value], index) => (
        <NFTPropertyCard
          key={property}
          property={property}
          value={value}
        />
      ))}
    </div>
  );
};


const Home: NextPage = () => {
  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();
  const nftCollection = useNFTCollection("0x77853704427d7BeB860d053400098Ce404440752");
  const { data: ownedNFTs, isLoading } = useOwnedNFTs(nftCollection, address);

  return (
    <div>
      {address ? (
        <div className="p-5 bg-yellow-500">
          <div className="fixed inset-0 bottom-auto z-20 py-1 text-center bg-yellow-500 shadow-xl">
            <pre onClick={() => disconnect()}>{address}</pre>
          </div>
          {isLoading ? (
            <p>Loading NFTs...</p>
          ) : ownedNFTs && ownedNFTs.length > 0 ? (
            <>
              {/* Map over ownedNFTs and render the properties as cards */}
              {ownedNFTs && ownedNFTs.length > 0 && (
                <div>
                  {ownedNFTs.map((nft) => (
                    <div key={nft.metadata.id.toString()} className="py-5 mb-8">
                      {renderNFTPropertiesAsCards(nft)}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p>You do not own any NFTs from the contract.</p>
          )}
        </div>
      ) : (
        <div className="p-5 space-y-5">
           <img className="w-40" src="/logo.svg" />
          <button onClick={() => connect()}>Connect</button>
        </div>
      )}
    </div>
  );
};

export default Home;
