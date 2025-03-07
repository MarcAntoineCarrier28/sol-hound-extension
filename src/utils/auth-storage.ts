// src/utils/authStorage.ts
import { storage } from "@wxt-dev/storage";

export interface Session {
  user: {
    id: string;
    email: string;
  };
}

export interface AuthStatus {
  session: Session | null;
  subscription: string | null;
}

export async function getStoredAuthStatus(): Promise<AuthStatus> {
  const result = await storage.getItem('local:authStatus') as AuthStatus;
  // Return the stored status or a default if not set
  return result || { session: null, subscription: null };
}

export async function setStoredAuthStatus(authStatus: AuthStatus): Promise<void> {
  await storage.setItem('local:authStatus', authStatus);
}
