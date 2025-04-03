// src/highlighting.ts
import { getStoredFeatureToggles } from "@/utils/feature-storage";
import { getStoredAuthStatus } from "@/utils/auth-storage";
import { verifyAddressType, getRedirectUrl, AddressType, getAddressCache } from "@/utils/address-verification";

const contractAddressRegex = /\b[1-9A-HJ-NP-Za-km-z]{32,44}(pump)?\b/g;

interface ReplaceItem {
  node: Text;
  fragment: DocumentFragment;
  parent: Node;
}

// Function to show loading indicator in span while verifying
const showLoadingState = (span: HTMLSpanElement) => {
  span.classList.add("verifying");
  span.style.cursor = "wait";
  
  // Store original text
  const originalText = span.textContent;
  span.dataset.originalText = originalText || "";
  
  // Add a little loading indicator 
  const spinner = document.createElement("span");
  spinner.className = "spinner";
  spinner.textContent = "⟳";
  span.textContent = "";
  span.appendChild(document.createTextNode(originalText?.slice(0, 6) + "..." || ""));
  span.appendChild(spinner);
  
  return () => {
    // Function to restore original state
    span.classList.remove("verifying");
    span.style.cursor = "pointer";
    span.textContent = span.dataset.originalText || "";
    delete span.dataset.originalText;
  };
};

const highlightAddresses = async (node: Node = document.body): Promise<void> => {
    const featureToggles = await getStoredFeatureToggles();
    if (!featureToggles.highlightCAs) return;

    // Check auth status to determine if user has premium features
    const authStatus = await getStoredAuthStatus();
    const hasPremium = !!authStatus.subscription;
    
    // If premium features were enabled but user is not premium, they should be disabled
    // This is a safety check in the content script
    if (!hasPremium && featureToggles.enableTrading) {
      // Premium features should already be disabled by the popup
      // This is just a safety check for the content script
      console.log('Non-premium user has premium features enabled, ignoring');
    }

    // Load address cache to pre-label known addresses
    const addressCache = await getAddressCache();

    if (!node) return;
    const walker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_TEXT,
      null
    );
    const nodesToReplace: ReplaceItem[] = [];

    while (walker.nextNode()) {
      const currentNode = walker.currentNode as Text;
      const parent = currentNode.parentNode;
      if (!parent) continue;
      // Skip if the parent already has a highlight class
      if (
        parent instanceof Element &&
        (parent.classList.contains("solana-highlight") ||
          parent.classList.contains("pump-highlight"))
      ) {
        continue;
      }

      const nodeValue = currentNode.nodeValue;
      if (!nodeValue) continue;
      const addressMatches = nodeValue.match(contractAddressRegex);
      if (addressMatches) {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        function createClickableSpan(address: string): HTMLSpanElement {
          const span = document.createElement("span");
          span.textContent = address;
          span.dataset.address = address;
          span.style.cursor = "pointer";
          span.className = address.includes("pump")
            ? "pump-highlight animated-highlight"
            : "solana-highlight animated-highlight";
          
          // Add the sol-hound-highlight class to ensure our styles are scoped
          span.classList.add("sol-hound-highlight");
          
          span.addEventListener("click", async (e) => {
            // Prevent default navigation if a link is clicked
            e.preventDefault();
            
            // Show loading indicator
            const resetLoadingState = showLoadingState(span);
            
            try {
              // Get the latest feature toggles and auth status
              // This ensures we use the most current settings
              const latestToggles = await getStoredFeatureToggles();
              const latestAuthStatus = await getStoredAuthStatus();
              const userHasPremium = !!latestAuthStatus.subscription;
              
              // Verify address type
              const addressType = await verifyAddressType(address);
              
              // Determine whether to use trading platform (only for premium users with trading enabled and token addresses)
              const useTradingPlatform = userHasPremium && 
                                        latestToggles.enableTrading && 
                                        addressType === "token";
              
              // Get the appropriate redirect URL
              const url = getRedirectUrl(
                address,
                addressType,
                latestToggles.tokenRedirectPreference,
                latestToggles.walletRedirectPreference,
                latestToggles.tradingPlatformPreference,
                useTradingPlatform
              );
              
              // Reset loading state
              resetLoadingState();
              
              // Open the URL
              window.open(url, "_blank");
            } catch (error) {
              console.error("Error verifying address:", error);
              
              // Reset loading state
              resetLoadingState();
              
              // Fallback to default behavior if verification fails
              let fallbackUrl = "";
              if (address.includes("pump")) {
                fallbackUrl = `https://pump.fun/coin/${address}`;
              } else {
                fallbackUrl = `https://solscan.io/address/${address}`;
              }
              window.open(fallbackUrl, "_blank");
            }
          });
          
          return span;
        }

        addressMatches.forEach((match) => {
          const matchIndex = nodeValue.indexOf(match, lastIndex);
          if (matchIndex === -1) return;
          if (matchIndex > lastIndex) {
            fragment.appendChild(
              document.createTextNode(
                nodeValue.slice(lastIndex, matchIndex)
              )
            );
          }
          fragment.appendChild(createClickableSpan(match));
          lastIndex = matchIndex + match.length;
        });

        if (lastIndex < nodeValue.length) {
          fragment.appendChild(
            document.createTextNode(nodeValue.slice(lastIndex))
          );
        }

        nodesToReplace.push({ node: currentNode, fragment, parent });
      }
    }

    nodesToReplace.forEach(({ node, fragment, parent }) => {
      parent.replaceChild(fragment, node);
    });
  }

export default highlightAddresses;