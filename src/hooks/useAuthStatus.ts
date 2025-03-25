// src/hooks/useAuthStatus.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { getStoredAuthStatus, setStoredAuthStatus, AuthStatus } from '../utils/auth-storage';
import { config, log, logError } from '@/utils/environment';

const API_ENDPOINT = `${config.baseUrl}/auth/status`;

// Create a singleton pattern to track ongoing fetches
let fetchPromise: Promise<AuthStatus> | null = null;
let lastFetchTime = 0;
const FETCH_COOLDOWN = 5000; // 5 seconds minimum between fetches

/**
 * Fetch the auth status with deduplication to prevent multiple simultaneous calls
 */
const fetchAuthStatus = async (): Promise<AuthStatus> => {
  const currentTime = Date.now();
  
  // If there's already a fetch in progress, return that promise
  if (fetchPromise) {
    return fetchPromise;
  }
  
  // If we fetched recently, return the stored value instead
  if (currentTime - lastFetchTime < FETCH_COOLDOWN) {
    return getStoredAuthStatus();
  }
  
  // Create a new fetch promise
  fetchPromise = (async () => {
    try {
      log('Fetching auth status...');
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        credentials: 'include', // Ensures cookies are sent with the request
      });

      let newStatus: AuthStatus;
      if (response.ok) {
        log('Fetched auth status successfully');
        const data = await response.json();
        newStatus = {
          session: data.session,
          subscription: data.subscription,
        };
      } else {
        log(`Problem fetching auth status: ${response.status}`);
        // In case of an error (e.g., 401 Unauthorized)
        newStatus = { session: null, subscription: null };
      }
      
      // Store the result
      await setStoredAuthStatus(newStatus);
      return newStatus;
    } catch (error) {
      logError('Error fetching auth status:', error);
      // Return the last known state in case of error
      return getStoredAuthStatus();
    } finally {
      // Update the last fetch time
      lastFetchTime = Date.now();
      // Clear the promise so future calls can proceed
      fetchPromise = null;
    }
  })();
  
  return fetchPromise;
};

export function useAuthStatus(pollInterval = 300000) {
  const [authStatus, setAuthStatusState] = useState<AuthStatus>({ session: null, subscription: null });
  const [loading, setLoading] = useState(true);
  const previousStatusRef = useRef<AuthStatus | null>(null);

  // Function to check if premium status has changed
  const hasPremiumChanged = useCallback((oldStatus: AuthStatus | null, newStatus: AuthStatus): boolean => {
    // Check if premium status changed from true to false
    const hadPremium = oldStatus?.subscription !== null;
    const hasPremium = newStatus.subscription !== null;
    
    return hadPremium !== hasPremium;
  }, []);

  // Function to refresh the auth status
  const refreshAuthStatus = useCallback(async () => {
    try {
      const freshStatus = await fetchAuthStatus();
      
      // Store the previous status before updating
      previousStatusRef.current = authStatus;
      
      // Update the state with the fresh status
      setAuthStatusState(freshStatus);
      
      // Return whether premium status changed
      return hasPremiumChanged(previousStatusRef.current, freshStatus);
    } catch (error) {
      logError('Error refreshing auth status:', error);
      return false;
    }
  }, [authStatus, hasPremiumChanged]);

  useEffect(() => {
    // On mount, load the cached status and immediately try to refresh it
    (async () => {
      try {
        // First load from cache to have something immediately
        const storedStatus = await getStoredAuthStatus();
        setAuthStatusState(storedStatus);
        setLoading(false);
        
        // Store initial status for future comparison
        previousStatusRef.current = storedStatus;
        
        // Then refresh from the server
        await refreshAuthStatus();
      } catch (error) {
        logError('Error in auth status initialization:', error);
        setLoading(false);
      }
    })();

    // Set up periodic polling at a reduced frequency
    const intervalId = setInterval(refreshAuthStatus, pollInterval);
    
    return () => clearInterval(intervalId);
  }, [pollInterval, refreshAuthStatus]);

  return { 
    authStatus, 
    loading, 
    refreshAuthStatus,
    hasPremiumStatusChanged: () => hasPremiumChanged(previousStatusRef.current, authStatus)
  };
}