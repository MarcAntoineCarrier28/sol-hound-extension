import React, { ReactNode } from 'react';

interface PremiumFeatureProps {
  label: string;
  toggleKey?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  children?: ReactNode;
  locked?: boolean;
  isPremium: boolean;
}

const PremiumFeature: React.FC<PremiumFeatureProps> = ({ 
  label, 
  toggleKey,
  checked = false, 
  onChange,
  children,
  locked = false,
  isPremium
}) => {
  // Feature is locked if user doesn't have premium OR if it's explicitly locked
  const isLocked = !isPremium || locked;
  
  // If this is a toggle feature
  const isToggle = typeof onChange === 'function';

  // Handle toggle change, but only if user has premium and feature isn't locked
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLocked && onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={`flex justify-between items-center p-2 rounded my-1.5 bg-gray-700 ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        {isLocked && <span className="text-sm opacity-70">🔒</span>}
      </div>
      
      {isToggle ? (
        <label className="relative inline-block w-10 h-6">
          <input 
            type="checkbox"
            className="opacity-0 w-0 h-0" 
            disabled={isLocked}
            checked={checked}
            onChange={handleToggleChange}
            aria-label={label} 
          />
          <span 
            className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-300 ${
              checked 
                ? 'bg-green-400 before:translate-x-4' 
                : 'bg-gray-400'
            } ${isLocked ? 'cursor-not-allowed' : ''}`}
          ></span>
        </label>
      ) : (
        <div className="text-xs bg-purple-700 text-white px-1.5 py-0.5 rounded">PRO</div>
      )}

      {/* Render children if provided and not locked (for sub-options) */}
      {children && !isLocked && checked && (
        <div className="mt-2 ml-4 pl-2 border-l-2 border-purple-500">
          {children}
        </div>
      )}
    </div>
  );
};

export default PremiumFeature;