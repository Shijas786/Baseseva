# Privy Smart Account Integration Setup

## Required Dependencies

Add these dependencies to your `package.json`:

```bash
npm install @privy-io/react-auth @privy-io/react-auth/smart-wallets viem
```

## Environment Variables

1. Create a `.env` file in your project root:

```env
VITE_PRIVY_APP_ID=your-privy-app-id-here
```

## Privy Dashboard Configuration

1. **Sign up** at [https://privy.io](https://privy.io)
2. **Create a new app** in your Privy dashboard
3. **Configure the following settings:**

### Basic Settings
- **App Name**: BaseSeva
- **App Description**: Web3 Blood Donation Network
- **App URL**: Your deployment URL or `http://localhost:5173` for development

### Login Configuration
- ✅ **Email**: Enable email-based authentication
- ✅ **SMS**: Enable phone number authentication  
- ❌ **Social**: Disable (unless needed)
- ❌ **Wallet**: Disable external wallet connection for this use case

### Blockchain Configuration
- **Supported Chains**:
  - ✅ Base (Chain ID: 8453) - Production
  - ✅ Base Sepolia (Chain ID: 84532) - Testing
- **Default Chain**: Base

### Wallet Configuration
- ✅ **Embedded Wallets**: Enable
  - Create on login: "Users without wallets"
  - No prompt on signature: false (for security)
- ✅ **Smart Wallets**: Enable
  - Create on login: "Users without wallets"
  - Account abstraction provider: Default

### Security Settings
- ✅ **MFA**: Enable multi-factor authentication
- ✅ **Session Management**: Configure session timeout
- ✅ **Rate Limiting**: Enable to prevent abuse

### Appearance Customization
- **Theme**: Dark (matches BaseSeva design)
- **Accent Color**: `#dc2626` (BaseSeva red)
- **Logo**: Upload BaseSeva logo if available

## Integration Features

### ✅ **What's Implemented**

1. **PrivyProvider**: Wraps the entire app with Privy configuration
2. **usePrivyAuth Hook**: Custom hook for easy Privy integration
3. **WalletCreationFlow**: Professional wallet setup experience
4. **WalletInfo Component**: Display wallet information and management
5. **SignupScreen Integration**: Email/SMS authentication + wallet creation
6. **App.tsx Integration**: Automatic session management

### 🔧 **Key Features**

- **Embedded Wallets**: User-controlled, non-custodial wallets
- **Smart Accounts**: Account abstraction for gasless transactions
- **Email/SMS Auth**: No Web3 knowledge required for users
- **Base Blockchain**: Optimized for the Base L2 ecosystem
- **Session Management**: Persistent login state
- **Security**: Multi-factor authentication support

## Usage Examples

### Check Authentication Status
```tsx
import { usePrivyAuth } from './components/hooks/usePrivyAuth';

function MyComponent() {
  const { isAuthenticated, hasWallet, hasSmartWallet } = usePrivyAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  if (!hasWallet) {
    return <div>Creating wallet...</div>;
  }
  
  return <div>Welcome! Your wallet is ready.</div>;
}
```

### Display Wallet Information
```tsx
import { WalletInfo } from './components/WalletInfo';

function ProfileScreen() {
  return (
    <div>
      <h1>Your Profile</h1>
      <WalletInfo showActions={true} />
    </div>
  );
}
```

### Manual Wallet Creation
```tsx
import { usePrivyAuth } from './components/hooks/usePrivyAuth';

function WalletSetup() {
  const { createEmbeddedWallet, createSmartAccount } = usePrivyAuth();
  
  const setupWallet = async () => {
    try {
      const embeddedWallet = await createEmbeddedWallet();
      const smartWallet = await createSmartAccount();
      console.log('Wallets created!', { embeddedWallet, smartWallet });
    } catch (error) {
      console.error('Wallet creation failed:', error);
    }
  };
  
  return <button onClick={setupWallet}>Create Wallet</button>;
}
```

## Production Checklist

### Before Deployment
- [ ] Replace `VITE_PRIVY_APP_ID` with production app ID
- [ ] Configure production domain in Privy dashboard
- [ ] Enable additional security features (MFA, rate limiting)
- [ ] Test wallet creation and authentication flows
- [ ] Verify Base mainnet transactions work correctly
- [ ] Set up monitoring for wallet creation success rates

### Security Considerations
- [ ] Never expose private keys in client-side code
- [ ] Implement proper error handling for wallet operations
- [ ] Set up backup recovery methods for users
- [ ] Configure session timeouts appropriately
- [ ] Monitor for suspicious authentication patterns

## Troubleshooting

### Common Issues

1. **"Provider not enabled" Error**
   - Check that email/SMS is enabled in Privy dashboard
   - Verify app ID is correct in environment variables

2. **Wallet Creation Fails**
   - Ensure supported chains are configured correctly
   - Check that embedded wallets are enabled
   - Verify network connectivity

3. **Authentication Loops**
   - Clear localStorage and cookies
   - Check for conflicting authentication states
   - Verify Privy configuration matches dashboard settings

4. **Smart Wallet Not Created**
   - Ensure embedded wallet exists first
   - Check that smart wallets are enabled in dashboard
   - Verify sufficient gas/balance for deployment

## Support

- **Privy Documentation**: https://docs.privy.io
- **Privy Discord**: https://discord.gg/privy
- **Base Documentation**: https://docs.base.org
- **BaseSeva Support**: Contact development team