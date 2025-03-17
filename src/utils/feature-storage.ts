// src/utils/feature-storage.ts
import { storage } from "@wxt-dev/storage";
import { 
  tokenExplorer1, 
  walletExplorer1, 
  tradingPlatform1
} from "@/data/const";

export interface FeatureToggles {
  highlightCAs: boolean;
  enableTrading: boolean;
  enableCustomization: boolean;
  enableAnalytics: boolean;
  // Separate redirect preferences for tokens and wallets
  tokenRedirectPreference: string;
  walletRedirectPreference: string;
  tradingPlatformPreference: string;
}

const DEFAULT_TOGGLES: FeatureToggles = {
  highlightCAs: true,
  enableTrading: false,
  enableCustomization: false,
  enableAnalytics: false,
  tokenRedirectPreference: tokenExplorer1, // Default redirect for tokens
  walletRedirectPreference: walletExplorer1, // Default redirect for wallets
  tradingPlatformPreference: tradingPlatform1 // Default trading platform
};

export async function getStoredFeatureToggles(): Promise<FeatureToggles> {
  const result = await storage.getItem("local:featureToggles") as FeatureToggles;
  
  // Handle migration from old format with single redirectPreference
  if (result && 'redirectPreference' in result) {
    const oldResult = result as any;
    // Use the old redirectPreference for both new preferences if they don't exist
    if (!oldResult.tokenRedirectPreference) {
      oldResult.tokenRedirectPreference = oldResult.redirectPreference;
    }
    if (!oldResult.walletRedirectPreference) {
      oldResult.walletRedirectPreference = oldResult.redirectPreference;
    }
    // Remove the old property
    delete oldResult.redirectPreference;
  }
  
  return { ...DEFAULT_TOGGLES, ...result };
}

export async function setStoredFeatureToggles(toggles: FeatureToggles): Promise<void> {
  await storage.setItem("local:featureToggles", toggles);
}