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
    <div className={`flex items-center gap-2 pl-4 mt-2 ml-4 border-l-2 border-purple-600 ${disabled ? 'opacity-50' : ''}`}>
      <span className="text-sm text-gray-300">Platform:</span>
      <select
        className={`bg-gray-700 text-white border border-gray-600 rounded p-1 text-sm outline-none focus:border-purple-500 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Select trading platform for quick trading"
      >
        {TRADING_PLATFORM_OPTIONS.map((option) => (
          <option key={option} value={option} className="bg-gray-800">
            {TRADING_PLATFORMS[option].name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TradingPlatformSelector;