// src/utils/feature-storage.ts
import { storage } from "#imports";
import { 
  tokenExplorer1, 
  walletExplorer1, 
  highlightPresets
} from "@/data/const";

export interface FeatureToggles {
  highlightCAs: boolean;
  enableCustomization: boolean;
  enableCopyOnClick: boolean;
  // Separate redirect preferences for tokens and wallets
  tokenRedirectPreference: string;
  walletRedirectPreference: string;
  // Custom highlight styles
  highlightStyles: {
    solanaStyle: {
      colors: string[];
      animationSpeed: number;
    };
    pumpStyle: {
      colors: string[];
      animationSpeed: number;
    };
  };
}

const DEFAULT_TOGGLES: FeatureToggles = {
  highlightCAs: true,
  enableCustomization: false,
  enableCopyOnClick: false,
  tokenRedirectPreference: tokenExplorer1, // Default redirect for tokens
  walletRedirectPreference: walletExplorer1, // Default redirect for wallets
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