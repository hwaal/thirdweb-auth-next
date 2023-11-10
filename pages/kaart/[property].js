// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAddress, useNFTCollection } from '@thirdweb-dev/react';
import Link from 'next/link'; // Import Link from Next.js
import ScratchCard from '../../components/ScratchCard'; // Ensure this path is correct

const PropertyPage = () => {
  const router = useRouter();
  const propertyQuery = router.query.property;
  const address = useAddress();
  const nftCollection = useNFTCollection(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const [propertyValue, setPropertyValue] = useState('');

  useEffect(() => {
    if (address && propertyQuery && nftCollection) {
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
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <ScratchCard>
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