import React from 'react';

const Header: React.FC = () => (
  <div className="header">
    <div className="logo-container">
      <img src="/icon/48.png" alt="Solhound Logo" className="logo" />
      <span className="title">Solhound</span>
    </div>
    <button className="support-btn" id="supportButton">
      <img src="/icon/support.png" alt="Support" />
    </button>
  </div>
);

export default Header;
