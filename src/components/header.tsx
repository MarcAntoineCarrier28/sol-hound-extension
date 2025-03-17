import { baseURL } from "@/data/const";
import React from "react";

interface HeaderProps {
  isPro: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  isPro,
}) => {
  const handleLogoClick = () => {
    window.open(baseURL, "_blank");
  };

  const handleSupportClick = () => {
    window.open(baseURL + "/#contact", "_blank");
  };

  return (
    <div className="header">
      <div className="logo-container" onClick={handleLogoClick}>
        <img src="/icon/48.png" alt="Solhound Logo" className="logo" />
        <span className="title">Solhound </span>
        {isPro && <span className="pro-indicator">PRO</span>}
      </div>
      <button className="support-btn" id="supportButton" onClick={handleSupportClick}>
        <img src="/icon/support.png" alt="Support" />
      </button>
    </div>
  );
};

export default Header;
