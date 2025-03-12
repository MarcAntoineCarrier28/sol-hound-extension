// src/components/FeatureToggle.tsx
import React from "react";

interface FeatureToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const FeatureToggle: React.FC<FeatureToggleProps> = ({ label, checked, onChange }) => {
  return (
    <div className="feature">
      <span>{label}</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={`Toggle ${label}`}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default FeatureToggle;
