// src/components/FeatureToggle.tsx
import React from "react";

interface FeatureToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const FeatureToggle: React.FC<FeatureToggleProps> = ({ 
  label, 
  checked, 
  onChange,
  disabled = false 
}) => {
  return (
    <div className={`flex justify-between items-center p-2 rounded my-1.5 bg-gray-800 ${disabled ? 'opacity-50' : ''}`}>
      <span>{label}</span>
      <label className={`relative inline-block w-10 h-6 ${disabled ? 'cursor-not-allowed' : ''}`}>
        <input
          type="checkbox"
          className="opacity-0 w-0 h-0"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          aria-label={`Toggle ${label}`}
        />
        <span 
          className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-300 ${
            checked 
              ? 'bg-green-400 before:translate-x-4' 
              : 'bg-gray-400'
          } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        ></span>
      </label>
    </div>
  );
};

export default FeatureToggle;
