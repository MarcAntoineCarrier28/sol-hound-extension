import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  srcDir: 'src',
  runner: {
    binaries: {
      chrome: '/path/to/chrome-beta', // Use Chrome Beta instead of regular Chrome
      firefox: 'firefoxdeveloperedition', // Use Firefox Developer Edition instead of regular Firefox
      edge: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', // Open MS Edge when running "wxt -b edge"
    },
    chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
  },
  modules: ['@wxt-dev/module-react'],
  manifest: () => ({
    name: import.meta.env.DEV
      ? `${import.meta.env.WXT_APP_NAME} (Dev)`
      : import.meta.env.WXT_APP_NAME,
    description: "Detects and highlights Solana contract addresses on web pages.",
    version: import.meta.env.WXT_APP_VERSION || '0.0.2',
    permissions: ['storage'],
    host_permissions: ["<all_urls>"],
  }),
});