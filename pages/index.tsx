// @ts-nocheck
import React, { useState, useEffect } from 'react';
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
  const [nftData, setNftData] = useState({});
  
  const handlePasswordChange = (propertyName, value) => {
    setPasswords({ ...passwords, [propertyName]: value });
  };

  const [localStorageChanged, setLocalStorageChanged] = useState(false);
  
  useEffect(() => {
    // Function to handle storage changes
    const handleStorageChange = () => {
      setLocalStorageChanged(prevState => !prevState); // Toggle the state to trigger re-render
    };

    // Add event listener for localStorage changes
    window.addEventListener('storage', handleStorageChange);

    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (address && nftCollection) {
      // Fetch owned NFTs
      nftCollection.getOwned(address).then((nfts) => {
        // Process NFTs to extract properties and their values
        const data = nfts.reduce((acc, nft) => {
          nft.metadata.attributes.forEach(attr => {
            acc[attr.trait_type.toLowerCase()] = attr.value;
          });
          return acc;
        }, {});
        setNftData(data);
      });
    }
  }, [address, nftCollection]);

  const hasVisitedProperty = propertyName => {
    // Check for property visited status on the client side
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`visited-${propertyName.toLowerCase()}`) === 'true';
    }
    return false;
  };

  const renderPropertyLinks = () => {
    return propertiesData.map((property) => {

      const cardUsed = typeof window !== 'undefined' ? localStorage.getItem(`card-used-${property.name.toLowerCase()}`) === 'true' : false;

      return (

      <div key={property.number} style={{ backgroundColor: property.colorCode }} className="relative flex flex-col bg-white shadow-2xl">

        <img className="absolute left-0 top-0 w-16 h-16 z-30" src="/PASTA-YOLO-10-COIN.gif" />

        {cardUsed && (
          <div className="absolute inset-0 z-30 bg-[#ff3300]/70 flex flex-col items-center justify-center pointer-events-none">
            <h3 className="text-2xl font-bold text-center text-white">Deze kaart <br /> heb je gebruikt</h3>
          </div>
        )}

        <div className="relative flex flex-col h-80">
          {(passwords[property.name] === property.password || hasVisitedProperty(property.name)) && (
            <img className="absolute inset-0 z-20 w-full h-full object-cover pointer-events-none" src={`/${property.image}`} alt={property.name} />
          )}
          <img className="absolute inset-0 w-full h-full object-cover pointer-events-none" src="/logo.svg" />
        </div>
        
        <div className="flex flex-col space-y-3 p-3 bg-white">
          {!hasVisitedProperty(property.name) ? (
            <>
              <h2 className="text-4xl">{property.description} </h2>
              <input
                className="border border-black/30 p-3 w-full text-center rounded-none shadow-sm"
                type="password"
                placeholder="Antwoord"
                onChange={(e) => handlePasswordChange(property.name, e.target.value)}
              />
              {passwords[property.name] === property.password && (
                <Link href={`/kaart/${property.name.toLowerCase()}`}>
                  <div className="w-full mt-2 inline-block bg-black text-center text-white p-3">Bekijk je {property.name}</div>
                </Link>
              )}
            </>
          ) : (
            <>
              {/* <div className="">
                <p>Je bent {property.name}</p>
                <h2 className="text-4xl">{nftData[property.name.toLowerCase()] || ''}</h2>
              </div> */}
              <Link href={`/kaart/${property.name.toLowerCase()}`}>
                <div className="w-full mt-2 inline-block bg-[#ff3300] text-center text-white p-3">Bekijk je {property.name}</div>
              </Link>
            </>
          )}
        </div>
      </div>
     );
    });
  };

  return (
    <div className="max-w-sm mx-auto">
      {address ? (
        <div className="p-5 py-16">
          <div className="fixed inset-0 top-auto z-50 py-2 text-center text-xs bg-yellow-500 shadow-xl">
            <pre onClick={() => disconnect()}>{address}</pre>
          </div>
          {isLoading ? (
            <p>TINGELINGELING...</p>
          ) : ownedNFTs && ownedNFTs.length > 0 ? (
            <div className="flex flex-col space-y-5 gap-4">
              <img className="w-full h-full object-cover" src="/logo.svg" />
              {renderPropertyLinks()}
            </div>
          ) : (
            <p>Je hebt helaas geen Tingelings</p>
          )}
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col justify-center p-5 space-y-8">
           <img className="mx-auto w-64" src="/logo.svg" />
          <ConnectWallet
            theme={"dark"}
            modalTitle={"CONNECT G"}
            modalSize={"wide"}
            welcomeScreen={{
              img: {
                src: "https://app.pastayolo.com/PASTA-YOLO-10-COIN.gif",
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
