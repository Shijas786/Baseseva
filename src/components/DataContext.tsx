import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User, BloodRequest, Donation, BloodBank, AppNotification } from '../services/api';

interface UserData extends User {
  // Additional frontend-specific fields can be added here
}

interface AppData {
  isOnline: boolean;
  lastSync: string | null;
  networkStatus: 'online' | 'offline' | 'slow';
  location: { lat: number; lng: number } | null;
  locationPermission: 'granted' | 'denied' | 'prompt';
  notificationPermission: 'granted' | 'denied' | 'default';
}

interface DataContextType {
  user: UserData | null;
  appData: AppData;
  bloodRequests: BloodRequest[];
  donations: Donation[];
  bloodBanks: BloodBank[];
  notifications: AppNotification[];
  updateUser: (data: Partial<UserData>) => void;
  updateAppData: (data: Partial<AppData>) => void;
  syncData: () => Promise<void>;
  clearUserData: () => void;
  // API methods
  loginUser: (walletAddress: string, userData?: Partial<UserData>) => Promise<boolean>;
  createBloodRequest: (requestData: any) => Promise<boolean>;
  createDonation: (donationData: any) => Promise<boolean>;
  uploadCertificate: (file: File, donationId?: string) => Promise<string | null>;
  refreshBloodRequests: () => Promise<void>;
  refreshDonations: () => Promise<void>;
  refreshBloodBanks: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [appData, setAppData] = useState<AppData>({
    isOnline: navigator.onLine,
    lastSync: null,
    networkStatus: navigator.onLine ? 'online' : 'offline',
    location: null,
    locationPermission: 'prompt',
    notificationPermission: 'default'
  });

  // Initialize user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('baseSeva_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('baseSeva_user');
      }
    }

    const savedAppData = localStorage.getItem('baseSeva_appData');
    if (savedAppData) {
      try {
        const parsed = JSON.parse(savedAppData);
        setAppData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading app data:', error);
      }
    }
  }, []);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setAppData(prev => ({ 
        ...prev, 
        isOnline: true, 
        networkStatus: 'online' 
      }));
      // Auto-sync when coming back online
      syncData();
    };

    const handleOffline = () => {
      setAppData(prev => ({ 
        ...prev, 
        isOnline: false, 
        networkStatus: 'offline' 
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        setAppData(prev => ({ ...prev, networkStatus: 'slow' }));
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get user location
  useEffect(() => {
    if (appData.locationPermission === 'prompt') {
      // Check if geolocation is available and not blocked by permissions policy
      if ('geolocation' in navigator && 'permissions' in navigator) {
        // Check permissions policy first
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'denied') {
            console.log('Geolocation denied by permissions policy');
            setAppData(prev => ({
              ...prev,
              locationPermission: 'denied'
            }));
            return;
          }
          
          // Try to get location
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setAppData(prev => ({
                ...prev,
                location: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                },
                locationPermission: 'granted'
              }));
            },
            (error) => {
              // Only log if it's not a common permission error
              if (error.code !== error.PERMISSION_DENIED) {
                console.log('Geolocation error:', error.message);
              }
              setAppData(prev => ({
                ...prev,
                locationPermission: 'denied'
              }));
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000
            }
          );
        }).catch((error) => {
          console.log('Permissions API not supported:', error);
          setAppData(prev => ({
            ...prev,
            locationPermission: 'denied'
          }));
        });
      } else if ('geolocation' in navigator) {
        // Fallback for browsers without permissions API
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setAppData(prev => ({
              ...prev,
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              },
              locationPermission: 'granted'
            }));
          },
          (error) => {
            // Only log if it's not a common permission error
            if (error.code !== error.PERMISSION_DENIED) {
              console.log('Geolocation fallback error:', error.message);
            }
            setAppData(prev => ({
              ...prev,
              locationPermission: 'denied'
            }));
          }
        );
      } else {
        console.log('Geolocation not supported');
        setAppData(prev => ({
          ...prev,
          locationPermission: 'denied'
        }));
      }
    }
  }, [appData.locationPermission]);

  // Check notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setAppData(prev => ({
        ...prev,
        notificationPermission: Notification.permission
      }));
    }
  }, []);

  const updateUser = (data: Partial<UserData>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('baseSeva_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateAppData = (data: Partial<AppData>) => {
    setAppData(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem('baseSeva_appData', JSON.stringify(updated));
      return updated;
    });
  };

  const syncData = async () => {
    if (!appData.isOnline || !user) return;

    try {
      console.log('Syncing data with server...');
      
      // Sync all data in parallel
      await Promise.all([
        refreshBloodRequests(),
        refreshDonations(),
        refreshBloodBanks(),
        refreshNotifications()
      ]);
      
      updateAppData({ 
        lastSync: new Date().toISOString() 
      });
      
      console.log('Data sync completed');
    } catch (error) {
      console.error('Data sync failed:', error);
    }
  };

  // API Methods
  const loginUser = async (walletAddress: string, userData?: Partial<UserData>): Promise<boolean> => {
    try {
      const response = await api.auth.login({
        walletAddress,
        ...userData
      });

      if (response.success && response.data) {
        setUser(response.data.user);
        localStorage.setItem('baseSeva_user', JSON.stringify(response.data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const createBloodRequest = async (requestData: any): Promise<boolean> => {
    try {
      if (!user) return false;

      const response = await api.bloodRequests.createRequest({
        ...requestData,
        walletAddress: user.wallet_address
      });

      if (response.success) {
        await refreshBloodRequests();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Create blood request failed:', error);
      return false;
    }
  };

  const createDonation = async (donationData: any): Promise<boolean> => {
    try {
      if (!user) return false;

      const response = await api.donations.createDonation({
        ...donationData,
        walletAddress: user.wallet_address
      });

      if (response.success) {
        await refreshDonations();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Create donation failed:', error);
      return false;
    }
  };

  const uploadCertificate = async (file: File, donationId?: string): Promise<string | null> => {
    try {
      if (!user) return null;

      const response = await api.upload.uploadCertificate(file, user.wallet_address, donationId);

      if (response.success && response.data) {
        return response.data.publicUrl;
      }
      return null;
    } catch (error) {
      console.error('Upload certificate failed:', error);
      return null;
    }
  };

  const refreshBloodRequests = async (): Promise<void> => {
    try {
      const response = await api.bloodRequests.getRequests({
        bloodType: user?.blood_type,
        lat: appData.location?.lat,
        lng: appData.location?.lng,
        radius: 50
      });

      if (response.success && response.data) {
        setBloodRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Refresh blood requests failed:', error);
    }
  };

  const refreshDonations = async (): Promise<void> => {
    try {
      if (!user) return;

      const response = await api.donations.getUserDonations(user.wallet_address);

      if (response.success && response.data) {
        setDonations(response.data.donations);
      }
    } catch (error) {
      console.error('Refresh donations failed:', error);
    }
  };

  const refreshBloodBanks = async (): Promise<void> => {
    try {
      const response = await api.bloodBanks.getBloodBanks({
        lat: appData.location?.lat,
        lng: appData.location?.lng,
        radius: 50
      });

      if (response.success && response.data) {
        setBloodBanks(response.data.bloodBanks);
      }
    } catch (error) {
      console.error('Refresh blood banks failed:', error);
    }
  };

  const refreshNotifications = async (): Promise<void> => {
    try {
      if (!user) return;

      const response = await api.notifications.getUserNotifications(user.wallet_address);

      if (response.success && response.data) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Refresh notifications failed:', error);
    }
  };

  const clearUserData = () => {
    setUser(null);
    localStorage.removeItem('baseSeva_user');
    localStorage.removeItem('baseSeva_appData');
  };

  // Auto-sync periodically when online
  useEffect(() => {
    if (appData.isOnline) {
      const interval = setInterval(syncData, 5 * 60 * 1000); // Every 5 minutes
      return () => clearInterval(interval);
    }
  }, [appData.isOnline]);

  return (
    <DataContext.Provider value={{
      user,
      appData,
      bloodRequests,
      donations,
      bloodBanks,
      notifications,
      updateUser,
      updateAppData,
      syncData,
      clearUserData,
      loginUser,
      createBloodRequest,
      createDonation,
      uploadCertificate,
      refreshBloodRequests,
      refreshDonations,
      refreshBloodBanks,
      refreshNotifications
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Utility hooks
export function useOnlineStatus() {
  const { appData } = useData();
  return appData.isOnline;
}

export function useUserLocation() {
  const { appData } = useData();
  return appData.location;
}

export function useUser() {
  const { user, updateUser } = useData();
  return { user, updateUser };
}