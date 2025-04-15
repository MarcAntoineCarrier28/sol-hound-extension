import '@/assets/content.css';
import highlightAddresses from "./highlighting";
import { getStoredFeatureToggles } from "../utils/feature-storage";
import { storage, defineContentScript } from "#imports";
import { getAddressCache } from "../utils/address-verification";

export default defineContentScript({
  matches: ["*://*/*"],
  main(ctx) {
    (async () => {
      
      let observer: MutationObserver | undefined;
      
      // Get feature toggle state from storage
      const featureToggles = await getStoredFeatureToggles();
      
      // Pre-load the address cache to optimize initial rendering
      await getAddressCache();
      
      // Function to apply or remove highlighting
      const updateHighlighting = (enabled: boolean, forceRefresh = false) => {
        if (enabled && (!observer || forceRefresh)) {
          // If we're forcing a refresh and observer already exists, disconnect it first
          if (observer && forceRefresh) {
            observer.disconnect();
            
            // Remove existing highlights
            document.querySelectorAll('[data-address]').forEach((el) => {
              const textContent = el.getAttribute('data-address');
              const textNode = document.createTextNode(textContent || '');
              el.parentNode?.replaceChild(textNode, el);
            });
          }
          
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
          document.querySelectorAll('[data-address]').forEach((el) => {
            const textContent = el.getAttribute('data-address');
            const textNode = document.createTextNode(textContent || '');
            el.parentNode?.replaceChild(textNode, el);
          });
        }
      };
      
      // Initial highlighting based on stored preference
      updateHighlighting(featureToggles.highlightCAs);
      
      // Set up storage watch to listen for changes
      storage.watch("local:featureToggles", (newValue, oldValue) => {
        if (newValue && typeof newValue === 'object') {
          const newToggles = newValue as any;
          const oldToggles = oldValue as any || {};
          
          // Handle highlight CA toggle changing
          if ('highlightCAs' in newToggles && newToggles.highlightCAs !== oldToggles.highlightCAs) {
            updateHighlighting(newToggles.highlightCAs as boolean);
          }
          
          // Handle customization settings changing - need to refresh highlights
          if (
            newToggles.highlightCAs && 
            (
              // Customization was toggled
              ('enableCustomization' in newToggles && newToggles.enableCustomization !== oldToggles.enableCustomization) ||
              // Highlight styles were changed
              (newToggles.enableCustomization && 
               'highlightStyles' in newToggles && 
               JSON.stringify(newToggles.highlightStyles) !== JSON.stringify(oldToggles.highlightStyles))
            )
          ) {
            // Force a refresh when customization settings change
            updateHighlighting(true, true);
          }
        }
      });
      
      // Also add DOMContentLoaded listener if highlighting is enabled
      if (featureToggles.highlightCAs) {
        document.addEventListener("DOMContentLoaded", () => highlightAddresses());
      }
    })();
  },
});