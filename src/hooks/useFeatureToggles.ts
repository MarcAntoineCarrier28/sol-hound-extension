// src/hooks/useFeatureToggles.ts
import { useState, useEffect } from "react";
import { 
  getStoredFeatureToggles, 
  setStoredFeatureToggles, 
  FeatureToggles,
  RedirectOption,
  TradingPlatformOption
} from "@/utils/feature-storage";
import { explorer1, tradingPlatform1 } from "@/data/const";

export function useFeatureToggles() {
  const [toggles, setToggles] = useState<FeatureToggles>({
    highlightCAs: false,
    enableTrading: false,
    enableCustomization: false,
    enableAnalytics: false,
    redirectPreference: explorer1,
    tradingPlatformPreference: tradingPlatform1
  });

  useEffect(() => {
    // Load stored toggle state on mount
    (async () => {
      const storedToggles = await getStoredFeatureToggles();
      setToggles(storedToggles);
    })();
  }, []);

  const updateToggle = async (key: keyof Omit<FeatureToggles, 'redirectPreference' | 'tradingPlatformPreference'>, value: boolean) => {
    const newToggles = { ...toggles, [key]: value };
    setToggles(newToggles);
    await setStoredFeatureToggles(newToggles);
  };

  const updateRedirectPreference = async (value: RedirectOption) => {
    const newToggles = { ...toggles, redirectPreference: value };
    setToggles(newToggles);
    await setStoredFeatureToggles(newToggles);
  };

  const updateTradingPlatformPreference = async (value: TradingPlatformOption) => {
    const newToggles = { ...toggles, tradingPlatformPreference: value };
    setToggles(newToggles);
    await setStoredFeatureToggles(newToggles);
  };

  return { 
    toggles, 
    updateToggle, 
    updateRedirectPreference,
    updateTradingPlatformPreference
  };
}