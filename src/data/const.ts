// src/data/const.ts
import { config } from "@/utils/environment";

// Get the base URL from environment configuration
export const baseURL = config.baseUrl;

// ==========================================
// Token Explorer Options
// ==========================================

export const tokenExplorer1 = 'Axiom';
export const tokenExplorer2 = 'Bullx';
export const tokenExplorer3 = 'Photon';
export const tokenExplorer4 = 'GMGN';
export const tokenExplorer5 = 'Solscan';
export const tokenExplorer6 = 'Dex Screener';
export const tokenExplorer7 = 'Solana-Fm';
export const tokenExplorer8 = 'Birdeye';
export const tokenExplorer9 = 'Raydium';
export const tokenExplorer10 = 'Jupiter';

export interface ExplorerConfig {
  name: string;
  getUrl: (address: string) => string;
}

export const TOKEN_EXPLORERS: Record<string, ExplorerConfig> = {
  [tokenExplorer1]: {
    name: 'Axiom',
    getUrl: (address) => `https://axiom.trade/t/${address}/@hound`
  },
  [tokenExplorer2]: {
    name: 'Bullx',
    getUrl: (address) => `https://neo.bullx.io/terminal?chainId=1399811149&address=${address}`
  },
  [tokenExplorer3]: {
    name: 'Photon',
    getUrl: (address) => `https://photon-sol.tinyastro.io/en/lp/${address}`
  },
  [tokenExplorer4]: {
    name: 'GMGN',
    getUrl: (address) => `https://gmgn.ai/sol/token/${address}`
  },
  [tokenExplorer5]: {
    name: 'Solscan',
    getUrl: (address) => `https://solscan.io/token/${address}`
  },
  [tokenExplorer6]: {
    name: 'Dex Screener',
    getUrl: (address) => `https://dexscreener.com/solana/${address}`
  },
  [tokenExplorer7]: {
    name: 'Solana-Fm',
    getUrl: (address) => `https://solana.fm/address/${address}?cluster=mainnet-qn1`
  },
  [tokenExplorer8]: {
    name: 'Birdeye',
    getUrl: (address) => `https://birdeye.so/token/${address}?chain=solana`
  },
  [tokenExplorer9]: {
    name: 'Raydium',
    getUrl: (address) => `https://raydium.io/swap/?inputCurrency=SOL&outputCurrency=${address}`
  },
  [tokenExplorer10]: {
    name: 'Jupiter',
    getUrl: (address) => `https://jup.ag/tokens/${address}`
  },
};

export const TOKEN_EXPLORER_OPTIONS = [
  tokenExplorer1,
  tokenExplorer2,
  tokenExplorer3,
  tokenExplorer4,
  tokenExplorer5,
  tokenExplorer6,
  tokenExplorer7,
  tokenExplorer8,
  tokenExplorer9,
  tokenExplorer10
];

// ==========================================
// Wallet Explorer Options
// ==========================================

export const walletExplorer1 = 'Solscan';
export const walletExplorer2 = 'Coinstats';
export const walletExplorer3 = 'Solana-Fm';
export const walletExplorer4 = 'Birdeye';
export const walletExplorer5 = 'KolScan';

export const WALLET_EXPLORERS: Record<string, ExplorerConfig> = {
  [walletExplorer1]: {
    name: 'Solscan',
    getUrl: (address) => `https://solscan.io/account/${address}`
  },
  [walletExplorer2]: {
    name: 'Coinstats',
    getUrl: (address) => `https://coinstats.app/address/${address}`
  },
  [walletExplorer3]: {
    name: 'Solana-Fm',
    getUrl: (address) => `https://solana.fm/address/${address}?cluster=mainnet-qn1`
  },
  [walletExplorer4]: {
    name: 'Birdeye',
    getUrl: (address) => `https://birdeye.so/profile/${address}?chain=solana`
  },
  [walletExplorer5]: {
    name: 'KolScan',
    getUrl: (address) => `https://kolscan.io/account/${address}`
  }
};

export const WALLET_EXPLORER_OPTIONS = [
  walletExplorer1,
  walletExplorer2,
  walletExplorer3,
  walletExplorer4,
  walletExplorer5
];

// Utility function to get URL based on address type
export function getUrlForAddress(
  address: string, 
  addressType: 'token' | 'wallet' | 'unknown', 
  tokenExplorerPreference: string,
  walletExplorerPreference: string,
): string {
  // Use the appropriate explorer based on address type
  if (addressType === 'token') {
    return TOKEN_EXPLORERS[tokenExplorerPreference]?.getUrl(address) || 
           TOKEN_EXPLORERS[tokenExplorer1].getUrl(address);
  } 
  else if (addressType === 'wallet') {
    return WALLET_EXPLORERS[walletExplorerPreference]?.getUrl(address) || 
           WALLET_EXPLORERS[walletExplorer1].getUrl(address);
  } 
  else {
    // For unknown types, default to token explorer to prevent missed trades
    return TOKEN_EXPLORERS[tokenExplorerPreference]?.getUrl(address) || 
           TOKEN_EXPLORERS[tokenExplorer1].getUrl(address);
  }
}

// Highlight style presets
export const highlightPresets = [
  {
    id: 'default',
    name: 'Default',
    solanaStyle: {
      colors: ['#9945ff', '#14f195', '#14f195', '#9945ff'],
      animationSpeed: 1.5
    },
    pumpStyle: {
      colors: ['#00ff00', '#ffffff', '#00ff00'],
      animationSpeed: 1.5
    }
  },
  {
    id: 'neon',
    name: 'Neon',
    solanaStyle: {
      colors: ['#ff00ff', '#00ffff', '#ffff00', '#00ffff', '#ff00ff'],
      animationSpeed: 1.8
    },
    pumpStyle: {
      colors: ['#00ff99', '#ffff00', '#00ff99'],
      animationSpeed: 1.8
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    solanaStyle: {
      colors: ['#0066ff', '#00ccff', '#00ffff', '#00ccff', '#0066ff'],
      animationSpeed: 2.0
    },
    pumpStyle: {
      colors: ['#33cc33', '#66ff66', '#99ff99', '#66ff66', '#33cc33'],
      animationSpeed: 2.0
    }
  },
  {
    id: 'fire',
    name: 'Fire & Ice',
    solanaStyle: {
      colors: ['#ff3300', '#ff9900', '#ffcc00', '#ff9900', '#ff3300'],
      animationSpeed: 1.2
    },
    pumpStyle: {
      colors: ['#00ccff', '#66ffff', '#99ffff', '#66ffff', '#00ccff'],
      animationSpeed: 1.2
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    solanaStyle: {
      colors: ['#ff9966', '#ff6699', '#cc66ff', '#ff6699', '#ff9966'],
      animationSpeed: 2.2
    },
    pumpStyle: {
      colors: ['#ffcc00', '#ff9900', '#ff6600', '#ff9900', '#ffcc00'],
      animationSpeed: 2.2
    }
  },
  {
    id: 'monochrome',
    name: 'Mono',
    solanaStyle: {
      colors: ['#ffffff', '#aaaaaa', '#666666', '#aaaaaa', '#ffffff'],
      animationSpeed: 1.7
    },
    pumpStyle: {
      colors: ['#ffffff', '#aaaaaa', '#666666', '#aaaaaa', '#ffffff'],
      animationSpeed: 1.7
    }
  }
];