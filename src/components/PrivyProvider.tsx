import { ReactNode } from 'react';
import { env, isPrivyConfigured } from '../utils/env';

interface PrivyProviderProps {
  children: ReactNode;
}

// Enhanced Privy provider with fallback
export function PrivyProvider({ children }: PrivyProviderProps) {
  // Check if Privy is properly configured
  if (!isPrivyConfigured) {
    console.warn('Privy not configured. Using mock authentication.');
    return <>{children}</>;
  }

  // For now, return children without Privy wrapper
  // This will be updated when Privy is properly set up
  return <>{children}</>;
}

// Future implementation when Privy is set up:
/*
import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { base, baseSepolia } from 'viem/chains';

export function PrivyProvider({ children }: PrivyProviderProps) {
  // Check if environment variables are available
  const privyAppId = typeof window !== 'undefined' && window.ENV?.VITE_PRIVY_APP_ID;
  
  // Fallback if Privy not configured
  if (!privyAppId) {
    console.warn('Privy not configured. Using mock provider.');
    return <>{children}</>;
  }

  return (
    <BasePrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#dc2626',
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          noPromptOnSignature: false,
        },
        loginMethods: ['email', 'sms'],
        supportedChains: [base, baseSepolia],
        defaultChain: base,
        smartWallet: {
          createOnLogin: 'users-without-wallets',
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  );
}
*/