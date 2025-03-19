// src/components/trading-platform-selector.tsx
import React from "react";
import { TRADING_PLATFORM_OPTIONS, TRADING_PLATFORMS } from "@/data/const";

interface TradingPlatformSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TradingPlatformSelector: React.FC<TradingPlatformSelectorProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  return (
    <div className={`feature trading-platform-selector ${disabled ? 'disabled' : ''}`}>
      <span>Platform:</span>
      <select
        className="redirect-selector"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Select trading platform for one-click trading"
      >
        {TRADING_PLATFORM_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {TRADING_PLATFORMS[option].name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TradingPlatformSelector;