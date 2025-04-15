import { baseURL } from "@/data/const";
import React, { memo, useCallback, useState } from "react";

const Header = () => {
  const [copied, setCopied] = useState(false);
  const walletAddress = "FMEcrCcaXMyuwYZU3xQKD7VgxXLq6vQq4hASbWFENeNQ";
  
  const handleLogoClick = useCallback(() => {
    window.open(baseURL, "_blank");
  }, []);

  const handleSupportClick = useCallback(() => {
    window.open(baseURL + "/#contact", "_blank");
  }, []);
  
  const handleDonateClick = useCallback(() => {
    navigator.clipboard.writeText(walletAddress)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy address:', err));
  }, []);

  return (
    <div className="flex items-center justify-between mb-2.5 px-2.5 py-1.5">
      <div 
        className="flex items-center cursor-pointer" 
        onClick={handleLogoClick}
      >
        <img src="/icon/48.png" alt="Solhound Logo" className="w-8 h-8 mr-2" />
        <span className="text-xl font-['Audiowide',sans-serif]">Solhound </span>
      </div>
      <div className="flex items-center">
        <button 
          className="bg-transparent border-none cursor-pointer p-1.5 relative group"
          onClick={handleDonateClick}
        >
          <img 
            src="/icon/donate.png" 
            alt="Support"
            className="w-5 h-5 opacity-60 transition-opacity group-hover:opacity-100" 
          />
          <span className={`absolute bottom-[-20px] left-full translate-x-[-50%] bg-black/80 text-white px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap opacity-0 invisible transition-opacity group-hover:opacity-100 group-hover:visible ${copied ? 'bg-green-700' : ''}`}>
            {copied ? 'Address copied!' : 'Donate SOL'}
          </span>
        </button>
        <button 
          className="bg-transparent border-none cursor-pointer p-1.5 relative group"
          id="supportButton" 
          onClick={handleSupportClick}
        >
          <img 
            src="/icon/support.png" 
            alt="Support"
            className="w-5 h-5 opacity-60 transition-opacity group-hover:opacity-100" 
          />
          <span className="absolute bottom-[-20px] left-full translate-x-[-50%] bg-black/80 text-white px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap opacity-0 invisible transition-opacity group-hover:opacity-100 group-hover:visible">
            Support
          </span>
        </button>
      </div>
    </div>
  );
};

Header.displayName = 'Header';

export default Header;
