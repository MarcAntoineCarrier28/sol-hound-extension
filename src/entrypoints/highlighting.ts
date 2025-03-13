import { getStoredFeatureToggles, RedirectOption, TradingPlatformOption } from "@/utils/feature-storage";
import { getStoredAuthStatus } from "@/utils/auth-storage";
import { explorer1, explorer2, explorer3, explorer4, tradingPlatform1, tradingPlatform2, tradingPlatform3, tradingPlatform4 } from "@/data/const";
import { verifyAddressType, getUrlByAddressType, AddressType, getAddressCache } from "@/utils/address-verification";

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
          
          span.addEventListener("click", async (e) => {
            // Prevent default navigation if a link is clicked
            e.preventDefault();
            
            // Show loading indicator
            const resetLoadingState = showLoadingState(span);
            
            try {
              // Verify address type
              const addressType = await verifyAddressType(address);
              
              // Determine where to redirect based on address type, premium status, and toggles
              let url;
              
              if (hasPremium && featureToggles.enableTrading && addressType === "token") {
                // Use trading platform for premium users with trading enabled (only for token addresses)
                url = getTradingPlatformUrl(address, featureToggles.tradingPlatformPreference);
              } else {
                // Use the appropriate URL based on address type
                url = getUrlByAddressType(
                  address, 
                  addressType, 
                  featureToggles.redirectPreference,
                  featureToggles.tradingPlatformPreference
                );
              }
              
              // Reset loading state
              resetLoadingState();
              
              // Open the URL
              window.open(url, "_blank");
            } catch (error) {
              console.error("Error verifying address:", error);
              
              // Reset loading state
              resetLoadingState();
              
              // Fallback to default behavior if verification fails
              const url = address.includes("pump") 
                ? `https://pump.fun/coin/${address}`
                : `https://solscan.io/address/${address}`;
              window.open(url, "_blank");
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

// Helper functions for getting URLs based on preferences
const getRedirectUrl = (address: string, preference: RedirectOption): string => {
  switch (preference) {
    case explorer1:
      return `https://solscan.io/token/${address}`;
    case explorer2:
      return `https://dexscreener.com/solana/${address}`;
    case explorer3:
      return `https://solana.fm/address/${address}`;
    case explorer4:
      return `https://birdeye.so/token/${address}`;
    default:
      return `https://solscan.io/token/${address}`;
  }
};

const getTradingPlatformUrl = (address: string, platform: TradingPlatformOption): string => {
  switch (platform) {
    case tradingPlatform1:
      return `https://raydium.io/swap/?inputCurrency=SOL&outputCurrency=${address}`;
    case tradingPlatform2:
      return `https://photon-sol.tinyastro.io/en/lp/${address}`;
    case tradingPlatform3:
      return `https://neo.bullx.io/terminal?chainId=1399811149&address=${address}`;
    case tradingPlatform4:
      return `https://jup.ag/tokens/${address}`;
    default:
      return `https://raydium.io/swap/?inputCurrency=SOL&outputCurrency=${address}`;
  }
};

export default highlightAddresses;