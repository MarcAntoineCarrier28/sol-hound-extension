import React, { useState } from 'react';
import './App.css';
import Header from '@/components/header';
import FeatureToggle from '@/components/feature-toggle';
import PremiumFeature from '@/components/premium-feature';
import LoginStatus from '@/components/login-status';
import { useFeatureToggles } from '@/hooks/useFeatureToggles';

const App: React.FC = () => {
  const { toggles, updateToggle } = useFeatureToggles();

  return (
    <>
      <Header />

      <div className="section">
        <FeatureToggle
          label="Highlight CA's"
          checked={toggles.highlightCAs}
          onChange={(value) => updateToggle("highlightCAs", value)}
        />
      </div>

      <div className="section premium-section">
        <div className="premium-title">Unlock with Premium</div>
        <PremiumFeature label="One-click trading" />
        <PremiumFeature label="Customization" />
        <PremiumFeature label="Analytics" />
      </div>

      <div className="auth-status">
        <LoginStatus />
      </div>
    </>
  );
};

export default App;
