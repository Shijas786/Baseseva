import React, { useEffect } from 'react';

/**
 * WalletConflictResolver - Handles conflicts between multiple wallet extensions
 * This component helps resolve issues when multiple wallet extensions try to inject
 * into the same window.ethereum object
 */
export function WalletConflictResolver() {
  useEffect(() => {
    // Suppress wallet extension conflicts in console
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      
      // Filter out common wallet extension conflicts
      if (
        message.includes('Cannot set property ethereum') ||
        message.includes('Cannot redefine property: ethereum') ||
        message.includes('MetaMask encountered an error setting the global Ethereum provider') ||
        message.includes('Razor Wallet Injected Successfully') ||
        message.includes('Nightly Wallet Injected Successfully')
      ) {
        // Silently ignore these wallet extension conflicts
        return;
      }
      
      // Log other errors normally
      originalError.apply(console, args);
    };

    // Clean up on unmount
    return () => {
      console.error = originalError;
    };
  }, []);

  // This component doesn't render anything
  return null;
}

export default WalletConflictResolver;
