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

  if (!propertyValue) {
    return <div className="p-5">TINGELINGELING...</div>;
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
    <div class="fixed inset-0 top-auto z-50 p-3 text-center text-2xl font-bold bg-yellow-500 shadow-xl">
        Je bent {propertyQuery}
    </div>
      <ScratchCard colorCode={colorCode}>
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl font-bold" style={{ pointerEvents: 'none', userSelect: 'none' }}>{propertyValue}</p>
          </div>
        </div>
      </ScratchCard>
    </div>
  );
};

export default PropertyPage;