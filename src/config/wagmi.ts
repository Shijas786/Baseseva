import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { farcasterFrame } from '@farcaster/miniapp-wagmi-connector';

// Create wagmi config with Farcaster Mini App connector
export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    farcasterFrame(),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

// Declare module for wagmi config type
declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}

