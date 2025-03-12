// src/utils/feature-storage.ts
import { storage } from "@wxt-dev/storage";
import { explorer1, explorer2, explorer3, explorer4, tradingPlatform1, tradingPlatform2, tradingPlatform3, tradingPlatform4 } from "@/data/const";

export type RedirectOption = typeof explorer1 | typeof explorer2 | typeof explorer3 | typeof explorer4;
export type TradingPlatformOption = typeof tradingPlatform1 | typeof tradingPlatform2 | typeof tradingPlatform3 | typeof tradingPlatform4;

export interface FeatureToggles {
  highlightCAs: boolean;
  enableTrading: boolean;
  enableCustomization: boolean;
  enableAnalytics: boolean;
  redirectPreference: RedirectOption;
  tradingPlatformPreference: TradingPlatformOption;
}

const DEFAULT_TOGGLES: FeatureToggles = {
  highlightCAs: false,
  enableTrading: false,
  enableCustomization: false,
  enableAnalytics: false,
  redirectPreference: explorer1, // Default redirect to Solscan
  tradingPlatformPreference: tradingPlatform1 // Default trading platform
};

export async function getStoredFeatureToggles(): Promise<FeatureToggles> {
  const result = await storage.getItem("local:featureToggles") as FeatureToggles;
  return result || DEFAULT_TOGGLES;
}

export async function setStoredFeatureToggles(toggles: FeatureToggles): Promise<void> {
  await storage.setItem("local:featureToggles", toggles);
}