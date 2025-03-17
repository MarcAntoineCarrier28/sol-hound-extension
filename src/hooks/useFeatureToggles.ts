// src/hooks/useFeatureToggles.ts
import { useState, useEffect } from "react";
import { 
  getStoredFeatureToggles, 
  setStoredFeatureToggles, 
  FeatureToggles
} from "@/utils/feature-storage";
import { 
  tokenExplorer1, 
  walletExplorer1, 
  tradingPlatform1
} from "@/data/const";

export function useFeatureToggles() {
  const [toggles, setToggles] = useState<FeatureToggles>({
    highlightCAs: true,
    enableTrading: false,
    enableCustomization: false,
    enableAnalytics: false,
    tokenRedirectPreference: tokenExplorer1,
    walletRedirectPreference: walletExplorer1,
    tradingPlatformPreference: tradingPlatform1
  });

  useEffect(() => {
    // Load stored toggle state on mount
    (async () => {
      const storedToggles = await getStoredFeatureToggles();
      setToggles(storedToggles);
    })();
  }, []);

  const updateToggle = async (
    key: keyof Omit<FeatureToggles, 'tokenRedirectPreference' | 'walletRedirectPreference' | 'tradingPlatformPreference'>, 
    value: boolean
  ) => {
    const newToggles = { ...toggles, [key]: value };
    setToggles(newToggles);
    await setStoredFeatureToggles(newToggles);
  };

  const updateTokenRedirectPreference = async (value: string) => {
    const newToggles = { ...toggles, tokenRedirectPreference: value };
    setToggles(newToggles);
    await setStoredFeatureToggles(newToggles);
  };

  const updateWalletRedirectPreference = async (value: string) => {
    const newToggles = { ...toggles, walletRedirectPreference: value };
    setToggles(newToggles);
    await setStoredFeatureToggles(newToggles);
  };

  const updateTradingPlatformPreference = async (value: string) => {
    const newToggles = { ...toggles, tradingPlatformPreference: value };
    setToggles(newToggles);
    await setStoredFeatureToggles(newToggles);
  };

  return { 
    toggles, 
    updateToggle, 
    updateTokenRedirectPreference,
    updateWalletRedirectPreference,
    updateTradingPlatformPreference
  };
}