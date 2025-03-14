// src/hooks/useAuthStatus.ts
import { useState, useEffect } from 'react';
import { getStoredAuthStatus, setStoredAuthStatus, AuthStatus } from '../utils/auth-storage';
import { baseURL } from '@/data/const';

const API_ENDPOINT = baseURL + '/auth/status'; // Update with your endpoint

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
      console.log('Fetching auth status...');
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        credentials: 'include', // Ensures cookies are sent with the request
      });

      let newStatus: AuthStatus;
      if (response.ok) {
        console.log('Fetched auth status');
        const data = await response.json();
        newStatus = {
          session: data.session,
          subscription: data.subscription,
        };
      } else {
        console.log('Problem fetching auth status');
        // In case of an error (e.g., 401 Unauthorized)
        newStatus = { session: null, subscription: null };
      }
      
      // Store the result
      await setStoredAuthStatus(newStatus);
      return newStatus;
    } catch (error) {
      console.error('Error fetching auth status:', error);
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

  useEffect(() => {
    // On mount, load the cached status and immediately try to refresh it
    (async () => {
      try {
        // First load from cache to have something immediately
        const storedStatus = await getStoredAuthStatus();
        setAuthStatusState(storedStatus);
        setLoading(false);
        
        // Then refresh from the server
        const freshStatus = await fetchAuthStatus();
        setAuthStatusState(freshStatus);
      } catch (error) {
        console.error('Error in auth status initialization:', error);
        setLoading(false);
      }
    })();

    // Set up periodic polling at a reduced frequency
    const intervalId = setInterval(async () => {
      try {
        const freshStatus = await fetchAuthStatus();
        setAuthStatusState(freshStatus);
      } catch (error) {
        console.error('Error in auth status polling:', error);
      }
    }, pollInterval);
    
    return () => clearInterval(intervalId);
  }, [pollInterval]);

  return { authStatus, loading };
}