import "./highlight-styles.css";
import highlightAddresses from "./highlighting";
import { getStoredFeatureToggles } from "../utils/feature-storage";
import { storage } from "@wxt-dev/storage";
import { getAddressCache } from "../utils/address-verification";
import { checkForReferralRedirect } from "@/utils/referral-redirect";

export default defineContentScript({
  matches: ["*://*/*"],
  main(ctx) {
    // Run referral check immediately
    checkForReferralRedirect();
    
    // Run again after a short delay (for SPAs)
    setTimeout(checkForReferralRedirect, 500);
    (async () => {
      let observer: MutationObserver | undefined;
      
      // Get feature toggle state from storage
      const featureToggles = await getStoredFeatureToggles();
      
      // Pre-load the address cache to optimize initial rendering
      await getAddressCache();
      
      // Function to apply or remove highlighting
      const updateHighlighting = (enabled: boolean) => {
        if (enabled && !observer) {
          // Set up the observer for DOM changes
          observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  highlightAddresses(node);
                }
              });
            });
          });
          
          observer.observe(document.body, { childList: true, subtree: true });
          highlightAddresses(document.body); // Highlight existing content
        } else if (!enabled && observer) {
          // Disconnect the observer
          observer.disconnect();
          observer = undefined;
          
          // Remove existing highlights
          document.querySelectorAll('.solana-highlight, .pump-highlight').forEach((el) => {
            const textContent = el.textContent;
            const textNode = document.createTextNode(textContent || '');
            el.parentNode?.replaceChild(textNode, el);
          });
        }
      };
      
      // Initial highlighting based on stored preference
      updateHighlighting(featureToggles.highlightCAs);
      
      // Set up storage watch to listen for changes
      storage.watch("local:featureToggles", (newValue) => {
        if (newValue && typeof newValue === 'object' && 'highlightCAs' in newValue) {
          updateHighlighting(newValue.highlightCAs as boolean);
        }
      });
      
      // Also add DOMContentLoaded listener if highlighting is enabled
      if (featureToggles.highlightCAs) {
        document.addEventListener("DOMContentLoaded", () => highlightAddresses());
      }
    })();
  },
});