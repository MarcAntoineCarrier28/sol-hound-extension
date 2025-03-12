// src/hooks/useFeatureToggles.ts
import { useState, useEffect } from "react";
import { getStoredFeatureToggles, setStoredFeatureToggles, FeatureToggles } from "@/utils/feature-storage";

export function useFeatureToggles() {
  const [toggles, setToggles] = useState<FeatureToggles>({
    highlightCAs: false,
    enableTrading: false,
    enableCustomization: false,
    enableAnalytics: false,
  });

  useEffect(() => {
    // Load stored toggle state on mount
    (async () => {
      const storedToggles = await getStoredFeatureToggles();
      setToggles(storedToggles);
    })();
  }, []);

  const updateToggle = async (key: keyof FeatureToggles, value: boolean) => {
    const newToggles = { ...toggles, [key]: value };
    setToggles(newToggles);
    await setStoredFeatureToggles(newToggles);
  };

  return { toggles, updateToggle };
}
