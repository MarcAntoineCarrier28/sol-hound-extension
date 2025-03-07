import React from 'react';

interface PremiumFeatureProps {
  label: string;
  locked?: boolean;
}

const PremiumFeature: React.FC<PremiumFeatureProps> = ({ label, locked = true }) => (
  <div className={`feature ${locked ? 'locked' : ''}`}>
    <div className="feature-text">
      {locked && <span className="lock-icon">🔒</span>}
      <span>{label}</span>
    </div>
    <label className="switch">
      <input type="checkbox" disabled={locked} aria-label={label} />
      <span className="slider round"></span>
    </label>
  </div>
);

export default PremiumFeature;
