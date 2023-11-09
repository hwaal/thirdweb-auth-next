// pages/all.js
import React, { useState, useEffect } from 'react';
import { useContract } from '@thirdweb-dev/react';

const AllNftsPage = () => {
  // Use the contract address provided
  const contractAddress = '0x77853704427d7BeB860d053400098Ce404440752';
  // This hook is used to get a contract instance from thirdweb
  const { contract } = useContract(contractAddress);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (!contract) {
      console.log('Contract not found');
      return;
    }

    const fetchNFTs = async () => {
      try {
        // Assuming this contract is an ERC-721, you can call the getAll function
        const nftsData = await contract.getAll();
        console.log('NFTs fetched:', nftsData);
        setNfts(nftsData);
      } catch (error) {
        console.error('Failed to fetch NFTs:', error);
      }
    };

    fetchNFTs();
  }, [contract]);

  if (!nfts.length) {
    return <div>Loading or no NFTs found...</div>;
  }

  return (
    <div>
      <h1>All NFTs</h1>
      {/* Render the NFTs */}
      {nfts.map((nft, index) => {
        // Render each NFT and its properties
        return (
          <div key={index}>
            <h2>{nft.metadata.name}</h2>
            {/* Assuming the properties are an array of objects with name and value */}
            {nft.metadata.properties.map((property, propIndex) => (
              <div key={propIndex}>
                <strong>{property.name}</strong>: {property.value}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default AllNftsPage;
