import { getStoredFeatureToggles, RedirectOption, TradingPlatformOption } from "@/utils/feature-storage";
import { getStoredAuthStatus } from "@/utils/auth-storage";
import { explorer1, explorer2, explorer3, explorer4, tradingPlatform1, tradingPlatform2, tradingPlatform3, tradingPlatform4 } from "@/data/const";

const contractAddressRegex = /\b[1-9A-HJ-NP-Za-km-z]{32,44}(pump)?\b/g;

interface ReplaceItem {
  node: Text;
  fragment: DocumentFragment;
  parent: Node;
}

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
  if (address.includes("pump")) {
    return `https://pump.fun/coin/${address}`;
  }
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

const highlightAddresses = async (node: Node = document.body): Promise<void> => {
    const featureToggles = await getStoredFeatureToggles();
    if (!featureToggles.highlightCAs) return;

    // Check auth status to determine if user has premium features
    const authStatus = await getStoredAuthStatus();
    const hasPremium = !!authStatus.subscription;

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
          
          span.addEventListener("click", () => {
            let url;
            
            // Determine where to redirect based on premium status and toggles
            if (hasPremium && featureToggles.enableTrading) {
              // Use trading platform for premium users with trading enabled
              url = getTradingPlatformUrl(address, featureToggles.tradingPlatformPreference);
            } else {
              // Otherwise use explorer
              url = getRedirectUrl(address, featureToggles.redirectPreference);
            }
            
            window.open(url, "_blank");
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