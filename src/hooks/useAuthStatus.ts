// src/hooks/useAuthStatus.ts
import { useState, useEffect } from 'react';
import { getStoredAuthStatus, setStoredAuthStatus, AuthStatus } from '../utils/auth-storage';

const API_ENDPOINT = 'https://your-nextjs-app.com/api/auth/status'; // Update with your endpoint

export function useAuthStatus(pollInterval = 300000) {
  const [authStatus, setAuthStatusState] = useState<AuthStatus>({ session: null, subscription: null });
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await fetch(API_ENDPOINT, {
        credentials: 'include', // Ensures cookies are sent with the request
      });

      if (response.ok) {
        const data = await response.json();
        const newStatus: AuthStatus = {
          session: data.session,
          subscription: data.subscription,
        };
        setAuthStatusState(newStatus);
        await setStoredAuthStatus(newStatus);
      } else {
        // In case of an error (e.g., 401 Unauthorized)
        const newStatus: AuthStatus = { session: null, subscription: null };
        setAuthStatusState(newStatus);
        await setStoredAuthStatus(newStatus);
      }
    } catch (error) {
      console.error('Error fetching auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On mount, load the cached status from wxt-dev/storage first.
    (async () => {
      try {
        const storedStatus = await getStoredAuthStatus();
        setAuthStatusState(storedStatus);
      } catch (error) {
        console.error('Error reading auth status from storage:', error);
      } finally {
        // Immediately fetch the current status from the API.
        await fetchStatus();
      }
    })();

    // Set up periodic polling to refresh the status.
    const intervalId = setInterval(fetchStatus, pollInterval);
    return () => clearInterval(intervalId);
  }, [pollInterval]);

  return { authStatus, loading };
}
