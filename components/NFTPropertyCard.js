import React, { useState } from 'react';

const NFTPropertyCard = ({ property, value, bgColor }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const cardStyle = `flip-card ${isFlipped ? 'flipped' : ''} inline-block`;

  return (
    <div className={cardStyle} onClick={toggleFlip}>
      <div className="flip-card-inner bg-white" style={{ width: '256px', height: '384px' }}>
        <div className="flip-card-front flex flex-col space-y-5">
          {/* Content for the front of the card */}
          <img className="w-20" src="/logo.svg" />
          <p className="font-bold text-lg">{property}</p>
        </div>
        <div 
          className={`flip-card-back bg-gray-200`}
        >
          {/* Content for the back of the card */}
          <p className="text-lg">{value || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default NFTPropertyCard;
