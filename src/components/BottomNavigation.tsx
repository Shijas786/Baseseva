import { Home, User, Upload, Map, Activity } from 'lucide-react';

interface BottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNavigation({ activeScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'feed', icon: Activity, label: 'Request' },
    { id: 'upload', icon: Upload, label: 'Record onchain' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 safe-bottom shadow-lg z-50">
      <div className="flex justify-around items-center py-1 md:py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-2 md:py-3 px-2 md:px-4 rounded-xl transition-all duration-200 touch-friendly min-w-0 flex-1 max-w-[80px] ${
                isActive 
                  ? 'bg-blood text-white shadow-md' 
                  : 'text-gray-600 hover:text-blood hover:bg-gray-50 active:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6 mb-0.5 md:mb-1 flex-shrink-0" />
              <span className={`text-xs leading-tight text-center ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}