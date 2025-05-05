import React, { useState } from 'react';
import './Whatsapp.css';
import { Gift, MessageCircleX } from 'lucide-react';

const Whatsapp: React.FC = () => {
  const [isChatbotVisible, setIsChatbotVisible] = useState<boolean>(false);

  const messages = {
    type: 'incoming',
    text: 'Hi there 👋\nWelcome to Gaana Nritya!',
  };

  const handleToggleChatbot = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  return (
    <div className={`app ${isChatbotVisible ? 'show-chatbot' : ''}`}>
      <button
        className="chatbot-toggler transition-all duration-200 hover:scale-105"
        onClick={handleToggleChatbot}
      >
        {isChatbotVisible ? (
          <span>
            <MessageCircleX className="h-10 w-10 text-[#25D366]" />
          </span>
        ) : (
          <img src="/whatsapp.svg" alt="whatsapp" />
        )}
      </button>
      <div className="chatbot z-10 m-[65px] h-[300px] w-[280px] rounded-lg md:m-0 md:h-[350px] md:w-[400px] md:rounded-[12px]">
        <header className="bg-[#25D366] text-[#FBFFFE]">
          <h2 className="text-base font-bold md:font-medium">
            Connect with us!
          </h2>
        </header>
        <ul className="chatbox">
          <li className={`chat ${messages.type}`}>
            {messages.type === 'incoming' && (
              <span className="material-symbols-outlined">
                <Gift className="text-[#25D366]" />
              </span>
            )}
            <p className="text-base lg:font-normal">{messages.text}</p>
          </li>
        </ul>
        <div className="chat-input">
          <a
            rel="noreferrer"
            className="flex w-full items-center justify-center bg-[#25D366] px-6 py-2 text-lg font-normal text-white md:text-xl lg:h-[48px]"
            href="https://wa.me/+919900485461?text=Hello%20Gaana%20Nritya%2C%20I%20want%20to%20enquire%20about%20your%20classes,%20workshops%20and%20performances."
            target="_blank"
          >
            <button className="h-10 text-base">Click Here For Enquiry</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Whatsapp;
