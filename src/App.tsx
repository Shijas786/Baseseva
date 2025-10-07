import { useState, useEffect, Suspense, useCallback, memo } from 'react';
import { SimpleOnboarding } from './components/SimpleOnboarding';
import { SimpleHomeScreen } from './components/SimpleHomeScreen';
import { DonorProfileScreen } from './components/DonorProfileScreen';
import { DonationUploadScreen } from './components/DonationUploadScreen';
import { SimpleBloodRequestFeed } from './components/SimpleBloodRequestFeed';
import { BloodBanksMap } from './components/BloodBanksMap';
import { SettingsScreen } from './components/SettingsScreen';
import { ResponsiveLayout } from './components/ResponsiveLayout';
import { DataProvider } from './components/DataContext';
import { WagmiProvider } from './components/WagmiProvider';
import { useAccount } from 'wagmi';
import { ErrorBoundary, PageLoader } from './components/LoadingStates';
import { WalletConflictResolver } from './components/WalletConflictResolver';

const AppContent = memo(() => {
  const [currentScreen, setCurrentScreen] = useState<'signup' | 'home' | 'feed' | 'map' | 'upload' | 'profile' | 'settings'>('signup');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check authentication state
        const savedSession = localStorage.getItem('baseSeva_session');
        if (savedSession || isConnected) {
          setIsLoggedIn(true);
          setCurrentScreen('home');
        }

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
          await Notification.requestPermission();
        }

        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
        }

        // Handle app shortcuts
        const urlParams = new URLSearchParams(window.location.search);
        const shortcut = urlParams.get('shortcut');
        if (shortcut && isLoggedIn) {
          switch (shortcut) {
            case 'map':
              setCurrentScreen('map');
              break;
            case 'emergency':
              setCurrentScreen('feed');
              break;
            case 'donate':
              setCurrentScreen('upload');
              break;
          }
        }

      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [isConnected, isLoggedIn]);

  // Handle app state changes
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === 'visible' && appData.isOnline) {
  //       syncData();
  //     }
  //   };

  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  //   return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  // }, [appData.isOnline, syncData]);

  const handleSignupComplete = useCallback(() => {
    setIsLoggedIn(true);
    setCurrentScreen('home');
    localStorage.setItem('baseSeva_session', 'true');
  }, []);

  const handleNavigate = useCallback((screen: string) => {
    setCurrentScreen(screen as any);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('signup');
    localStorage.removeItem('baseSeva_session');
  };


  if (isLoading) {
    return <PageLoader />;
  }

  if (!isLoggedIn) {
    return (
      <ErrorBoundary>
        <SimpleOnboarding onComplete={handleSignupComplete} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ResponsiveLayout 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate}
        networkStatus="online"
      >
        <Suspense fallback={<PageLoader />}>
          <div className="animate-fade-in">
            {currentScreen === 'home' && <SimpleHomeScreen onNavigate={handleNavigate} />}
            {currentScreen === 'feed' && <SimpleBloodRequestFeed onNavigate={handleNavigate} />}
            {currentScreen === 'map' && <BloodBanksMap onNavigate={handleNavigate} />}
            {currentScreen === 'upload' && <DonationUploadScreen onNavigate={handleNavigate} />}
            {currentScreen === 'profile' && <DonorProfileScreen onNavigate={handleNavigate} />}
            {currentScreen === 'settings' && <SettingsScreen onNavigate={handleNavigate} />}
          </div>
        </Suspense>
      </ResponsiveLayout>
    </ErrorBoundary>
  );
});

export default function App() {
  return (
    <WagmiProvider>
      <DataProvider>
        <WalletConflictResolver />
        <AppContent />
      </DataProvider>
    </WagmiProvider>
  );
}