import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { NotificationCard } from './ui/modern-cards';
import { Bell, X, Droplets, MapPin, Clock, Heart, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'blood_request' | 'donation_reminder' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  location?: string;
  bloodType?: string;
}

interface NotificationSystemProps {
  onNavigate: (screen: string) => void;
}

export function NotificationSystem({ onNavigate }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '2',
        type: 'blood_request',
        title: 'Blood Request Near You',
        message: 'Someone needs B+ blood within 5km of your location.',
        timestamp: '15 min ago',
        isRead: false,
        priority: 'medium',
        location: 'Kochi',
        bloodType: 'B+'
      },
      {
        id: '3',
        type: 'donation_reminder',
        title: 'Ready to Donate Again!',
        message: 'Your 3-month wait period is complete. Schedule your next donation.',
        timestamp: '1 hour ago',
        isRead: false,
        priority: 'medium'
      },
      {
        id: '4',
        type: 'success',
        title: 'Donation Successful!',
        message: 'Your blood donation at KIMS Hospital has been verified. NFT certificate generated.',
        timestamp: '1 day ago',
        isRead: true,
        priority: 'low'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Send push notification for important alerts
  const sendPushNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: notification.id,
        requireInteraction: false
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => prev - 1);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-blue-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blood_request': return Droplets;
      case 'donation_reminder': return Clock;
      case 'success': return Heart;
      default: return Bell;
    }
  };

  return (
    <>
      {/* Clean Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-blood text-white rounded-full border-2 border-background font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>
      </div>

      {/* Clean Notification Panel */}
      {showNotifications && (
        <div className="fixed top-20 right-4 w-80 max-h-96 surface-elevated border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-primary">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 interactive rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4 text-secondary" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto p-3">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-tertiary mx-auto mb-4" />
                <p className="text-secondary">No notifications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => {
                  const Icon = getTypeIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 interactive rounded-lg border transition-all duration-200 ${
                        !notification.isRead ? 'bg-info-light border-info/20' : 'border-border'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-primary text-sm truncate">{notification.title}</h4>
                          <p className="text-secondary text-sm mt-1">{notification.message}</p>
                          
                          <div className="flex items-center gap-2 mt-2 text-xs text-tertiary">
                            <span>{notification.timestamp}</span>
                            {notification.location && (
                              <>
                                <span>•</span>
                                <span>{notification.location}</span>
                              </>
                            )}
                            {notification.bloodType && (
                              <span className="badge-blood ml-2">
                                {notification.bloodType}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 interactive rounded-md"
                        >
                          <X className="w-3 h-3 text-tertiary" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-border">
              <button
                className="w-full btn-secondary text-sm"
                onClick={() => {
                  setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                  setUnreadCount(0);
                }}
              >
                Mark All as Read
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}