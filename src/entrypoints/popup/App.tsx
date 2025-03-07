import React, { useState } from 'react';
import './App.css';
import Header from '@/components/header';
import FeatureToggle from '@/components/feature-toggle';
import PremiumFeature from '@/components/premium-feature';
import LoginStatus from '@/components/login-status';

const App: React.FC = () => {
  const [highlightEnabled, setHighlightEnabled] = useState(false);

  return (
    <>
      <Header />

      <div className="section">
        <FeatureToggle
          label="Highlight CA's"
          checked={highlightEnabled}
          onChange={setHighlightEnabled}
          ariaLabel="Toggle Highlight Contract Addresses"
        />
      </div>

      <div className="section premium-section">
        <div className="premium-title">Unlock with Premium</div>
        <PremiumFeature label="One-click trading" />
        <PremiumFeature label="Customization" />
        <PremiumFeature label="Analytics" />
      </div>

      <button id="upgrade" className="btn-primary">
        Go Premium
      </button>

      <div className="auth-status">
        <LoginStatus />
      </div>
    </>
  );
};

export default App;
