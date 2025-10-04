import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { AlertCircle, Wifi, WifiOff, RefreshCcw, Heart } from 'lucide-react';

// Loading Spinner Component
export function LoadingSpinner({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <div className="w-full h-full border-2 border-red-500 border-t-transparent rounded-full"></div>
    </div>
  );
}

// Blood Drop Loading Animation
export function BloodDropLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <Heart className="w-12 h-12 text-red-500 animate-pulse" />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-4 bg-red-500 rounded-full animate-bounce"></div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-4 animate-pulse">Loading...</p>
    </div>
  );
}

// Page Loading Screen
export function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-red-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center animate-pulse">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">BaseSeva</h1>
        <p className="text-blue-200 mb-6">Loading your blood donation network...</p>
        <LoadingSpinner size="lg" />
      </div>
    </div>
  );
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </Card>
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </Card>
  );
}

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('BaseSeva Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || ErrorFallback;
      return <Fallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Error Fallback Component
export function ErrorFallback({ error, onRetry }: { error?: Error; onRetry?: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="space-y-3">
          <Button 
            onClick={onRetry || (() => window.location.reload())}
            className="w-full"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Go to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Network Status Indicator
export function NetworkStatus({ isOnline, networkStatus }: { 
  isOnline: boolean; 
  networkStatus: 'online' | 'offline' | 'slow' 
}) {
  if (isOnline && networkStatus !== 'slow') return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-2 text-center text-sm ${
      networkStatus === 'offline' 
        ? 'bg-red-500 text-white' 
        : 'bg-yellow-500 text-black'
    }`}>
      <div className="flex items-center justify-center gap-2">
        {networkStatus === 'offline' ? (
          <>
            <WifiOff className="w-4 h-4" />
            You're offline. Some features may not work.
          </>
        ) : (
          <>
            <Wifi className="w-4 h-4" />
            Slow connection detected. Loading may take longer.
          </>
        )}
      </div>
    </div>
  );
}

// Empty State Component
export function EmptyState({ 
  icon: Icon = Heart,
  title,
  description,
  action
}: {
  icon?: React.ComponentType<any>;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  );
}

// Retry Component
export function RetryButton({ onRetry, isLoading }: { 
  onRetry: () => void; 
  isLoading?: boolean 
}) {
  return (
    <Button 
      onClick={onRetry} 
      disabled={isLoading}
      variant="outline"
      className="w-full"
    >
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <RefreshCcw className="w-4 h-4 mr-2" />
      )}
      Try Again
    </Button>
  );
}

// Offline Notice
export function OfflineNotice() {
  return (
    <Card className="border-yellow-200 bg-yellow-50 p-4 mb-4">
      <div className="flex items-start gap-3">
        <WifiOff className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-yellow-800">You're currently offline</h4>
          <p className="text-sm text-yellow-700 mt-1">
            Some features may not be available. You'll automatically reconnect when your internet connection is restored.
          </p>
        </div>
      </div>
    </Card>
  );
}