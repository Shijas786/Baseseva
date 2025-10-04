import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  AlertTriangle, 
  Droplets, 
  MapPin, 
  Clock, 
  Phone, 
  Navigation,
  X,
  Heart,
  Share2
} from 'lucide-react';

interface EmergencyAlert {
  id: string;
  bloodType: string;
  unitsNeeded: number;
  hospital: string;
  location: string;
  contactPhone: string;
  timeRemaining: string;
  distance: string;
  severity: 'critical' | 'urgent' | 'moderate';
  description: string;
  coordinates: { lat: number; lng: number };
}

interface EmergencyAlertSystemProps {
  onNavigate: (screen: string) => void;
}

export function EmergencyAlertSystem({ onNavigate }: EmergencyAlertSystemProps) {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock emergency alerts
  useEffect(() => {
    const mockAlerts: EmergencyAlert[] = [
      {
        id: '1',
        bloodType: 'O-',
        unitsNeeded: 5,
        hospital: 'Medical College Hospital',
        location: 'Thiruvananthapuram',
        contactPhone: '+91 471 2524251',
        timeRemaining: '2 hours',
        distance: '3.2 km',
        severity: 'critical',
        description: 'Emergency surgery patient needs immediate O- blood. Life-threatening situation.',
        coordinates: { lat: 8.5241, lng: 76.9366 }
      },
      {
        id: '2',
        bloodType: 'A+',
        unitsNeeded: 3,
        hospital: 'KIMS Hospital',
        location: 'Thiruvananthapuram',
        contactPhone: '+91 471 3041000',
        timeRemaining: '6 hours',
        distance: '5.8 km',
        severity: 'urgent',
        description: 'Post-operative patient requires A+ blood for recovery.',
        coordinates: { lat: 8.4875, lng: 76.9525 }
      },
      {
        id: '3',
        bloodType: 'B+',
        unitsNeeded: 2,
        hospital: 'IMA Blood Bank',
        location: 'Kochi',
        contactPhone: '+91 484 2345678',
        timeRemaining: '12 hours',
        distance: '195 km',
        severity: 'moderate',
        description: 'Regular patient requires B+ blood for scheduled procedure.',
        coordinates: { lat: 9.9312, lng: 76.2673 }
      }
    ];

    setAlerts(mockAlerts);

    // Auto-show critical alerts
    const criticalAlerts = mockAlerts.filter(alert => alert.severity === 'critical');
    if (criticalAlerts.length > 0) {
      setShowAlerts(true);
      
      // Send push notification for critical alerts
      if ('Notification' in window && Notification.permission === 'granted') {
        criticalAlerts.forEach(alert => {
          new Notification(`CRITICAL: ${alert.bloodType} Blood Needed`, {
            body: `${alert.hospital} - ${alert.timeRemaining} remaining`,
            icon: '/icon-192x192.png',
            tag: alert.id,
            requireInteraction: true,
            actions: [
              { action: 'respond', title: 'I can help' },
              { action: 'share', title: 'Share alert' }
            ]
          });
        });
      }
    }
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 border-red-500 text-white';
      case 'urgent': return 'bg-orange-500 border-orange-500 text-white';
      case 'moderate': return 'bg-blue-500 border-blue-500 text-white';
      default: return 'bg-gray-500 border-gray-500 text-white';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical': return 'CRITICAL';
      case 'urgent': return 'URGENT';
      case 'moderate': return 'MODERATE';
      default: return 'ALERT';
    }
  };

  const handleRespond = (alert: EmergencyAlert) => {
    // In a real app, this would contact the hospital or add user to responder list
    alert(`Thank you for responding to the ${alert.bloodType} blood request at ${alert.hospital}. You will be contacted shortly.`);
    
    // Navigate to map or contact
    onNavigate('map');
  };

  const handleShare = (alert: EmergencyAlert) => {
    if (navigator.share) {
      navigator.share({
        title: `URGENT: ${alert.bloodType} Blood Needed`,
        text: `${alert.hospital} urgently needs ${alert.unitsNeeded} units of ${alert.bloodType} blood. ${alert.description}`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      const shareText = `🚨 URGENT BLOOD NEEDED 🚨\n\nBlood Type: ${alert.bloodType}\nUnits: ${alert.unitsNeeded}\nHospital: ${alert.hospital}\nLocation: ${alert.location}\nTime: ${alert.timeRemaining} remaining\n\nHelp save a life! Download BaseSeva app.`;
      navigator.clipboard.writeText(shareText);
      alert('Alert details copied to clipboard!');
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleDirections = (coordinates: { lat: number; lng: number }) => {
    // Open in maps app
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Emergency Alert Banner */}
      {alerts.filter(alert => alert.severity === 'critical').length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span className="font-semibold">CRITICAL BLOOD ALERT</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAlerts(true)}
              className="text-white hover:bg-red-700"
            >
              View Details
            </Button>
          </div>
        </div>
      )}

      {/* Emergency Alerts Modal */}
      {showAlerts && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  Emergency Blood Alerts
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAlerts(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity).replace('bg-', 'border-l-')}`}>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {getSeverityText(alert.severity)}
                        </Badge>
                        <h3 className="font-semibold text-lg mt-2 text-gray-900 dark:text-white">
                          {alert.bloodType} Blood Needed
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">
                          {alert.unitsNeeded}
                        </div>
                        <div className="text-xs text-gray-500">units</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {alert.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">{alert.hospital}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">{alert.location}</span>
                        <Badge variant="outline" className="ml-auto">{alert.distance}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">Time remaining: {alert.timeRemaining}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">{alert.contactPhone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        onClick={() => handleRespond(alert)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        I Can Help
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleShare(alert)}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleCall(alert.contactPhone)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleDirections(alert.coordinates)}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowAlerts(false)}
              >
                Close Alerts
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}