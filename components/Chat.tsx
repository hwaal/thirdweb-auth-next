import React, { useState, useEffect } from 'react';
import { usePartyKit } from 'partykit-client';
import { useNFT } from '@thirdweb-dev/react';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { data: nft } = useNFT("0xYourContractAddress", "tokenId"); // Replace with your contract address and token ID

  const gekkie = nft?.metadata.attributes.find(attr => attr.trait_type === 'Gekkie')?.value || 'Anonymous';
  const chat = usePartyKit('<SERVER_URL>', { username: gekkie }); // Pass the Gekkie property as the username

  useEffect(() => {
    // Listen for new messages
    chat.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [chat]);

  const sendMessage = () => {
    if (input) {
      // Send the message along with the Gekkie property as the username
      chat.emit('message', { text: input, username: gekkie });
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <ul className="message-list">
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.username}: </strong>{message.text}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
