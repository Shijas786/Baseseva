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
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      
      // Filter out common wallet extension conflicts
      if (
        message.includes('Cannot set property ethereum') ||
        message.includes('Cannot redefine property: ethereum') ||
        message.includes('MetaMask encountered an error setting the global Ethereum provider') ||
        message.includes('Razor Wallet Injected Successfully') ||
        message.includes('Nightly Wallet Injected Successfully') ||
        message.includes('evmAsk.js') ||
        message.includes('inpage.js') ||
        message.includes('contentScript.ts') ||
        message.includes('Cannot redefine property') ||
        message.includes('TypeError: Cannot set property ethereum')
      ) {
        // Silently ignore these wallet extension conflicts
        return;
      }
      
      // Log other errors normally
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args[0]?.toString() || '';
      
      // Filter out wallet extension warnings
      if (
        message.includes('MetaMask') ||
        message.includes('wallet extension') ||
        message.includes('ethereum provider')
      ) {
        return;
      }
      
      // Log other warnings normally
      originalWarn.apply(console, args);
    };

    // Clean up on unmount
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  // This component doesn't render anything
  return null;
}

export default WalletConflictResolver;
