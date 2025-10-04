import { useState, useEffect } from 'react';
import { useIsMobile, useIsDesktop } from './hooks/useMediaQuery';
import { BottomNavigation } from './BottomNavigation';
import { 
  Home, 
  Activity, 
  Upload, 
  User, 
  Map, 
  Settings,
  Heart,
  Bell,
  Menu,
  X
} from 'lucide-react';

interface ResponsiveLayoutProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  children: React.ReactNode;
  networkStatus?: 'online' | 'offline' | 'slow';
}

export function ResponsiveLayout({ 
  currentScreen, 
  onNavigate, 
  children, 
  networkStatus 
}: ResponsiveLayoutProps) {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { 
      id: 'home', 
      icon: Home, 
      label: 'Home', 
      description: 'Dashboard and overview',
      color: 'text-blue-600' 
    },
    { 
      id: 'feed', 
      icon: Activity, 
      label: 'Requests', 
      description: 'Blood donation requests',
      color: 'text-red-600' 
    },
    { 
      id: 'upload', 
      icon: Upload, 
      label: 'Record', 
      description: 'Upload donation proof',
      color: 'text-green-600' 
    },
    { 
      id: 'map', 
      icon: Map, 
      label: 'Blood Banks', 
      description: 'Find nearby centers',
      color: 'text-purple-600' 
    },
    { 
      id: 'profile', 
      icon: User, 
      label: 'Profile', 
      description: 'Your donor profile',
      color: 'text-orange-600' 
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings', 
      description: 'App preferences',
      color: 'text-gray-600' 
    }
  ];

  // Close sidebar on route change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [currentScreen]);

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg z-40 flex flex-col">
      {/* Logo Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blood to-blood-dark rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">BaseSeva</h1>
            <p className="text-sm text-gray-500">Blood Donation Network</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                isActive
                  ? 'bg-blood text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blood'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
              <div className="flex-1">
                <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                  {item.label}
                </p>
                <p className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blood-light/20 to-blood-light/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-blood" />
            <span className="text-sm font-medium text-gray-900">Lives Saved</span>
          </div>
          <p className="text-2xl font-bold text-blood">12+</p>
          <p className="text-xs text-gray-500">Through your donations</p>
        </div>
      </div>
    </div>
  );

  // Mobile Header Component
  const MobileHeader = () => (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 safe-top z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center touch-friendly"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">BaseSeva</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center touch-friendly">
            <Bell className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-xl bg-blood flex items-center justify-center touch-friendly"
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar Overlay
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 safe-top">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blood to-blood-dark rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BaseSeva</h1>
              <p className="text-sm text-gray-500">Blood Donation Network</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center touch-friendly"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 text-left touch-friendly ${
                  isActive
                    ? 'bg-blood text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : item.color}`} />
                <div className="flex-1">
                  <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {item.label}
                  </p>
                  <p className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 safe-bottom">
          <div className="bg-gradient-to-r from-blood-light/20 to-blood-light/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-blood" />
              <span className="text-base font-medium text-gray-900">Lives Saved</span>
            </div>
            <p className="text-3xl font-bold text-blood">12+</p>
            <p className="text-sm text-gray-500">Through your donations</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Network Status Banner */}
      {networkStatus === 'offline' && (
        <div className="fixed top-0 left-0 right-0 bg-warning text-white text-center py-2 text-sm z-50">
          You're offline. Some features may be limited.
        </div>
      )}

      {/* Desktop Layout */}
      {isDesktop && (
        <>
          <DesktopSidebar />
          <div className="ml-64">
            <main className={`min-h-screen ${networkStatus === 'offline' ? 'pt-10' : ''}`}>
              {children}
            </main>
          </div>
        </>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <>
          <MobileHeader />
          <MobileSidebar />
          <main className={`pt-16 pb-20 ${networkStatus === 'offline' ? 'pt-24' : ''}`}>
            {children}
          </main>
          <BottomNavigation activeScreen={currentScreen} onNavigate={onNavigate} />
        </>
      )}

      {/* Tablet Layout (hybrid approach) */}
      {!isMobile && !isDesktop && (
        <>
          <MobileHeader />
          <MobileSidebar />
          <main className={`pt-16 pb-20 ${networkStatus === 'offline' ? 'pt-24' : ''}`}>
            <div className="max-w-4xl mx-auto px-6">
              {children}
            </div>
          </main>
          <BottomNavigation activeScreen={currentScreen} onNavigate={onNavigate} />
        </>
      )}

      {/* Development Helper - Floating Signup Access Button */}
      <button
        onClick={() => {
          localStorage.removeItem('baseSeva_session');
          window.location.reload();
        }}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center font-bold text-xs"
        title="Reset to Signup Screen"
      >
        🚀
      </button>
    </div>
  );
}