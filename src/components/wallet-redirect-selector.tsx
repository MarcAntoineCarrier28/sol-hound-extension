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
    <div className={`flex justify-between items-center p-2 rounded my-1.5 bg-gray-800 ${disabled ? 'opacity-50' : ''}`}>
      <span className={disabled ? 'text-gray-400' : ''}>
        Wallet Click Action
      </span>
      <select
        className={`bg-gray-700 text-white border border-gray-600 rounded p-1 text-sm outline-none focus:border-purple-500 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Select where to redirect when clicking a wallet address"
      >
        {WALLET_EXPLORER_OPTIONS.map((option) => (
          <option key={option} value={option} className="bg-gray-800">
            {WALLET_EXPLORERS[option].name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WalletRedirectSelector;