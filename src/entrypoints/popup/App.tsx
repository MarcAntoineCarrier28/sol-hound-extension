import React, { useEffect, useRef } from 'react';
import Header from '@/components/header';
import FeatureToggle from '@/components/feature-toggle';
import PremiumFeature from '@/components/premium-feature';
import TokenRedirectSelector from '@/components/token-redirect-selector';
import WalletRedirectSelector from '@/components/wallet-redirect-selector';
import TradingPlatformSelector from '@/components/trading-platform-selector';
import HighlightStyleCustomizer from '@/components/highlight-style-customizer';
import LoginStatus from '@/components/login-status';
import ReferralLinks from '@/components/referral-links';
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
    updateHighlightStyles,
    resetPremiumFeatureToggles
  } = useFeatureToggles();

  const { authStatus, loading } = useAuthStatus();
  const isLoggedIn = !!authStatus.session;
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

  // Show loading state
  if (loading) {
    return (
      <div className="w-full min-h-[300px] flex flex-col bg-gray-900 text-white">
        <Header isPro={hasPremium} />
        <div className="flex items-center justify-center flex-1 min-h-[150px]">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="w-full min-h-[300px] flex flex-col bg-gray-900 text-white">
        <Header isPro={false} />

        <div className="flex flex-col items-center justify-center text-center p-6 flex-1">
          <h2 className="text-xl mb-2 text-white">Login to use SolHound</h2>

          <div className="flex gap-3 mt-2">
            <button
              className="w-36 bg-purple-700 text-white border-none rounded py-2.5 px-5 font-medium cursor-pointer transition-colors hover:bg-purple-600"
              onClick={() => window.open(baseURL + '/sign-in', '_blank')}
            >
              Login
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Don't have an account?{" "}
            <a
              className="text-purple-400 hover:text-purple-300 cursor-pointer"
              onClick={() => window.open(baseURL + '/sign-up', '_blank')}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-sans text-center bg-gray-900 text-white rounded-lg">
      <Header isPro={hasPremium} />

      <div className="mb-2 pb-2">
        <FeatureToggle
          label="Highlight CA's"
          checked={toggles.highlightCAs}
          onChange={(value) => updateToggle("highlightCAs", value)}
        />
        
        {/* Only show redirect selectors if highlighting is enabled */}
        {toggles.highlightCAs && (
          <div className="mt-2">
            {/* Copy on Click feature */}
            <FeatureToggle
              label="Copy addresses on click"
              checked={toggles.enableCopyOnClick}
              onChange={(value) => {
                // If enabling copy-on-click and trading is enabled, turn off trading
                if (value && toggles.enableTrading) {
                  // If enabling copy-on-click, disable trading first
                  updateToggle("enableTrading", false);
                }
                // Then update copy-on-click toggle
                updateToggle("enableCopyOnClick", value);
              }}
              disabled={!toggles.highlightCAs}
            />
            
            {/* Only show token/wallet redirect options if copy on click is disabled */}
            {!toggles.enableCopyOnClick && (
              <>
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
              </>
            )}
          </div>
        )}
        <ReferralLinks />
      </div>

      {/* Premium features section with purple border */}
      <div className="relative mt-6 border border-purple-600 rounded-lg p-4 pb-2">
        <div className="absolute -top-3 left-1/2 border border-purple-600 -translate-x-1/2 bg-gray-900 px-2.5 py-0.5 rounded z-10">
          <span className="text-purple-400 text-xs font-semibold">PRO Features</span>
        </div>

        {/* Use the optimized PremiumFeature component with isPremium prop */}
        <PremiumFeature
          label="One-click trading"
          checked={toggles.enableTrading && !toggles.enableCopyOnClick}
          onChange={(value) => {
            if (value && toggles.enableCopyOnClick) {
              // If enabling trading, disable copy-on-click first
              updateToggle("enableCopyOnClick", false);
            }
            // Then update trading toggle
            if (toggles.highlightCAs) {
              updateToggle("enableTrading", value);
            }
          }}
          toggleKey="enableTrading"
          locked={!toggles.highlightCAs || toggles.enableCopyOnClick}
          isPremium={hasPremium}
        />
        
        {/* Trading platform selector - conditionally rendered and styled as a submenu */}
        {hasPremium && toggles.enableTrading && !toggles.enableCopyOnClick && toggles.highlightCAs && (
          <TradingPlatformSelector
            value={toggles.tradingPlatformPreference}
            onChange={(value) => updateTradingPlatformPreference(value)}
            disabled={!toggles.enableTrading || toggles.enableCopyOnClick || !toggles.highlightCAs}
          />
        )}

        {/* Highlighting style customization */}
        <PremiumFeature
          label="Custom highlight styles"
          checked={toggles.enableCustomization}
          onChange={(value) => toggles.highlightCAs ? updateToggle("enableCustomization", value) : null}
          toggleKey="enableCustomization"
          locked={!toggles.highlightCAs}
          isPremium={hasPremium}
        />

        {/* Highlight style customizer - conditionally rendered when customization is enabled */}
        {hasPremium && toggles.enableCustomization && toggles.highlightCAs && (
          <HighlightStyleCustomizer
            solanaStyle={toggles.highlightStyles.solanaStyle}
            pumpStyle={toggles.highlightStyles.pumpStyle}
            onChange={(styles) => updateHighlightStyles(styles)}
            disabled={!toggles.enableCustomization || !toggles.highlightCAs}
          />
        )}

        {/* Show upgrade button for non-premium users */}
        {!hasPremium && (
          <button
            className="w-full bg-purple-700 text-white border-none rounded-lg py-2 mt-3 cursor-pointer transition-colors hover:bg-purple-600"
            onClick={() => window.open(baseURL + '/#pricing', '_blank')}
          >
            Upgrade to get access
          </button>
        )}
      </div>

      {/* Auth status section */}
      <div className="mt-4">
        <LoginStatus authStatus={authStatus} loading={loading} />
      </div>
    </div>
  );
};

export default App;