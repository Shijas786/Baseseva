import { Alert, AlertDescription } from './ui/alert';
import { Info } from 'lucide-react';
import { isDevelopment } from '../utils/env';

export function MockWalletNotice() {
  // Only show in development mode
  if (!isDevelopment) return null;

  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Demo Mode:</strong> Using mock wallet system with simulated addresses. 
        Real blockchain integration will be available when Privy is configured. 
        Check the browser console for creation logs.
      </AlertDescription>
    </Alert>
  );
}