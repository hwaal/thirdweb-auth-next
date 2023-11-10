// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAddress, useNFTCollection } from '@thirdweb-dev/react';
import Link from 'next/link'; // Import Link from Next.js
import ScratchCard from '../../components/ScratchCard'; // Ensure this path is correct
import propertiesData from '../../public/properties.json'; // Adjust the path as necessary

const PropertyPage = () => {
  const router = useRouter();
  const propertyQuery = router.query.property;
  const address = useAddress();
  const nftCollection = useNFTCollection(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const [propertyValue, setPropertyValue] = useState('');

  const { property } = router.query;
  const propertyData = propertiesData.find(p => p.name.toLowerCase() === property?.toLowerCase());
  const colorCode = propertyData?.colorCode || '#defaultHexColor'; // Default color if not found


  useEffect(() => {
    if (typeof window !== 'undefined' && address && propertyQuery && nftCollection) {

        localStorage.setItem(`visited-${propertyQuery.toLowerCase()}`, 'true');
        console.log(`Set visited-${propertyQuery.toLowerCase()} in localStorage`);

      nftCollection.getOwned(address).then((nfts) => {
        const nftWithProperty = nfts.find(nft => nft.metadata.attributes.some(attr => attr.trait_type.toLowerCase() === propertyQuery.toLowerCase()));
        if (nftWithProperty) {
          const attr = nftWithProperty.metadata.attributes.find(attr => attr.trait_type.toLowerCase() === propertyQuery.toLowerCase());
          setPropertyValue(attr ? attr.value : 'Not available');
        }
      });
    }
  }, [address, propertyQuery, nftCollection]);

  const [cardUsed, setCardUsed] = useState(typeof window !== 'undefined' ? localStorage.getItem(`card-used-${propertyQuery.toLowerCase()}`) === 'true' : false);

  const handleUseCard = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`card-used-${propertyQuery.toLowerCase()}`, 'true');
      setCardUsed(true);
    }
  };

  if (!propertyValue) {
    return <div className="p-5">TINGELINGELING...</div>;
  }

  return (
    <div className="h-screen w-screen overflow-hidden">

        {cardUsed ? (
      <div className="fixed top-5 right-5 z-30 p-3 bg-[#ff3300] text-white shadow-md cursor-crosshair">Deze kaart heb je gebruikt</div>
    ) : (
      <div onClick={handleUseCard} className="fixed top-5 right-5 z-30 p-3 flex items-center space-x-3  bg-black text-white shadow-md hover:bg-black hover:text-white cursor-pointer">
        <img className="w-8 h-8 z-30" src="/PASTA-YOLO-10-COIN.gif" />
        <span>Gebruik je <strong>{propertyQuery}</strong> kaart</span>
    </div>
    )}
        
        <Link href="/">
            <div className="fixed top-5 left-5 z-30 p-3 bg-yellow-500 shadow-md hover:bg-black hover:text-white">Terug</div>
        </Link>
        <div class="fixed inset-0 top-auto z-50 pb-5 pointer-events-none select-none text-center text-7xl font-spagheti font-bold bg-yellow-500X shadow-xl capitalize">
            {propertyQuery}
        </div>
      <ScratchCard colorCode={colorCode}>
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl font-bold" style={{ pointerEvents: 'none', userSelect: 'none' }}>{propertyValue}</p>
          </div>
        </div>
      </ScratchCard>
      <img className="fixed inset-0 w-full h-full object-cover pointer-events-none" src="/logo.svg" />
    </div>
  );
};

export default PropertyPage;