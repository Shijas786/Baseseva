// Environment configuration utility
// This provides a fallback for environment variables until Privy is properly set up

interface EnvConfig {
  PRIVY_APP_ID?: string;
  NODE_ENV: string;
  DEV_MODE: boolean;
}

// Safely access environment variables with fallbacks
function getEnvConfig(): EnvConfig {
  try {
    // Check if we're in a Vite environment
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return {
        PRIVY_APP_ID: import.meta.env.VITE_PRIVY_APP_ID,
        NODE_ENV: import.meta.env.MODE || 'development',
        DEV_MODE: import.meta.env.DEV || true,
      };
    }
    
    // Check if we're in a Node.js environment
    if (typeof process !== 'undefined' && process.env) {
      return {
        PRIVY_APP_ID: process.env.VITE_PRIVY_APP_ID,
        NODE_ENV: process.env.NODE_ENV || 'development',
        DEV_MODE: process.env.NODE_ENV !== 'production',
      };
    }
    
    // Fallback for browser environments
    if (typeof window !== 'undefined' && (window as any).ENV) {
      const env = (window as any).ENV;
      return {
        PRIVY_APP_ID: env.VITE_PRIVY_APP_ID,
        NODE_ENV: env.NODE_ENV || 'development',
        DEV_MODE: env.NODE_ENV !== 'production',
      };
    }
    
    // Default fallback
    return {
      NODE_ENV: 'development',
      DEV_MODE: true,
    };
  } catch (error) {
    console.warn('Failed to load environment variables:', error);
    return {
      NODE_ENV: 'development',
      DEV_MODE: true,
    };
  }
}

export const env = getEnvConfig();

export const isDevelopment = env.NODE_ENV === 'development' || env.DEV_MODE;
export const isProduction = env.NODE_ENV === 'production' && !env.DEV_MODE;

// Helper to check if Privy is configured
export const isPrivyConfigured = !!env.PRIVY_APP_ID && env.PRIVY_APP_ID !== 'your-privy-app-id-here';

// Development helpers
if (isDevelopment) {
  console.log('🔧 Environment Config:', {
    NODE_ENV: env.NODE_ENV,
    DEV_MODE: env.DEV_MODE,
    PRIVY_CONFIGURED: isPrivyConfigured,
  });
}