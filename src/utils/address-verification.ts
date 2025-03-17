// src/utils/address-verification.ts
import { storage } from "@wxt-dev/storage";
import { getUrlForAddress, getTradingPlatformUrl } from "@/data/const";
import { baseURL } from "@/data/const";

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

// Verify if an address is a token or wallet using our Next.js API
export async function verifyAddressType(address: string): Promise<AddressType> {
  // Check cache first
  const cache = await getAddressCache();
  if (cache[address] && isCacheValid(cache[address])) {
    return cache[address].type;
  }

  try {
    // Call our Next.js API endpoint
    const response = await fetch(`${baseURL}/api/verify-address`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.type) {
        // Update cache with the result from our API
        await updateAddressCache(address, data.type);
        return data.type as AddressType;
      }
    }
  } catch (error) {
    console.error("Error verifying address:", error);
  }

  // If API call fails or returns an unknown type, default to "unknown"
  const type: AddressType = "unknown";
  await updateAddressCache(address, type);
  return type;
}

// Get proper redirect URL based on address type
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