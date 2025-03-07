import React from 'react';

interface FeatureToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const FeatureToggle: React.FC<FeatureToggleProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  ariaLabel,
}) => (
  <div className="feature">
    <span>{label}</span>
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel || label}
      />
      <span className="slider round"></span>
    </label>
  </div>
);

export default FeatureToggle;
