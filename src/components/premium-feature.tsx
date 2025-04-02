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
    <div className={`feature ${isLocked ? 'locked' : ''}`}>
      <div className="feature-text">
        <span>{label}</span>
      </div>
      
      {isToggle ? (
        <label className="switch">
          <input 
            type="checkbox" 
            disabled={isLocked}
            checked={checked}
            onChange={handleToggleChange}
            aria-label={label} 
          />
          <span className="slider round"></span>
        </label>
      ) : (
        <div className="premium-feature-indicator">PRO</div>
      )}

      {/* Render children if provided and not locked (for sub-options) */}
      {children && !isLocked && checked && (
        <div className="premium-feature-children">
          {children}
        </div>
      )}
    </div>
  );
};

export default PremiumFeature;