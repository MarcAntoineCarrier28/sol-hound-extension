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
    <div className="feature">
      <span>Token Redirect</span>
      <select
        className="redirect-selector"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Select where to redirect when clicking a token address"
      >
        {TOKEN_EXPLORER_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {TOKEN_EXPLORERS[option].name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TokenRedirectSelector;