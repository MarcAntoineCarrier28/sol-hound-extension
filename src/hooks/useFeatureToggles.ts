// src/hooks/useFeatureToggles.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { 
  getStoredFeatureToggles, 
  setStoredFeatureToggles,
  FeatureToggles
} from "@/utils/feature-storage";
import { 
  tokenExplorer1, 
  walletExplorer1, 
  highlightPresets
} from "@/data/const";

// Default toggles available for initial render before storage is loaded
const defaultToggles: FeatureToggles = {
  highlightCAs: true,
  enableCopyOnClick: false,
  enableCustomization: false,
  tokenRedirectPreference: tokenExplorer1,
  walletRedirectPreference: walletExplorer1,
  highlightStyles: highlightPresets[0].solanaStyle && highlightPresets[0].pumpStyle ? {
    solanaStyle: { ...highlightPresets[0].solanaStyle },
    pumpStyle: { ...highlightPresets[0].pumpStyle }
  } : {
    solanaStyle: {
      colors: ['#9945ff', '#14f195', '#00ffc2', '#9945ff'],
      animationSpeed: 1.5
    },
    pumpStyle: {
      colors: ['#00ff00', '#ffffff', '#ffffff', '#00ff00'],
      animationSpeed: 1.5
    }
  }
};

export function useFeatureToggles() {
  const [toggles, setToggles] = useState<FeatureToggles>(defaultToggles);
  // Ref to track pending updates to batch them
  const updateTimeoutRef = useRef<number | null>(null);
  
  // Load stored toggles on mount
  useEffect(() => {
    let mounted = true;
    
    (async () => {
      const storedToggles = await getStoredFeatureToggles();
      if (mounted) {
        setToggles(storedToggles);
      }
    })();
    
    return () => {
      mounted = false;
      // Clear any pending updates
      if (updateTimeoutRef.current !== null) {
        window.clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Debounced storage update to batch multiple rapid changes
  const debouncedUpdateStorage = useCallback((newToggles: FeatureToggles) => {
    if (updateTimeoutRef.current !== null) {
      window.clearTimeout(updateTimeoutRef.current);
    }
    
    // Update after a short delay to batch rapid changes
    updateTimeoutRef.current = window.setTimeout(async () => {
      await setStoredFeatureToggles(newToggles);
      updateTimeoutRef.current = null;
    }, 150);
  }, []);

  const updateToggle = useCallback(
    (
      key: keyof Omit<FeatureToggles, 'tokenRedirectPreference' | 'walletRedirectPreference' | 'tradingPlatformPreference'>, 
      value: boolean
    ) => {
      const newToggles = { ...toggles, [key]: value };
      setToggles(newToggles);
      debouncedUpdateStorage(newToggles);
    },
    [toggles, debouncedUpdateStorage]
  );

  const updateTokenRedirectPreference = useCallback((value: string) => {
    const newToggles = { ...toggles, tokenRedirectPreference: value };
    setToggles(newToggles);
    debouncedUpdateStorage(newToggles);
  }, [toggles, debouncedUpdateStorage]);

  const updateWalletRedirectPreference = useCallback((value: string) => {
    const newToggles = { ...toggles, walletRedirectPreference: value };
    setToggles(newToggles);
    debouncedUpdateStorage(newToggles);
  }, [toggles, debouncedUpdateStorage]);

  const updateTradingPlatformPreference = useCallback((value: string) => {
    const newToggles = { ...toggles, tradingPlatformPreference: value };
    setToggles(newToggles);
    debouncedUpdateStorage(newToggles);
  }, [toggles, debouncedUpdateStorage]);

  /**
   * Updates the highlight styles for customization
   */
  const updateHighlightStyles = useCallback((styles: {
    solanaStyle: { colors: string[], animationSpeed: number };
    pumpStyle: { colors: string[], animationSpeed: number };
  }) => {
    const newToggles = { 
      ...toggles, 
      highlightStyles: styles
    };
    setToggles(newToggles);
    debouncedUpdateStorage(newToggles);
  }, [toggles, debouncedUpdateStorage]);

  return { 
    toggles, 
    updateToggle, 
    updateTokenRedirectPreference,
    updateWalletRedirectPreference,
    updateTradingPlatformPreference,
    updateHighlightStyles,
  };
}