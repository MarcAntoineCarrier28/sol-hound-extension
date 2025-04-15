import React from 'react';
import Header from '@/components/header';
import FeatureToggle from '@/components/feature-toggle';
import TokenRedirectSelector from '@/components/token-redirect-selector';
import WalletRedirectSelector from '@/components/wallet-redirect-selector';
import HighlightStyleCustomizer from '@/components/highlight-style-customizer';
import ReferralLinks from '@/components/referral-links';
import SocialLinks from '@/components/social-links';
import { useFeatureToggles } from '@/hooks/useFeatureToggles';

const App: React.FC = () => {
  const {
    toggles,
    updateToggle,
    updateTokenRedirectPreference,
    updateWalletRedirectPreference,
    updateHighlightStyles,
  } = useFeatureToggles();

  return (
    <div className="w-full font-sans text-center bg-gray-900 text-white rounded-lg">
      <Header />
      <SocialLinks />

      <div className="mb-2 pb-2">
        <FeatureToggle
          label="Highlight CA's"
          checked={toggles.highlightCAs}
          onChange={(value) => updateToggle("highlightCAs", value)}
        />

        {toggles.highlightCAs && (
          <div className="mt-2">
            <FeatureToggle
              label="Copy addresses on click"
              checked={toggles.enableCopyOnClick}
              onChange={(value) => {
                updateToggle("enableCopyOnClick", value);
              }}
              disabled={!toggles.highlightCAs}
            />
            {/* Highlighting style customization */}
            <FeatureToggle
              label="Custom highlight styles"
              checked={toggles.enableCustomization}
              onChange={(value) => toggles.highlightCAs ? updateToggle("enableCustomization", value) : null}
              disabled={!toggles.highlightCAs}
            />
            
            {/* Highlight style customizer - render when customization is enabled */}
            {toggles.enableCustomization && (
              <HighlightStyleCustomizer
                solanaStyle={toggles.highlightStyles.solanaStyle}
                pumpStyle={toggles.highlightStyles.pumpStyle}
                onChange={(styles) => updateHighlightStyles(styles)}
                disabled={!toggles.enableCustomization || !toggles.highlightCAs}
              />
            )}
          </div>
        )}
      </div>

      {/* Features section with purple border */}
      <div className="relative mt-6 border border-purple-600 rounded-lg p-4 pb-2">
        <div className="absolute -top-3 left-1/2 border border-purple-600 -translate-x-1/2 bg-gray-900 px-2.5 py-0.5 rounded z-10">
          <span className="text-purple-400 text-xs font-semibold">Redirection features</span>
        </div>

        {toggles.highlightCAs && (
          <>
            <TokenRedirectSelector
              value={toggles.tokenRedirectPreference}
              onChange={(value) => updateTokenRedirectPreference(value)}
              disabled={!toggles.highlightCAs || toggles.enableCopyOnClick}
            />

            <WalletRedirectSelector
              value={toggles.walletRedirectPreference}
              onChange={(value) => updateWalletRedirectPreference(value)}
              disabled={!toggles.highlightCAs || toggles.enableCopyOnClick}
            />
          </>
        )}
        <ReferralLinks />
      </div>
    </div>
  );
};

export default App;