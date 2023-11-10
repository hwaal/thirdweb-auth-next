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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePasswordChange = (propertyName, value) => {
    setPasswords({ ...passwords, [propertyName]: value });
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

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
        <>
         <div className="fixed left-3 bottom-12 z-40 p-3 w-8 h-8 flex items-center bg-pink-400 cursor-pointer" onClick={openModal}>
          <h2>?</h2>
         </div>

         {isModalVisible && (
           <div id="modal" className="fixed inset-0 z-[60] bg-orange-400 overflow-y-scroll">
             <div className="absolute top-5 right-5 bg-red-500 p-3 cursor-pointer" onClick={closeModal}>Sluiten</div>
             <div className="p-10 pb-20 space-y-2">
               <h2 className="text-2xl">Spelregels</h2>
               <h3 className="text-xl">Lees deze goed door!!1!</h3>
               <ul className="list-disc space-y-2">
               <li>Je kunt 6 PASTA YOLO kaarten verdienen door de juiste antwoorden te geven</li>
               <li>De belangrijkste kaart is je spirit animal, je gekkie. Bedoeling dat deze nooit iemand te weten komt. Je kunt iemand verslaan door jouw uitspraak te doen. Ben je bijvoorbeel onze oude vriend Rob Geus, en je laat iemand kukaratsja vinden in de kitchen, then you know, he died. Let dus op je woorden. Man man man.</li>
               <li>Een kaart kan eenmalig gebruikt worden om mee aan te vallen of te verdedigen. Daarna maak je m inactief</li>
               <li>Er zijn van het type kaart "Kleur" en "Leiding" hiermee kan een verbond gesmeden worden. Let op dat je niet je kleur aan de verkeerde kleur laat zien, dan ben je je kaart kwijt! Als verbond kun je ...</li>
               <li>De rangen lopen van Maarschalk, Generaal, Kolonel, Majoor, Kapitein, Luitenant, Sergeant, Mineur, Verkenner, Spion, Bom. De bom mag uiteraard niet tikken. De mineur verslaat als enige de bom. De spion verslaat de Maarschalk.</li>
               <li>Ben je meneer de HOF? Dan haal je altijd het eerste rondje in de kroeg, want ze doet toch niet mee met de leiding</li>
               <li>Schotland een hele grote kans dat jij deze week nog een avond in een rok staat... </li>
               <li>Duitsland, bied jij de heren van het organiseren comite een lekkere pitcher aan</li>
               </ul>
             </div>
           </div>
         )}

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
        </>
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
