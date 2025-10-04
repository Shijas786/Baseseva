import { usePrivyAuth } from './hooks/usePrivyAuth';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Copy, ExternalLink, Wallet, Shield, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface WalletInfoProps {
  className?: string;
  showActions?: boolean;
}

export function WalletInfo({ className = '', showActions = true }: WalletInfoProps) {
  const { 
    walletAddress, 
    smartWalletAddress, 
    hasWallet, 
    hasSmartWallet, 
    user,
    logout 
  } = usePrivyAuth();
  
  const [showFullAddresses, setShowFullAddresses] = useState(false);

  const truncateAddress = (address: string) => {
    if (!address) return '';
    if (showFullAddresses) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy address');
    }
  };

  const openInExplorer = (address: string) => {
    // Open in Base explorer
    window.open(`https://basescan.org/address/${address}`, '_blank');
  };

  if (!hasWallet && !hasSmartWallet) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="font-semibold text-gray-600 mb-2">No Wallet Connected</h3>
        <p className="text-sm text-gray-500">Complete the signup process to create your secure wallet.</p>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* User Info */}
      {user && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Account</h3>
              <p className="text-sm text-gray-600">{user.email?.address || user.phone?.number || 'Anonymous'}</p>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-700">
              Verified
            </Badge>
          </div>
        </Card>
      )}

      {/* Embedded Wallet */}
      {hasWallet && walletAddress && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Embedded Wallet</h3>
            </div>
            <Badge variant="outline" className="border-blue-200 text-blue-700">
              Active
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Address</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullAddresses(!showFullAddresses)}
                    className="h-6 px-2"
                  >
                    {showFullAddresses ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  {showActions && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(walletAddress, 'Embedded wallet address')}
                        className="h-6 px-2"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openInExplorer(walletAddress)}
                        className="h-6 px-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <p className="font-mono text-sm text-gray-700 break-all">
                {truncateAddress(walletAddress)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Smart Wallet */}
      {hasSmartWallet && smartWalletAddress && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-800">Smart Account</h3>
            </div>
            <Badge variant="outline" className="border-purple-200 text-purple-700">
              Enhanced
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Address</span>
                <div className="flex items-center gap-1">
                  {showActions && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(smartWalletAddress, 'Smart wallet address')}
                        className="h-6 px-2"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openInExplorer(smartWalletAddress)}
                        className="h-6 px-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <p className="font-mono text-sm text-gray-700 break-all">
                {truncateAddress(smartWalletAddress)}
              </p>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>✨ Gasless transactions enabled</p>
              <p>🔒 Enhanced security features</p>
              <p>🚀 Advanced DeFi compatibility</p>
            </div>
          </div>
        </Card>
      )}

      {/* Actions */}
      {showActions && (
        <Card className="p-4">
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={logout}
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}