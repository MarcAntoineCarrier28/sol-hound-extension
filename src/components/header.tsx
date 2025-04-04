import { baseURL } from "@/data/const";
import React, { memo, useCallback } from "react";

interface HeaderProps {
  isPro: boolean;
}

const Header: React.FC<HeaderProps> = memo(({ 
  isPro,
}) => {
  const handleLogoClick = useCallback(() => {
    window.open(baseURL, "_blank");
  }, []);

  const handleSupportClick = useCallback(() => {
    window.open(baseURL + "/#contact", "_blank");
  }, []);

  return (
    <div className="flex items-center justify-between mb-2.5 px-2.5 py-1.5">
      <div 
        className="flex items-center cursor-pointer" 
        onClick={handleLogoClick}
      >
        <img src="/icon/48.png" alt="Solhound Logo" className="w-8 h-8 mr-2" />
        <span className="text-xl font-['Audiowide',sans-serif]">Solhound </span>
        {isPro && (
          <span className="text-xs ml-1 bg-purple-700 text-white px-1.5 py-0.5 rounded font-semibold">PRO</span>
        )}
      </div>
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
        <span className="absolute bottom-[-10px] left-full translate-x-[-50%] bg-black/80 text-white px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap opacity-0 invisible transition-opacity group-hover:opacity-100 group-hover:visible">
          Support
        </span>
      </button>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;
