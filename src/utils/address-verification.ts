// src/utils/address-verification.ts
import { storage } from "#imports";
import { getUrlForAddress, getTradingPlatformUrl } from "@/data/const";
import { config, log, logError } from "@/utils/environment";
import { getStoredAuthStatus } from "@/utils/auth-storage";

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
  try {
    const cache = await storage.getItem("local:addressTypeCache") as AddressCache;
    return cache || {};
  } catch (error) {
    logError("Error fetching address cache:", error);
    return {};
  }
}

// Set the address cache in storage
async function setAddressCache(cache: AddressCache): Promise<void> {
  try {
    await storage.setItem("local:addressTypeCache", cache);
  } catch (error) {
    logError("Error setting address cache:", error);
  }
}

// Update the cache with a new address type
async function updateAddressCache(address: string, type: AddressType): Promise<void> {
  try {
    const cache = await getAddressCache();
    cache[address] = {
      type,
      timestamp: Date.now()
    };
    await setAddressCache(cache);
  } catch (error) {
    logError("Error updating address cache:", error);
  }
}

// Check if a cache entry is still valid
function isCacheValid(cacheEntry: { timestamp: number }): boolean {
  return (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRATION;
}

// Verify if an address is a token or wallet using our API endpoint
export async function verifyAddressType(address: string): Promise<AddressType> {
  // Check cache first
  try {
    const cache = await getAddressCache();
    if (cache[address] && isCacheValid(cache[address])) {
      log(`Cache hit for address ${address}: ${cache[address].type}`);
      return cache[address].type;
    }
  } catch (error) {
    logError("Error checking address cache:", error);
  }

  try {
    // Get the stored auth status to use for authentication
    const authStatus = await getStoredAuthStatus();
    const sessionId = authStatus.session?.user?.id;
    
    // Get API URL from environment config
    const apiEndpoint = `${config.apiUrl}/verify-address`;
    log(`Verifying address ${address} with endpoint ${apiEndpoint}`);

    // Call our API endpoint with authentication
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        address,
        session: authStatus.session
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.type) {
        const addressType = data.type as AddressType;
        // Update cache with the result from our API
        await updateAddressCache(address, addressType);
        log(`Address ${address} verified as ${addressType}`);
        return addressType;
      }
    } else {
      logError(`API error verifying address: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    logError("Error verifying address:", error);
  }

  // If API call fails or returns an unknown type, default to "wallet" but DON'T cache it
  log(`Address ${address} could not be verified, treating as wallet (not cached)`);
  return "wallet";
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
  try {
    // For token addresses with trading enabled
    if (addressType === "token" && useTradingPlatform) {
      log(`Using trading platform redirect for ${address}: ${tradingPlatformPreference}`);
      return getTradingPlatformUrl(address, tradingPlatformPreference);
    }
    
    // For all other cases, use the appropriate explorer
    log(`Using explorer redirect for ${address}: ${addressType === "token" ? tokenExplorerPreference : walletExplorerPreference}`);
    return getUrlForAddress(address, addressType, tokenExplorerPreference, walletExplorerPreference);
  } catch (error) {
    logError("Error generating redirect URL:", error);
    // Fallback to a default explorer if something goes wrong
    return `https://solscan.io/address/${address}`;
  }
}