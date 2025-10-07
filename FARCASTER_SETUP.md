# Farcaster Mini App Setup

BaseSeva is now configured as a Farcaster Mini App with wagmi wallet connection.

## What's Configured

✅ **@farcaster/miniapp-wagmi-connector** - Farcaster Mini App connector for wagmi
✅ **wagmi** - React hooks for Ethereum wallet connections
✅ **viem** - TypeScript interface for Ethereum
✅ **@tanstack/react-query** - Data fetching and caching

## How It Works

### 1. Wagmi Configuration (`src/config/wagmi.ts`)

The app uses the Farcaster Frame connector which enables wallet connections within Farcaster Mini Apps:

```typescript
import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { farcasterFrame } from '@farcaster/miniapp-wagmi-connector';

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    farcasterFrame(), // Farcaster Mini App connector
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
```

### 2. Wallet Connection

When users sign up, the app automatically connects to their Farcaster wallet:

```typescript
const { connect, connectors } = useConnect();
const { isConnected } = useAccount();

// Connect via Farcaster
const farcasterConnector = connectors[0];
await connect({ connector: farcasterConnector });
```

### 3. Auto-Switch to Base Network

The app automatically switches to Base network as recommended in the Farcaster guide:

```typescript
const chainId = useChainId();
const { switchChainAsync } = useSwitchChain();

useEffect(() => {
  const switchToBase = async () => {
    if (chainId !== base.id) {
      await switchChainAsync({ chainId: base.id });
    }
  };
  switchToBase();
}, [chainId, switchChainAsync]);
```

## Testing Your Mini App

To test BaseSeva as a Farcaster Mini App:

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to a hosting service** (Vercel, Netlify, etc.)

3. **Test in Farcaster:**
   - Open your deployed URL in a Farcaster client
   - The app will detect the Farcaster environment
   - Users can connect their Farcaster wallet seamlessly

## Development

For local development, the app works without Farcaster but will gracefully handle the missing connector:

```bash
npm run dev
```

## Key Features

- ✅ Wallet connection via Farcaster Frame
- ✅ Auto-switch to Base network
- ✅ React hooks for wallet state (useAccount, useConnect, etc.)
- ✅ Chain switching support
- ✅ Works both inside and outside Farcaster

## Resources

- [Farcaster Mini Apps Guide](https://dtech.vision/farcaster/miniapps/howtodowagmiwalletconnectinfarcasterminiapps/)
- [wagmi Documentation](https://wagmi.sh)
- [Farcaster Developer Docs](https://docs.farcaster.xyz)

## Networks Supported

- **Base Mainnet** (Chain ID: 8453)
- **Base Sepolia Testnet** (Chain ID: 84532)

