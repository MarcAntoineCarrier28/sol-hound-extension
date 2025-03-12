// src/components/trading-platform-selector.tsx
import React from "react";
import { TradingPlatformOption } from "@/utils/feature-storage";
import { tradingPlatform1, tradingPlatform2, tradingPlatform3, tradingPlatform4 } from "@/data/const";

interface TradingPlatformSelectorProps {
  value: TradingPlatformOption;
  onChange: (value: TradingPlatformOption) => void;
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
        onChange={(e) => onChange(e.target.value as TradingPlatformOption)}
        disabled={disabled}
        aria-label="Select trading platform for one-click trading"
      >
        <option value={tradingPlatform1}>{tradingPlatform1}</option>
        <option value={tradingPlatform2}>{tradingPlatform2}</option>
        <option value={tradingPlatform3}>{tradingPlatform3}</option>
        <option value={tradingPlatform4}>{tradingPlatform4}</option>
      </select>
    </div>
  );
};

export default TradingPlatformSelector;