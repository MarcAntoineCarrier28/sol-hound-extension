// src/components/token-redirect-selector.tsx
import React from "react";
import { TOKEN_EXPLORER_OPTIONS, TOKEN_EXPLORERS } from "@/data/const";

interface TokenRedirectSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TokenRedirectSelector: React.FC<TokenRedirectSelectorProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  return (
    <div className={`flex justify-between items-center p-2 rounded my-1.5 bg-gray-800 ${disabled ? 'opacity-50' : ''}`}>
      <span className={disabled ? 'text-gray-400' : ''}>
        Token Click Action
      </span>
      <select
        className={`bg-gray-700 text-white border border-gray-600 rounded p-1 text-sm outline-none focus:border-purple-500 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Select where to redirect when clicking a token address"
        style={{ maxHeight: '200px', overflow: 'auto' }}
      >
        {TOKEN_EXPLORER_OPTIONS.map((option) => (
          <option key={option} value={option} className="bg-gray-800">
            {TOKEN_EXPLORERS[option].name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TokenRedirectSelector;