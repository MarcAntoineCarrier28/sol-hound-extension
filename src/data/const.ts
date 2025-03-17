export const baseURL = "http://localhost:8080";


// ==========================================
// Token Explorer Options
// ==========================================

export const tokenExplorer1 = 'Solscan';
export const tokenExplorer2 = 'Dex Screener';
export const tokenExplorer3 = 'Solana-Fm';
export const tokenExplorer4 = 'Birdeye';

export interface ExplorerConfig {
  name: string;
  getUrl: (address: string) => string;
}

export const TOKEN_EXPLORERS: Record<string, ExplorerConfig> = {
  [tokenExplorer1]: {
    name: 'Solscan',
    getUrl: (address) => `https://solscan.io/token/${address}`
  },
  [tokenExplorer2]: {
    name: 'Dex Screener',
    getUrl: (address) => `https://dexscreener.com/solana/${address}`
  },
  [tokenExplorer3]: {
    name: 'Solana-Fm',
    getUrl: (address) => `https://solana.fm/address/${address}?cluster=mainnet-qn1`
  },
  [tokenExplorer4]: {
    name: 'Birdeye',
    getUrl: (address) => `https://birdeye.so/token/${address}?chain=solana`
  }
};

export const TOKEN_EXPLORER_OPTIONS = [
  tokenExplorer1,
  tokenExplorer2,
  tokenExplorer3,
  tokenExplorer4
];

// ==========================================
// Wallet Explorer Options
// ==========================================

export const walletExplorer1 = 'Solscan';
export const walletExplorer2 = 'Coinstats';
export const walletExplorer3 = 'Solana-Fm';
export const walletExplorer4 = 'Birdeye';

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
  }
};

export const WALLET_EXPLORER_OPTIONS = [
  walletExplorer1,
  walletExplorer2,
  walletExplorer3,
  walletExplorer4
];

// ==========================================
// Trading Platform Options
// ==========================================

export const tradingPlatform1 = 'Raydium';
export const tradingPlatform2 = 'Photon';
export const tradingPlatform3 = 'Bullx';
export const tradingPlatform4 = 'Jupiter';

export interface TradingPlatformConfig {
  name: string;
  getUrl: (address: string) => string;
}

export const TRADING_PLATFORMS: Record<string, TradingPlatformConfig> = {
  [tradingPlatform1]: {
    name: 'Raydium',
    getUrl: (address) => `https://raydium.io/swap/?inputCurrency=SOL&outputCurrency=${address}`
  },
  [tradingPlatform2]: {
    name: 'Photon',
    getUrl: (address) => `https://photon-sol.tinyastro.io/en/lp/${address}`
  },
  [tradingPlatform3]: {
    name: 'Bullx',
    getUrl: (address) => `https://neo.bullx.io/terminal?chainId=1399811149&address=${address}`
  },
  [tradingPlatform4]: {
    name: 'Jupiter',
    getUrl: (address) => `https://jup.ag/tokens/${address}`
  }
};

export const TRADING_PLATFORM_OPTIONS = [
  tradingPlatform1,
  tradingPlatform2,
  tradingPlatform3,
  tradingPlatform4
];

// Special case for Pump token addresses
export function getPumpTokenUrl(address: string): string {
  return `https://pump.fun/coin/${address}`;
}

// Utility function to get URL based on address type
export function getUrlForAddress(
  address: string, 
  addressType: 'token' | 'wallet' | 'unknown', 
  tokenExplorerPreference: string,
  walletExplorerPreference: string,
): string {
  // Special case for pump tokens
  if (address.includes('pump')) {
    return getPumpTokenUrl(address);
  }
  
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
    // For unknown types, default to wallet explorer
    return WALLET_EXPLORERS[walletExplorerPreference]?.getUrl(address) || 
           WALLET_EXPLORERS[walletExplorer1].getUrl(address);
  }
}

// Function to get trading platform URL for premium users
export function getTradingPlatformUrl(
  address: string,
  platformPreference: string
): string {
  if (address.includes('pump')) {
    return getPumpTokenUrl(address);
  }
  
  return TRADING_PLATFORMS[platformPreference]?.getUrl(address) || 
         TRADING_PLATFORMS[tradingPlatform1].getUrl(address);
}