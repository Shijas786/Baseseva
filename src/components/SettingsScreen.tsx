import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { DarkHealthBackground } from './DarkHealthBackground';
import { 
  ArrowLeft, 
  Bell, 
  Shield, 
  User, 
  MapPin, 
  Heart, 
  Moon, 
  Globe, 
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Smartphone,
  Mail,
  Lock,
  Settings,
  Eye,
  Zap,
  Download,
  Star,
  Info,
  AlertCircle,
  Check
} from 'lucide-react';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const [settings, setSettings] = useState({
    notifications: {
      emergencyAlerts: true,
      bloodRequests: true,
      donationReminders: true,
      pushNotifications: true,
      emailNotifications: false,
      smsNotifications: false
    },
    privacy: {
      shareLocation: true,
      publicProfile: false,
      shareStats: true,
      dataSaving: false
    },
    preferences: {
      darkMode: false,
      language: 'english',
      autoLocationUpdate: true,
      offlineMode: true
    }
  });

  const updateSetting = (category: keyof typeof settings, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const settingSections = [
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Manage your alert preferences',
      gradient: 'from-blue-600 to-blue-500',
      glowColor: 'bg-blue-500/20',
      items: [
        {
          key: 'emergencyAlerts',
          label: 'Emergency Alerts',
          description: 'Critical blood requests in your area',
          icon: AlertCircle,
          value: settings.notifications.emergencyAlerts,
          critical: true
        },
        {
          key: 'bloodRequests',
          label: 'Blood Requests',
          description: 'New donation requests matching your type',
          icon: Heart,
          value: settings.notifications.bloodRequests
        },
        {
          key: 'donationReminders',
          label: 'Donation Reminders',
          description: 'When you\'re eligible to donate again',
          icon: Bell,
          value: settings.notifications.donationReminders
        },
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'In-app notifications',
          icon: Smartphone,
          value: settings.notifications.pushNotifications
        },
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Email updates and newsletters',
          icon: Mail,
          value: settings.notifications.emailNotifications
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Control your data and privacy',
      gradient: 'from-green-600 to-green-500',
      glowColor: 'bg-green-500/20',
      items: [
        {
          key: 'shareLocation',
          label: 'Share Location',
          description: 'Allow location for nearby requests',
          icon: MapPin,
          value: settings.privacy.shareLocation
        },
        {
          key: 'publicProfile',
          label: 'Public Profile',
          description: 'Make your profile visible to others',
          icon: User,
          value: settings.privacy.publicProfile
        },
        {
          key: 'shareStats',
          label: 'Share Statistics',
          description: 'Contribute to community insights',
          icon: Star,
          value: settings.privacy.shareStats
        },
        {
          key: 'dataSaving',
          label: 'Data Saving Mode',
          description: 'Reduce data usage',
          icon: Download,
          value: settings.privacy.dataSaving
        }
      ]
    },
    {
      title: 'Preferences',
      icon: Settings,
      description: 'Customize your app experience',
      gradient: 'from-purple-600 to-purple-500',
      glowColor: 'bg-purple-500/20',
      items: [
        {
          key: 'darkMode',
          label: 'Dark Mode',
          description: 'Use dark theme',
          icon: Moon,
          value: settings.preferences.darkMode
        },
        {
          key: 'autoLocationUpdate',
          label: 'Auto Location Update',
          description: 'Update location automatically',
          icon: MapPin,
          value: settings.preferences.autoLocationUpdate
        },
        {
          key: 'offlineMode',
          label: 'Offline Mode',
          description: 'Save data for offline use',
          icon: Download,
          value: settings.preferences.offlineMode
        }
      ]
    }
  ];

  const actionItems = [
    {
      label: 'Account Information',
      description: 'Manage your personal details',
      icon: User,
      action: () => onNavigate('profile'),
      gradient: 'from-blue-600 to-blue-500'
    },
    {
      label: 'Help & Support',
      description: 'Get help and contact support',
      icon: HelpCircle,
      action: () => {},
      gradient: 'from-green-600 to-green-500'
    },
    {
      label: 'Privacy Policy',
      description: 'Review our privacy policy',
      icon: FileText,
      action: () => {},
      gradient: 'from-purple-600 to-purple-500'
    },
    {
      label: 'About BaseSeva',
      description: 'App version and information',
      icon: Info,
      action: () => {},
      gradient: 'from-yellow-600 to-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Beautiful Healthcare Background */}
      <DarkHealthBackground />
      
      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-red-500/20 safe-area-pt">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Button 
              variant="outline" 
              size="icon"
              className="w-10 h-10 rounded-full border-red-500/30 bg-black/20 backdrop-blur-sm text-red-300 hover:bg-red-500/10"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-red-200 text-sm">Customize your BaseSeva experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 space-y-6 max-w-4xl mx-auto">
        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => {
          const SectionIcon = section.icon;
          return (
            <div key={sectionIndex} className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5 rounded-2xl"></div>
              
              {/* Section Header */}
              <div className="relative p-6 border-b border-red-500/20">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`absolute inset-0 ${section.glowColor} rounded-xl blur-lg animate-pulse`}></div>
                    <div className={`relative w-12 h-12 bg-gradient-to-r ${section.gradient} rounded-xl flex items-center justify-center shadow-lg border border-red-400/30`}>
                      <SectionIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                    <p className="text-red-200 text-sm">{section.description}</p>
                  </div>
                </div>
              </div>

              {/* Section Items */}
              <div className="relative p-6 space-y-4">
                {section.items.map((item, itemIndex) => {
                  const ItemIcon = item.icon;
                  const category = section.title.toLowerCase().replace(' & ', '').replace(' ', '') as keyof typeof settings;
                  
                  return (
                    <div key={itemIndex} className="relative bg-black/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative w-8 h-8">
                            <ItemIcon className={`w-8 h-8 ${item.critical ? 'text-red-400' : 'text-blue-400'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{item.label}</span>
                              {item.critical && (
                                <Badge className="bg-red-500/20 text-red-400 border border-red-400/30 text-xs">
                                  <AlertCircle className="w-2 h-2 mr-1" />
                                  Critical
                                </Badge>
                              )}
                            </div>
                            <p className="text-red-200 text-sm">{item.description}</p>
                          </div>
                        </div>
                        
                        <Switch
                          checked={item.value}
                          onCheckedChange={(checked) => updateSetting(category, item.key, checked)}
                          className="data-[state=checked]:bg-red-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Action Items */}
        <div className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-purple-500/5 rounded-2xl"></div>
          
          {/* Header */}
          <div className="relative p-6 border-b border-red-500/20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-lg animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg border border-purple-400/30">
                  <Info className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Account & Support</h3>
                <p className="text-red-200 text-sm">Manage your account and get help</p>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="relative p-6 space-y-3">
            {actionItems.map((item, index) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full relative bg-black/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-4 text-left hover:border-red-400/40 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-8 h-8 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center shadow-sm border border-red-400/30`}>
                          <ItemIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="text-white font-medium group-hover:text-red-300 transition-colors">
                          {item.label}
                        </div>
                        <p className="text-red-200 text-sm">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* App Information */}
        <div className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 rounded-2xl"></div>
          <div className="relative text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-lg animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl flex items-center justify-center shadow-lg border border-red-400/30">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
            
            <h3 className="text-white font-bold text-xl mb-2">BaseSeva</h3>
            <p className="text-red-200 text-sm mb-4">Version 1.0.0 • Blockchain Blood Donation Platform</p>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-red-400 font-bold text-lg">5K+</div>
                <div className="text-red-300 text-xs">Lives Saved</div>
              </div>
              <div>
                <div className="text-red-400 font-bold text-lg">12K+</div>
                <div className="text-red-300 text-xs">Active Donors</div>
              </div>
              <div>
                <div className="text-red-400 font-bold text-lg">500+</div>
                <div className="text-red-300 text-xs">Hospitals</div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="relative bg-gradient-to-r from-red-500/20 to-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-6 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-500/10 rounded-2xl blur-sm"></div>
          <div className="relative">
            <Button 
              onClick={() => {
                localStorage.removeItem('baseSeva_session');
                onNavigate('signup');
              }}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border border-red-400/30 flex items-center justify-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </Button>
            
            <p className="text-red-200 text-center text-xs mt-3">
              You'll be asked to sign in again next time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}