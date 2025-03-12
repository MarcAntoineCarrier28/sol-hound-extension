import { getStoredFeatureToggles } from "@/utils/feature-storage";

const contractAddressRegex = /\b[1-9A-HJ-NP-Za-km-z]{32,44}(pump)?\b/g;

interface ReplaceItem {
  node: Text;
  fragment: DocumentFragment;
  parent: Node;
}

const highlightAddresses = async (node: Node = document.body): Promise<void> => {

    const featureToggles = await getStoredFeatureToggles();
    if (!featureToggles.highlightCAs) return;

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
            const url = address.includes("pump")
              ? `https://pump.fun/coin/${address}`
              : `https://solscan.io/token/${address}`;
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