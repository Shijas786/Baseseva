import { memo, useCallback } from 'react';
import { Home, User, Upload, Activity } from 'lucide-react';

interface BottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'feed', icon: Activity, label: 'Request' },
  { id: 'upload', icon: Upload, label: 'Record' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export const BottomNavigation = memo(({ activeScreen, onNavigate }: BottomNavigationProps) => {
  const handleClick = useCallback((screenId: string) => {
    if (activeScreen !== screenId) {
      onNavigate(screenId);
    }
  }, [activeScreen, onNavigate]);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom shadow-lg z-50">
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              disabled={isActive}
              className={`flex flex-col items-center py-2 px-2 rounded-lg min-w-0 flex-1 max-w-[80px] touch-manipulation ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-600 active:bg-gray-100'
              }`}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <Icon className="w-5 h-5 mb-1 flex-shrink-0" />
              <span className={`text-xs text-center ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});