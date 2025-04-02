// src/utils/environment.ts

/**
 * Environment types for the extension
 */
export type Environment = 'development' | 'production';

/**
 * Configuration interface for environment-specific settings
 */
export interface EnvironmentConfig {
  // Base URL for the web application
  baseUrl: string;
  // API endpoint for the web application
  apiUrl: string;
  // Whether to enable verbose logging
  enableVerboseLogging: boolean;
  // Any other environment-specific configuration
  referralCode: string;
}

/**
 * Get the current environment from WXT environment variables
 */
export function getCurrentEnvironment(): Environment {
  return (import.meta.env.WXT_ENVIRONMENT as Environment) || 
         (import.meta.env.DEV ? 'development' : 'production');
}

/**
 * Get the current environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  return {
    baseUrl: import.meta.env.WXT_BASE_URL as string,
    apiUrl: import.meta.env.WXT_API_BASE_URL as string,
    enableVerboseLogging: import.meta.env.WXT_ENABLE_VERBOSE_LOGGING === 'true',
    referralCode: (import.meta.env.WXT_REFERRAL_CODE as string) || 'hound'
  };
}

// Export the current environment and config
export const environment = getCurrentEnvironment();
export const config = getEnvironmentConfig();

/**
 * Helper for conditional logging that only logs when verbose logging is enabled
 */
export function log(...args: any[]): void {
  if (config.enableVerboseLogging || import.meta.env.DEV) {
    console.log(`[Solhound]`, ...args);
  }
}

/**
 * Always log errors, but with environment context
 */
export function logError(...args: any[]): void {
  console.error(`[Solhound][${environment}]`, ...args);
}

/**
 * Check if the extension is running in development mode
 */
export function isDevelopment(): boolean {
  return environment === 'development' || import.meta.env.DEV;
}

/**
 * Check if the extension is running in production mode
 */
export function isProduction(): boolean {
  return environment === 'production' || import.meta.env.PROD;
}