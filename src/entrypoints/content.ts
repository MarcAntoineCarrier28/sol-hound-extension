import "./highlight-styles.css";
import highlightAddresses from "./highlighting";

export default defineContentScript({
  matches: ["*://*/*"],
  main(ctx) {
    (() => {

      let observer: MutationObserver | undefined;

      document.addEventListener("DOMContentLoaded", () => highlightAddresses());

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

      highlightAddresses(document.body);
      if (observer) {
        observer.observe(document.body, { childList: true, subtree: true });
      }
    })();
  },
});
