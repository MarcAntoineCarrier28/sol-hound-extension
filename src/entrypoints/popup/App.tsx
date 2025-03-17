import React from 'react';
import './App.css';
import Header from '@/components/header';
import FeatureToggle from '@/components/feature-toggle';
import PremiumFeature from '@/components/premium-feature';
import TokenRedirectSelector from '@/components/token-redirect-selector';
import WalletRedirectSelector from '@/components/wallet-redirect-selector';
import TradingPlatformSelector from '@/components/trading-platform-selector';
import LoginStatus from '@/components/login-status';
import { useFeatureToggles } from '@/hooks/useFeatureToggles';
import { useAuthStatus } from '@/hooks/useAuthStatus';

const App: React.FC = () => {
  const { 
    toggles, 
    updateToggle, 
    updateTokenRedirectPreference, 
    updateWalletRedirectPreference, 
    updateTradingPlatformPreference 
  } = useFeatureToggles();
  
  const { authStatus } = useAuthStatus();
  const hasPremium = !!authStatus.subscription;

  return (
    <>
      <Header 
      isPro = {hasPremium} />

      <div className="section">
        <FeatureToggle
          label="Highlight CA's"
          checked={toggles.highlightCAs}
          onChange={(value) => updateToggle("highlightCAs", value)}
        />
        
        {/* Only show redirect selectors if highlighting is enabled */}
        {toggles.highlightCAs && (
          <div className="redirect-settings">
            {/* Show token redirect selector if user doesn't have premium OR trading is disabled */}
            {(!hasPremium || !toggles.enableTrading) && (
              <TokenRedirectSelector
                value={toggles.tokenRedirectPreference}
                onChange={(value) => updateTokenRedirectPreference(value)}
                disabled={!toggles.highlightCAs}
              />
            )}
            
            {/* Always show wallet redirect selector since trading only affects tokens */}
            <WalletRedirectSelector
              value={toggles.walletRedirectPreference}
              onChange={(value) => updateWalletRedirectPreference(value)}
              disabled={!toggles.highlightCAs}
            />
          </div>
        )}
      </div>

      <div className="section premium-section">
        <div className="premium-title">
            <span className="premium-feature-indicator" style={{ fontSize: '14px' }}>PRO Features</span>
          </div>
        
        {/* One-click trading toggle - disabled if Highlight CA's is off */}
        <PremiumFeature 
          label="One-click trading" 
          checked={toggles.enableTrading}
          onChange={(value) => toggles.highlightCAs ? updateToggle("enableTrading", value) : null}
          toggleKey="enableTrading"
          locked={!toggles.highlightCAs}
        />
        
        {/* Trading platform selector - conditionally rendered and styled as a submenu */}
        {hasPremium && (
          <TradingPlatformSelector
            value={toggles.tradingPlatformPreference}
            onChange={(value) => updateTradingPlatformPreference(value)}
            disabled={!toggles.enableTrading || !toggles.highlightCAs}
          />
        )}
        
        {/* Other premium features - also disabled if Highlight CA's is off */}
{/*         <PremiumFeature 
          label="Customization" 
          locked={!toggles.highlightCAs}
        />
        <PremiumFeature 
          label="Analytics" 
          locked={!toggles.highlightCAs}
        /> */}
      </div>

      <div className="auth-status">
        <LoginStatus />
      </div>
    </>
  );
};

export default App;