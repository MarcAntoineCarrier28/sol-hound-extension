// src/utils/address-verification.ts
import { storage } from "@wxt-dev/storage";
import { getUrlForAddress, getTradingPlatformUrl } from "@/data/const";

// Constants - Replace with your actual QuickNode endpoint
const SOLANA_RPC_ENDPOINT = "https://multi-bitter-resonance.solana-mainnet.quiknode.pro/a55dd3abd5860ead89ad91cc4060ea6b96852116/";

// Address type definition
export type AddressType = "token" | "wallet" | "unknown";

// Cache interface
interface AddressCache {
  [address: string]: {
    type: AddressType;
    timestamp: number;
  };
}

// Cache expiration in ms (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Get the address cache from storage
export async function getAddressCache(): Promise<AddressCache> {
  const cache = await storage.getItem("local:addressTypeCache") as AddressCache;
  return cache || {};
}

// Set the address cache in storage
async function setAddressCache(cache: AddressCache): Promise<void> {
  await storage.setItem("local:addressTypeCache", cache);
}

// Update the cache with a new address type
async function updateAddressCache(address: string, type: AddressType): Promise<void> {
  const cache = await getAddressCache();
  cache[address] = {
    type,
    timestamp: Date.now()
  };
  await setAddressCache(cache);
}

// Check if a cache entry is still valid
function isCacheValid(cacheEntry: { timestamp: number }): boolean {
  return (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRATION;
}

// Verify if an address is a token or wallet using Solana JSON RPC
export async function verifyAddressType(address: string): Promise<AddressType> {
  // Check cache first
  const cache = await getAddressCache();
  if (cache[address] && isCacheValid(cache[address])) {
    return cache[address].type;
  }

  try {
    // Check if the address is a Token Mint account by checking its owner
    const tokenInfoResponse = await fetch(SOLANA_RPC_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccountInfo',
        params: [
          address,
          { encoding: 'jsonParsed' }
        ]
      })
    });

    const tokenInfoData = await tokenInfoResponse.json();
    
    // Check for token program ownership (Token Program ID)
    if (tokenInfoData.result && tokenInfoData.result.value) {
      const owner = tokenInfoData.result.value.owner;
      
      // Token Program ID or SPL Token 2022 Program ID
      if (owner === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' || 
          owner === 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb') {
        const type: AddressType = "token";
        await updateAddressCache(address, type);
        return type;
      }
      
      // It has an owner but is not a token, so it's a wallet
      const type: AddressType = "wallet";
      await updateAddressCache(address, type);
      return type;
    }
    
    // If we reach here and have a result but the account doesn't exist
    // it might be an unused wallet address
    if (tokenInfoData.result && tokenInfoData.result.value === null) {
      const type: AddressType = "wallet";
      await updateAddressCache(address, type);
      return type;
    }
  } catch (error) {
    console.error(`Error checking account:`, error);
  }

  // If all checks fail or we couldn't determine, return unknown
  const type: AddressType = "unknown";
  await updateAddressCache(address, type);
  return type;
}

// Get proper redirect URL based on address type using our central utility functions
export function getRedirectUrl(
  address: string, 
  addressType: AddressType,
  tokenExplorerPreference: string,
  walletExplorerPreference: string,
  tradingPlatformPreference: string,
  useTradingPlatform: boolean = false
): string {
  // For token addresses with trading enabled
  if (addressType === "token" && useTradingPlatform) {
    return getTradingPlatformUrl(address, tradingPlatformPreference);
  }
  
  // For all other cases, use the appropriate explorer
  return getUrlForAddress(address, addressType, tokenExplorerPreference, walletExplorerPreference);
}