// src/components/wallet-redirect-selector.tsx
import React from "react";
import { WALLET_EXPLORER_OPTIONS, WALLET_EXPLORERS } from "@/data/const";

interface WalletRedirectSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const WalletRedirectSelector: React.FC<WalletRedirectSelectorProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  return (
    <div className="feature">
      <span>Wallet Click Action</span>
      <select
        className="redirect-selector"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Select where to redirect when clicking a wallet address"
      >
        {WALLET_EXPLORER_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {WALLET_EXPLORERS[option].name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WalletRedirectSelector;