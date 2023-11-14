// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  useAddress,
  useMetamask,
  useNFTCollection,
  ConnectWallet
} from "@thirdweb-dev/react";

const AdminPage = () => {
  const address = useAddress();
  const connect = useMetamask();
  const nftCollection = useNFTCollection(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const [properties, setProperties] = useState({ Rang: [], Gekkie: [], Land: [], Kleur: [], Tentje: [], Leiding: [] });

  // Function to shuffle array elements
  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  useEffect(() => {
    if (
      (address === "0x6e5c93251567B9DBc38b45F5E115805049066759" ||
      address === "0x22e7cc09875b8d6A96F420F3fD83755571f736aC" ||
      address === "0x9a852849E7869FA7706471E0DcDb517178123440") && 
      nftCollection
    ) {
      nftCollection.getAll().then((allNfts) => {
        // Filter out NFTs that are not minted
        const mintedNfts = allNfts.filter(nft => nft.owner !== "0x0000000000000000000000000000000000000000");

        // Initialize a new object to hold grouped properties
        let groupedProperties = { Rang: [], Gekkie: [], Land: [], Kleur: [], Tentje: [], Leiding: [] };

        // Group properties
        mintedNfts.forEach(nft => {
          nft.metadata.attributes.forEach(attr => {
            if (groupedProperties[attr.trait_type]) {
              groupedProperties[attr.trait_type].push(attr.value);
            }
          });
        });

        // Shuffle each property's values
        Object.keys(groupedProperties).forEach(key => {
          groupedProperties[key] = shuffleArray(groupedProperties[key]);
        });

        setProperties(groupedProperties);
      });
    }
  }, [address, nftCollection]);

  // Check if the connected address is one of the allowed addresses
  const isAllowedAddress = (
    address === "0x6e5c93251567B9DBc38b45F5E115805049066759" ||
    address === "0x22e7cc09875b8d6A96F420F3fD83755571f736aC" ||
    address === "0x9a852849E7869FA7706471E0DcDb517178123440"
  );

  if (!isAllowedAddress) {
    return (
      <div>
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
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {Object.entries(properties).map(([key, values]) => (
        <div key={key} className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold text-lg">{key}</h3>
          <ul>
            {values.map((value, index) => (
              <li key={index} className="text-sm">{value}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
