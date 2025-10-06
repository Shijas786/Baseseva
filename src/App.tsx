import { useState, useEffect, Suspense } from 'react';
import { SimpleOnboarding } from './components/SimpleOnboarding';
import { MobileTest } from './components/MobileTest';
import { HomeScreen } from './components/CleanHomeScreen';
import { DonorProfileScreen } from './components/DonorProfileScreen';
import { DonationUploadScreen } from './components/DonationUploadScreen';
import { BloodRequestFeed } from './components/BloodRequestFeed';
import { BloodBanksMap } from './components/BloodBanksMap';
import { SettingsScreen } from './components/SettingsScreen';
import { ResponsiveLayout } from './components/ResponsiveLayout';
import { DataProvider, useData } from './components/DataContext';
import { PrivyProvider } from './components/PrivyProvider';
import { usePrivyAuth } from './components/hooks/usePrivyAuth';
import { ErrorBoundary, PageLoader } from './components/LoadingStates';
import { WalletConflictResolver } from './components/WalletConflictResolver';
import { MobileDebugger } from './components/MobileDebugger';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<'signup' | 'home' | 'feed' | 'map' | 'upload' | 'profile' | 'settings'>('signup');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { appData, syncData } = useData();
  const { isAuthenticated, ready, hasWallet, hasSmartWallet } = usePrivyAuth();

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Wait for Privy to be ready
        if (!ready) return;

        // Check authentication state (more permissive in development)
        const savedSession = localStorage.getItem('baseSeva_session');
        if (savedSession) {
          setIsLoggedIn(true);
          setCurrentScreen('home');
        }
        
        // In production with real Privy:
        // if (isAuthenticated && hasWallet && hasSmartWallet) {
        //   setIsLoggedIn(true);
        //   setCurrentScreen('home');
        //   localStorage.setItem('baseSeva_session', 'true');
        // }

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

        // Sync data if online
        if (appData.isOnline) {
          await syncData();
        }

      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [ready, isAuthenticated, hasWallet, hasSmartWallet]);

  // Handle app state changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && appData.isOnline) {
        syncData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [appData.isOnline, syncData]);

  const handleSignupComplete = () => {
    // In mock mode, allow completion without full wallet setup
    // In production, this would require: isAuthenticated && hasWallet && hasSmartWallet
    setIsLoggedIn(true);
    setCurrentScreen('home');
    localStorage.setItem('baseSeva_session', 'true');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as any);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('signup');
    localStorage.removeItem('baseSeva_session');
  };

  // Add development helper to reset to signup
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Press 'R' + 'S' to reset to signup screen (for testing)
      if (e.key === 'R' && e.shiftKey && e.ctrlKey) {
        localStorage.removeItem('baseSeva_session');
        setIsLoggedIn(false);
        setCurrentScreen('signup');
        console.log('Reset to signup screen');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isLoggedIn) {
    return (
      <ErrorBoundary>
        <MobileTest />
        <MobileDebugger />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ResponsiveLayout 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate}
        networkStatus={appData.networkStatus}
      >
        <Suspense fallback={<PageLoader />}>
          <div className="animate-fade-in">
            {currentScreen === 'home' && <HomeScreen onNavigate={handleNavigate} />}
            {currentScreen === 'feed' && <BloodRequestFeed onNavigate={handleNavigate} />}
            {currentScreen === 'map' && <BloodBanksMap onNavigate={handleNavigate} />}
            {currentScreen === 'upload' && <DonationUploadScreen onNavigate={handleNavigate} />}
            {currentScreen === 'profile' && <DonorProfileScreen onNavigate={handleNavigate} />}
            {currentScreen === 'settings' && <SettingsScreen onNavigate={handleNavigate} />}
          </div>
        </Suspense>
      </ResponsiveLayout>
      <MobileDebugger />
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <PrivyProvider>
      <DataProvider>
        <WalletConflictResolver />
        <AppContent />
      </DataProvider>
    </PrivyProvider>
  );
}