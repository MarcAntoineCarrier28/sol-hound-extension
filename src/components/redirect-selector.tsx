import React from "react";
import { RedirectOption } from "@/utils/feature-storage";
import { explorer1, explorer2, explorer3, explorer4 } from "@/data/const";

interface RedirectSelectorProps {
  value: RedirectOption;
  onChange: (value: RedirectOption) => void;
  disabled?: boolean;
}

const RedirectSelector: React.FC<RedirectSelectorProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  return (
    <div className="feature">
      <span>Address Redirect</span>
      <select
        className="redirect-selector"
        value={value}
        onChange={(e) => onChange(e.target.value as RedirectOption)}
        disabled={disabled}
        aria-label="Select where to redirect when clicking a contract address"
      >
        <option value={explorer1}>{explorer1}</option>
        <option value={explorer2}>{explorer2}</option>
        <option value={explorer3}>{explorer3}</option>
        <option value={explorer4}>{explorer4}</option>
      </select>
    </div>
  );
};

export default RedirectSelector;