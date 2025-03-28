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
});

Header.displayName = 'Header';

export default Header;
