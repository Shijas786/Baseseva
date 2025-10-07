import { useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import { useEffect } from 'react';

export function WalletInfo() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  // Auto-switch to Base network
  useEffect(() => {
    const switchToBase = async () => {
      if (chainId !== base.id && isConnected) {
        try {
          await switchChainAsync({ chainId: base.id });
        } catch (error) {
          console.error('Failed to switch to Base:', error);
        }
      }
    };
    switchToBase();
  }, [chainId, switchChainAsync, isConnected]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-gray-600">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </div>
      <button
        onClick={() => disconnect()}
        className="text-xs text-red-600 hover:text-red-700"
      >
        Disconnect
      </button>
    </div>
  );
}
