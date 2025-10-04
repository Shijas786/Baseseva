import { useState } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { usePrivyAuth } from './hooks/usePrivyAuth';
import { MockWalletNotice } from './MockWalletNotice';
import { Shield, Wallet, CheckCircle, AlertCircle, Zap, Lock, Key, Smartphone } from 'lucide-react';

interface WalletCreationFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

export function WalletCreationFlow({ onComplete, onBack }: WalletCreationFlowProps) {
  const [currentStep, setCurrentStep] = useState<'education' | 'creating-embedded' | 'creating-smart' | 'complete'>('education');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    createEmbeddedWallet, 
    createSmartAccount, 
    hasWallet, 
    hasSmartWallet,
    walletAddress,
    smartWalletAddress,
    isLoading 
  } = usePrivyAuth();

  const handleCreateWallets = async () => {
    try {
      setError(null);
      setCurrentStep('creating-embedded');
      setProgress(20);

      // Step 1: Create embedded wallet (always create in demo mode for better UX)
      console.log('🚀 Starting wallet creation process...');
      const embeddedWallet = await createEmbeddedWallet();
      
      if (!embeddedWallet) {
        throw new Error('Failed to create embedded wallet');
      }
      
      setProgress(60);
      
      // Small delay for UX and state update
      await new Promise(resolve => setTimeout(resolve, 500));

      setCurrentStep('creating-smart');
      setProgress(80);

      // Step 2: Create smart wallet
      console.log('🎯 Creating smart account...');
      const smartWallet = await createSmartAccount();
      
      if (!smartWallet) {
        throw new Error('Failed to create smart wallet');
      }
      
      setProgress(100);
      setCurrentStep('complete');
      
      console.log('🎉 Wallet creation complete!');
      
      // Auto-proceed after showing success
      setTimeout(() => {
        onComplete();
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Wallet creation failed:', error);
      setError(error.message || 'Failed to create wallet. Please try again.');
      setCurrentStep('education');
      setProgress(0);
    }
  };

  if (currentStep === 'education') {
    return (
      <div className="space-y-6">
        <MockWalletNotice />
        
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Wallet className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-3 text-white">
            Secure Wallet Setup
          </h2>
          <p className="text-red-100 mb-6 text-lg">Creating your blockchain identity for secure donations</p>
        </div>

        {/* Educational Cards */}
        <div className="space-y-4">
          <div className="relative bg-black/20 rounded-xl p-5 backdrop-blur-sm border border-red-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent rounded-xl"></div>
            <div className="relative flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-400/30">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">🔐 Military-Grade Security</h3>
                <p className="text-sm text-red-200/80 leading-relaxed">
                  Your wallet uses advanced cryptography and smart contract technology to ensure maximum security for your donations and identity.
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-black/20 rounded-xl p-5 backdrop-blur-sm border border-red-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent rounded-xl"></div>
            <div className="relative flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-400/30">
                <Key className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">🔑 Smart Account Technology</h3>
                <p className="text-sm text-red-200/80 leading-relaxed">
                  We'll create two wallets: a secure embedded wallet and a smart account for advanced features like gasless transactions.
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-black/20 rounded-xl p-5 backdrop-blur-sm border border-red-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent rounded-xl"></div>
            <div className="relative flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-400/30">
                <Lock className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">🛡️ Your Keys, Your Control</h3>
                <p className="text-sm text-red-200/80 leading-relaxed">
                  You maintain full ownership and control of your wallet. Only you can access your funds and donation history.
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleCreateWallets}
            disabled={isLoading}
            className="relative w-full h-16 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white transition-all duration-300 shadow-xl text-lg font-semibold rounded-xl border border-red-400/30 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-3">
              <Zap className="w-5 h-5" />
              {isLoading ? 'Creating Wallets...' : 'Create Secure Wallet'}
            </div>
          </Button>

          <Button
            onClick={onBack}
            variant="outline"
            className="w-full h-14 border-red-500/30 text-red-300 hover:bg-red-500/10 backdrop-blur-lg rounded-xl font-medium transition-all duration-300"
          >
            Back to Profile Setup
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 'creating-embedded' || currentStep === 'creating-smart') {
    const isCreatingEmbedded = currentStep === 'creating-embedded';
    
    return (
      <div className="space-y-8 text-center">
        {/* Enhanced Loading Animation */}
        <div className="relative w-32 h-32 mx-auto">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin"></div>
          {/* Middle spinning ring */}
          <div className="absolute inset-4 rounded-full border-4 border-red-600/20 border-r-red-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          {/* Inner pulsing core */}
          <div className="absolute inset-8 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            {isCreatingEmbedded ? (
              <Smartphone className="w-8 h-8 text-white" />
            ) : (
              <Shield className="w-8 h-8 text-white" />
            )}
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
        </div>
        
        <div>
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-red-400 via-red-300 to-red-400 bg-clip-text text-transparent">
            {isCreatingEmbedded ? 'Creating Embedded Wallet' : 'Deploying Smart Account'}
          </h2>
          <p className="text-red-200 mb-8 text-xl">
            {isCreatingEmbedded 
              ? 'Generating secure cryptographic keys...' 
              : 'Setting up advanced smart contract wallet...'
            }
          </p>
          
          <div className="space-y-6">
            {/* Enhanced Progress Bar */}
            <div className="relative">
              <Progress value={progress} className="h-4 bg-white/10 rounded-full overflow-hidden" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-500/20 rounded-full blur-sm"></div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-300">Progress</span>
              <span className="text-red-300 font-bold text-lg">{progress}% Complete</span>
            </div>
            
            <div className="relative bg-white/5 rounded-2xl p-6 backdrop-blur-lg border border-red-400/20">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-600/10 to-red-500/10 rounded-2xl blur-lg"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-lg text-red-200 font-medium ml-4">
                  {isCreatingEmbedded 
                    ? 'Encrypting private keys...' 
                    : 'Deploying smart contract...'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'complete') {
    return (
      <div className="space-y-8 text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-green-500/30 rounded-full blur-lg animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
            Wallet Created Successfully!
          </h2>
          <p className="text-green-200 mb-8 text-xl">Your secure blockchain identity is ready</p>
        </div>

        {/* Wallet Addresses Display */}
        <div className="space-y-4">
          {walletAddress && (
            <div className="bg-black/20 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-300 font-medium">Embedded Wallet</span>
                <Smartphone className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-xs text-green-200/80 font-mono break-all">
                {walletAddress}
              </p>
            </div>
          )}

          {smartWalletAddress && (
            <div className="bg-black/20 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-300 font-medium">Smart Account</span>
                <Shield className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-xs text-green-200/80 font-mono break-all">
                {smartWalletAddress}
              </p>
            </div>
          )}
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
          <h3 className="font-semibold text-green-200 mb-2">🎉 What's Next?</h3>
          <p className="text-sm text-green-200/80">
            Your wallet is secure and ready for donations. You can now upload donation proofs, 
            connect with other donors, and start earning verified NFT certificates!
          </p>
        </div>
      </div>
    );
  }

  return null;
}