import React, { useEffect, useRef } from 'react';
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
import { storage } from '#imports';
import { baseURL } from '@/data/const';

const App: React.FC = () => {
  const { 
    toggles, 
    updateToggle, 
    updateTokenRedirectPreference, 
    updateWalletRedirectPreference, 
    updateTradingPlatformPreference,
    resetPremiumFeatureToggles
  } = useFeatureToggles();
  
  const { authStatus, loading } = useAuthStatus();
  const hasPremium = !!authStatus.subscription;
  const previousPremiumStatus = useRef<boolean>(hasPremium);
  
  // Check if token redirect should be disabled (when trading is enabled for premium users)
  const isTokenRedirectDisabled = toggles.highlightCAs ? (hasPremium && toggles.enableTrading) : true;

  useEffect(() => {
    const watchAuthStatus = async () => {
      try {
        storage.watch("local:authStatus", async (newValue) => {
          if (newValue && typeof newValue === 'object') {
            const newAuthStatus = newValue as any;
            const newHasPremium = !!newAuthStatus.subscription;
            
            // Check if premium status changed from true to false
            if (previousPremiumStatus.current && !newHasPremium) {
              console.log('Premium status changed to non-premium, resetting premium features');
              await resetPremiumFeatureToggles();
            }
            
            // Update the premium status ref
            previousPremiumStatus.current = newHasPremium;
          }
        });
      } catch (error) {
        console.error('Error setting up auth status watcher:', error);
      }
    };
    
    watchAuthStatus();
    
    if (previousPremiumStatus.current && !hasPremium) {
      console.log('Premium status lost, resetting premium features');
      resetPremiumFeatureToggles();
    }
    
    // Update ref with current status
    previousPremiumStatus.current = hasPremium;
  }, [hasPremium, resetPremiumFeatureToggles]);

  return (
    <>
      <Header isPro={hasPremium}/>

      <div className="section">
        <FeatureToggle
          label="Highlight CA's"
          checked={toggles.highlightCAs}
          onChange={(value) => updateToggle("highlightCAs", value)}
        />
        
        {/* Only show redirect selectors if highlighting is enabled */}
        {toggles.highlightCAs && (
          <div className="redirect-settings">
            {/* Always show token redirect selector, but disable it when appropriate */}
            <TokenRedirectSelector
              value={toggles.tokenRedirectPreference}
              onChange={(value) => updateTokenRedirectPreference(value)}
              disabled={isTokenRedirectDisabled}
            />
            
            {/* Always show wallet redirect selector since trading only affects tokens */}
            <WalletRedirectSelector
              value={toggles.walletRedirectPreference}
              onChange={(value) => updateWalletRedirectPreference(value)}
              disabled={!toggles.highlightCAs}
            />
          </div>
        )}
      </div>

      {/* Premium features section with purple border */}
      <div className="section premium-section">
        <div className="premium-title">
          <span className="premium-feature-indicator">PRO Features</span>
        </div>
        
        {/* Use the optimized PremiumFeature component with isPremium prop */}
        <PremiumFeature 
          label="One-click trading" 
          checked={toggles.enableTrading}
          onChange={(value) => toggles.highlightCAs ? updateToggle("enableTrading", value) : null}
          toggleKey="enableTrading"
          locked={!toggles.highlightCAs}
          isPremium={hasPremium}
        />
        
        {/* Trading platform selector - conditionally rendered and styled as a submenu */}
        {hasPremium && toggles.enableTrading && toggles.highlightCAs && (
          <TradingPlatformSelector
            value={toggles.tradingPlatformPreference}
            onChange={(value) => updateTradingPlatformPreference(value)}
            disabled={!toggles.enableTrading || !toggles.highlightCAs}
          />
        )}
        
        {/* Show upgrade button for non-premium users */}
        {!hasPremium && (
          <button 
            className="upgrade-pro-button"
            onClick={() => window.open(baseURL + '/#pricing', '_blank')}
          >
            Upgrade to get access
          </button>
        )}
      </div>

      {/* Auth status/login section */}
      <div className="auth-status">
        {loading ? (
          <div>Loading...</div>
        ) : !authStatus.session ? (
          <button 
            className="login-button"
            onClick={() => window.open(baseURL + '/sign-in', '_blank')}
          >
            Login
          </button>
        ) : (
          <LoginStatus authStatus={authStatus} loading={loading} />
        )}
      </div>
    </>
  );
};

export default App;