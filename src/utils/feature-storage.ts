// src/utils/featureStorage.ts
import { storage } from "@wxt-dev/storage";

export interface FeatureToggles {
  highlightCAs: boolean;
  enableTrading: boolean;
  enableCustomization: boolean;
  enableAnalytics: boolean;
}

const DEFAULT_TOGGLES: FeatureToggles = {
  highlightCAs: false,
  enableTrading: false,
  enableCustomization: false,
  enableAnalytics: false,
};

export async function getStoredFeatureToggles(): Promise<FeatureToggles> {
  const result = await storage.getItem("local:featureToggles")as FeatureToggles;
  return result || DEFAULT_TOGGLES;
}

export async function setStoredFeatureToggles(toggles: FeatureToggles): Promise<void> {
  await storage.setItem("local:featureToggles", toggles);
}
