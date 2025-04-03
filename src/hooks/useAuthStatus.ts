// src/hooks/useAuthStatus.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { getStoredAuthStatus, setStoredAuthStatus, AuthStatus } from '../utils/auth-storage';
import { config, log, logError } from '@/utils/environment';

const API_ENDPOINT = `${config.baseUrl}/auth/status`;

// Create a singleton pattern to track ongoing fetches
let fetchPromise: Promise<AuthStatus> | null = null;
let lastFetchTime = 0;
const FETCH_COOLDOWN = 10000; // Increased to 10 seconds to reduce API calls

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
        log(`Problem fetching auth status, session terminated`);
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

// Default to a longer polling interval of 20 minutes to reduce API calls
export function useAuthStatus(pollInterval = 1200000) {
  const [authStatus, setAuthStatusState] = useState<AuthStatus>({ session: null, subscription: null });
  const [loading, setLoading] = useState(true);
  const previousStatusRef = useRef<AuthStatus | null>(null);
  const statusIsDifferent = useRef<boolean>(false);

  // Function to check if status has meaningful changes to avoid unnecessary re-renders
  const hasStatusChanged = useCallback((oldStatus: AuthStatus | null, newStatus: AuthStatus): boolean => {
    if (!oldStatus) return true;
    
    // Check if session state changed
    const sessionChanged = 
      (oldStatus.session === null && newStatus.session !== null) || 
      (oldStatus.session !== null && newStatus.session === null);
      
    // Check if subscription state changed
    const subscriptionChanged = 
      (oldStatus.subscription === null && newStatus.subscription !== null) || 
      (oldStatus.subscription !== null && newStatus.subscription === null);
    
    return sessionChanged || subscriptionChanged;
  }, []);

  // Function to refresh the auth status
  const refreshAuthStatus = useCallback(async () => {
    try {
      const freshStatus = await fetchAuthStatus();
      
      // Only update state if something important changed
      if (hasStatusChanged(authStatus, freshStatus)) {
        // Store the previous status before updating
        previousStatusRef.current = authStatus;
        statusIsDifferent.current = true;
        
        // Update the state with the fresh status
        setAuthStatusState(freshStatus);
        return true;
      }
      
      return false;
    } catch (error) {
      logError('Error refreshing auth status:', error);
      return false;
    }
  }, [authStatus, hasStatusChanged]);

  useEffect(() => {
    let mounted = true;
    
    // On mount, load the cached status and immediately try to refresh it
    (async () => {
      try {
        // First load from cache to have something immediately
        const storedStatus = await getStoredAuthStatus();
        if (mounted) {
          setAuthStatusState(storedStatus);
          setLoading(false);
          
          // Store initial status for future comparison
          previousStatusRef.current = storedStatus;
        
          // Then refresh from the server - but don't wait for it
          refreshAuthStatus();
        }
      } catch (error) {
        logError('Error in auth status initialization:', error);
        if (mounted) setLoading(false);
      }
    })();

    // Set up periodic polling at a reduced frequency
    const intervalId = setInterval(refreshAuthStatus, pollInterval);
    
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [pollInterval, refreshAuthStatus]);

  return { 
    authStatus, 
    loading, 
    refreshAuthStatus,
    statusChanged: statusIsDifferent.current
  };
}