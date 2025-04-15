// src/highlighting.ts
import { getStoredFeatureToggles } from "@/utils/feature-storage";
import { verifyAddressType, getRedirectUrl, getAddressCache } from "@/utils/address-verification";
import { highlightPresets } from "@/data/const";

const contractAddressRegex = /\b[1-9A-HJ-NP-Za-km-z]{32,44}(pump)?\b/g;

interface ReplaceItem {
  node: Text;
  fragment: DocumentFragment;
  parent: Node;
}

// Function to show loading indicator in span while verifying
function showLoadingState(span: HTMLElement): () => void {
  // Find the actual span inside shadow DOM if needed
  let targetSpan = span;
  if (span.shadowRoot) {
    targetSpan = span.shadowRoot.querySelector('span') as HTMLElement;
  }
  
  if (!targetSpan) return () => {}; // Return empty function if span not found
  
  // Add verifying class
  targetSpan.classList.add('verifying');
  
  // Store original text
  const originalText = targetSpan.textContent;
  const shortText = originalText && originalText.length > 10 
    ? originalText.substring(0, 4) + '...' + originalText.substring(originalText.length - 4) 
    : originalText;
  
  // Create spinner
  const spinner = document.createElement('span');
  spinner.innerHTML = '⟳';
  spinner.classList.add('spinner');
  
  // Set the text to include the spinner
  targetSpan.textContent = shortText || '';
  targetSpan.appendChild(spinner);
  
  // Return function to reset state
  return () => {
    targetSpan.classList.remove('verifying');
    targetSpan.textContent = originalText || '';
  };
}

const highlightAddresses = async (node: Node = document.body): Promise<void> => {
    const featureToggles = await getStoredFeatureToggles();
    if (!featureToggles.highlightCAs) return;

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

        function createClickableSpan(address: string): HTMLElement {
          // Create a wrapper element that retains address information
          const wrapper = document.createElement('span');
          wrapper.style.display = 'inline';
          wrapper.dataset.address = address; // Store address on wrapper for external access
          
          // Create shadow DOM and attach it to the wrapper
          const shadow = wrapper.attachShadow({ mode: 'open' });
          
          // Create the span inside the shadow DOM
          const span = document.createElement('span');
          span.textContent = address;
          
          // Add the appropriate classes based on address content
          span.classList.add('sol-hound-highlight');
          const isPump = address.toLowerCase().includes('pump');
          if (isPump) {
            span.classList.add('pump-highlight');
          } else {
            span.classList.add('solana-highlight');
          }
          
          // Get custom styles from feature toggles if available
          const getCustomStyles = async (): Promise<{
            solanaColors: string[];
            pumpColors: string[];
            solanaSpeed: number;
            pumpSpeed: number;
            isCustomized: boolean;
          }> => {
            try {
              const featureToggles = await getStoredFeatureToggles();              

              if (featureToggles.enableCustomization) {
                return {
                  solanaColors: featureToggles.highlightStyles.solanaStyle.colors,
                  pumpColors: featureToggles.highlightStyles.pumpStyle.colors,
                  solanaSpeed: featureToggles.highlightStyles.solanaStyle.animationSpeed,
                  pumpSpeed: featureToggles.highlightStyles.pumpStyle.animationSpeed,
                  isCustomized: true
                };
              }
            } catch (error) {
              console.error('Error getting custom styles', error);
            }
            
            // Return default styles if no custom styles are available
            const defaultPreset = highlightPresets[0];
            return {
              solanaColors: defaultPreset.solanaStyle.colors,
              pumpColors: defaultPreset.pumpStyle.colors,
              solanaSpeed: defaultPreset.solanaStyle.animationSpeed,
              pumpSpeed: defaultPreset.pumpStyle.animationSpeed,
              isCustomized: false
            };
          };
          
          // Apply styles asynchronously (first with defaults, then update if custom)
          (async () => {
            // Get the default styles from the first preset
            const defaultPreset = highlightPresets[0];
            
            // Apply default styles first for immediate rendering
            applyStyles(span, isPump, {
              solanaColors: defaultPreset.solanaStyle.colors,
              pumpColors: defaultPreset.pumpStyle.colors,
              solanaSpeed: defaultPreset.solanaStyle.animationSpeed,
              pumpSpeed: defaultPreset.pumpStyle.animationSpeed,
              isCustomized: false
            });
            
            // Then check for and apply custom styles
            const customStyles = await getCustomStyles();
            if (customStyles.isCustomized) {
              applyStyles(span, isPump, customStyles);
            }
          })();
          
          // Import default styles to shadow DOM first
          const style = document.createElement('style');
          const defaultStyleText = `
            .sol-hound-highlight {
              display: inline-block;
              position: relative;
              cursor: pointer;
              padding: 2px 4px;
              border-radius: 4px;
              font-weight: 500;
              color: transparent;
              background-size: 300% 100%;
              background-position: 0 0;
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              text-decoration: none;
              box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
            }
            
            .verifying { cursor: wait; }
            
            .spinner {
              display: inline-block;
              margin-left: 4px;
              animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `;
          style.textContent = defaultStyleText;
          
          // Add the style and span to the shadow DOM
          shadow.appendChild(style);
          shadow.appendChild(span);
          
          // Function to apply styles based on settings
          function applyStyles(
            element: HTMLElement, 
            isPump: boolean, 
            styles: {
              solanaColors: string[];
              pumpColors: string[];
              solanaSpeed: number;
              pumpSpeed: number;
              isCustomized: boolean;
            }
          ) {
            const { solanaColors, pumpColors, solanaSpeed, pumpSpeed } = styles;
            
            // Create gradient strings with precise percentage stops for seamless animation
            const createGradientString = (colors: string[]) => {
              if (colors.length < 2) return `linear-gradient(to right, ${colors[0]}, ${colors[0]})`;
              
              // Make sure the first and last colors are the same for perfect looping
              const gradientColors = [...colors];
              if (gradientColors[0] !== gradientColors[gradientColors.length - 1]) {
                // If they're not the same, create a symmetrical pattern
                gradientColors.push(...gradientColors.slice(0, -1).reverse());
              }
              
              // Calculate percentage step for even distribution
              const step = 100 / (gradientColors.length - 1);
              
              // Create the gradient with precise percentage stops
              return `linear-gradient(to right, ${gradientColors.map((color, index) => {
                const percentage = Math.round(index * step * 100) / 100; // More precise percentage
                return `${color} ${percentage}%`;
              }).join(', ')})`;
            };
            
            const solanaGradient = createGradientString(solanaColors);
            const pumpGradient = createGradientString(pumpColors);
            
            // Apply appropriate styles based on address type
            element.style.backgroundImage = isPump ? pumpGradient : solanaGradient;
            element.style.backgroundSize = '200% 100%'; // Set to exactly 200% for perfect looping
            element.style.animationDuration = `${isPump ? pumpSpeed : solanaSpeed}s`;
            element.style.animationName = 'solana-sweep';
            element.style.animationIterationCount = 'infinite';
            element.style.animationTimingFunction = 'ease-in-out'; // Use ease-in-out for smoother transitions
          }
          
          // Add keyframes for animation
          const keyframes = document.createElement('style');
          keyframes.textContent = `
            @keyframes solana-sweep {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 200% 50%; }
            }
          `;
          shadow.appendChild(keyframes);
          
          // Add event listener to both the span and wrapper
          const clickHandler = async (e: Event) => {
            // Stop event propagation to prevent double-firing
            e.stopPropagation();
            
            // Show loading indicator
            const resetLoadingState = showLoadingState(wrapper);
            
            try {
              const latestToggles = await getStoredFeatureToggles();
              
              // Check if copy-on-click is enabled
              if (latestToggles.enableCopyOnClick) {
                // Copy address to clipboard
                await navigator.clipboard.writeText(address);
                
                // Reset loading state
                resetLoadingState();
                
                // Show a brief success message in the span
                const targetElement = span.shadowRoot?.querySelector('span') || span;
                const originalStyles = {
                  backgroundColor: targetElement.style.backgroundColor,
                  color: targetElement.style.color,
                  backgroundImage: targetElement.style.backgroundImage
                };
                
                targetElement.style.backgroundColor = '#22C55E'; // Green background
                targetElement.style.backgroundImage = 'none';
                targetElement.style.color = 'white';
                targetElement.textContent = 'Copied!';
                
                // Restore original text and styles after 2 seconds
                setTimeout(() => {
                  targetElement.style.backgroundColor = originalStyles.backgroundColor;
                  targetElement.style.backgroundImage = originalStyles.backgroundImage;
                  targetElement.style.color = originalStyles.color;
                  targetElement.textContent = address;
                }, 2000);
                
                return; // Exit early, no redirect
              }
              
              // If copy-on-click is not enabled, proceed with normal redirect behavior
              
              // Verify address type
              const addressType = await verifyAddressType(address);
              
              // Get the appropriate redirect URL
              const url = getRedirectUrl(
                address,
                addressType,
                latestToggles.tokenRedirectPreference,
                latestToggles.walletRedirectPreference,
              );
              
              // Reset loading state
              resetLoadingState();
              
              // Open the URL
              window.open(url, "_blank");
            } catch (error) {
              console.error("Error processing address click:", error);
              
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
          };
          
          // Use event delegation: only add the click event to the wrapper
          // This prevents double event firing
          wrapper.addEventListener('click', clickHandler);
          
          // Return the wrapper
          return wrapper;
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