import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DarkHealthBackground } from './DarkHealthBackground';
import { 
  MapPin, Phone, Navigation, Clock, Droplets, ArrowLeft, Search, Filter,
  Star, Shield, AlertCircle, Check, Heart, Zap, Users, Target, Info,
  RefreshCw, Locate, Route, Building2, Globe
} from 'lucide-react';

interface BloodBanksMapProps {
  onNavigate: (screen: string) => void;
}

interface BloodBank {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  openHours: string;
  bloodTypes: string[];
  status: 'open' | 'closing_soon' | 'closed';
  coordinates: { lat: number; lng: number };
  rating?: number;
  verified?: boolean;
  emergency?: boolean;
  inventory?: { [key: string]: 'high' | 'medium' | 'low' | 'critical' };
}

export function BloodBanksMap({ onNavigate }: BloodBanksMapProps) {
  const [selectedBank, setSelectedBank] = useState<BloodBank | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [sortedBanks, setSortedBanks] = useState<BloodBank[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'emergency' | 'verified'>('all');
  const [isLocating, setIsLocating] = useState(false);

  const bloodBanks: BloodBank[] = [
    {
      id: '1',
      name: 'Kerala State Blood Transfusion Council',
      address: 'Medical College Campus, Thiruvananthapuram, Kerala 695011',
      phone: '+91 471 2524251',
      distance: '0.5 km',
      openHours: '24 Hours',
      bloodTypes: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      status: 'open',
      coordinates: { lat: 8.5241, lng: 76.9366 },
      rating: 4.8,
      verified: true,
      emergency: true,
      inventory: {
        'O+': 'high',
        'O-': 'medium',
        'A+': 'high',
        'A-': 'low',
        'B+': 'medium',
        'B-': 'critical',
        'AB+': 'low',
        'AB-': 'critical'
      }
    },
    {
      id: '2',
      name: 'IMA Blood Bank - Kochi',
      address: 'IMA House, Kaloor, Ernakulam, Kochi, Kerala 682017',
      phone: '+91 484 2345678',
      distance: '1.2 km',
      openHours: '6:00 AM - 10:00 PM',
      bloodTypes: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      status: 'open',
      coordinates: { lat: 9.9312, lng: 76.2673 },
      rating: 4.6,
      verified: true,
      emergency: false,
      inventory: {
        'O+': 'medium',
        'O-': 'low',
        'A+': 'high',
        'A-': 'medium',
        'B+': 'high',
        'B-': 'low',
        'AB+': 'medium',
        'AB-': 'low'
      }
    },
    {
      id: '3',
      name: 'Kozhikode Medical College Blood Bank',
      address: 'Medical College, Kozhikode, Kerala 673008',
      phone: '+91 495 2359126',
      distance: '2.8 km',
      openHours: '8:00 AM - 8:00 PM',
      bloodTypes: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      status: 'closing_soon',
      coordinates: { lat: 11.2588, lng: 75.7804 },
      rating: 4.4,
      verified: true,
      emergency: false,
      inventory: {
        'O+': 'high',
        'O-': 'critical',
        'A+': 'medium',
        'A-': 'low',
        'B+': 'medium',
        'B-': 'critical',
        'AB+': 'low',
        'AB-': 'critical'
      }
    },
    {
      id: '4',
      name: 'Thrissur District Hospital Blood Bank',
      address: 'District Hospital, Thrissur, Kerala 680001',
      phone: '+91 487 2420001',
      distance: '3.5 km',
      openHours: '24 Hours',
      bloodTypes: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      status: 'open',
      coordinates: { lat: 10.5276, lng: 76.2144 },
      rating: 4.2,
      verified: true,
      emergency: true,
      inventory: {
        'O+': 'medium',
        'O-': 'low',
        'A+': 'high',
        'A-': 'medium',
        'B+': 'high',
        'B-': 'medium',
        'AB+': 'low',
        'AB-': 'low'
      }
    }
  ];

  useEffect(() => {
    requestLocation();
    setSortedBanks(bloodBanks);
  }, []);

  const requestLocation = async () => {
    setIsLocating(true);
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      setLocationPermission(permission.state);
      
      if (permission.state === 'granted' || permission.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setLocationPermission('granted');
          },
          (error) => {
            console.error('Error getting location:', error);
            setLocationPermission('denied');
          }
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationPermission('denied');
    } finally {
      setIsLocating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'closing_soon': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'closed': return 'bg-red-500/20 text-red-400 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Check className="w-3 h-3" />;
      case 'closing_soon': return <Clock className="w-3 h-3" />;
      case 'closed': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getInventoryColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'low': return 'bg-orange-500/20 text-orange-400 border-orange-400/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const filteredBanks = bloodBanks.filter(bank => {
    switch (filter) {
      case 'open': return bank.status === 'open';
      case 'emergency': return bank.emergency;
      case 'verified': return bank.verified;
      default: return true;
    }
  });

  const emergencyBanks = bloodBanks.filter(bank => bank.emergency && bank.status === 'open');

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Beautiful Healthcare Background */}
      <DarkHealthBackground />
      
      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-red-500/20 safe-area-pt">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                className="w-10 h-10 rounded-full border-red-500/30 bg-black/20 backdrop-blur-sm text-red-300 hover:bg-red-500/10"
                onClick={() => onNavigate('home')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Blood Banks</h1>
                <p className="text-red-200 text-sm">Find nearby donation centers</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                className="w-10 h-10 rounded-full border-red-500/30 bg-black/20 backdrop-blur-sm text-red-300 hover:bg-red-500/10"
                onClick={requestLocation}
                disabled={isLocating}
              >
                {isLocating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Locate className="w-4 h-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="w-10 h-10 rounded-full border-red-500/30 bg-black/20 backdrop-blur-sm text-red-300 hover:bg-red-500/10"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Location Status */}
          <div className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-xl p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 rounded-xl"></div>
            <div className="relative flex items-center gap-3">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-lg animate-pulse"></div>
                <div className="relative w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg border border-blue-400/30">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">
                  {locationPermission === 'granted' ? 'Location Found' : 
                   locationPermission === 'denied' ? 'Location Access Denied' : 
                   'Finding Your Location...'}
                </div>
                <div className="text-blue-200 text-sm">
                  {locationPermission === 'granted' ? `Showing ${filteredBanks.length} nearby blood banks` :
                   locationPermission === 'denied' ? 'Please enable location access for better results' :
                   'We need your location to show nearby blood banks'}
                </div>
              </div>
              {locationPermission === 'granted' && (
                <Badge className="bg-green-500/20 text-green-400 border border-green-400/30">
                  <Check className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Alert */}
      {emergencyBanks.length > 0 && (
        <div className="relative z-10 p-6 pb-0">
          <div className="relative bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-4 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl blur-sm"></div>
            <div className="relative flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-red-500/30 rounded-xl blur-lg animate-pulse"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg border border-red-400/30">
                  <Zap className="w-5 h-5 text-white animate-pulse" />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-red-300 font-medium">Emergency Blood Banks</div>
                <div className="text-red-200 text-sm">{emergencyBanks.length} 24/7 centers available for urgent donations</div>
              </div>
              <Button className="bg-red-600 hover:bg-red-500 text-white border border-red-400/30">
                <Heart className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="relative z-10 p-6 pb-0">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'All Banks', count: bloodBanks.length },
            { key: 'open', label: 'Open Now', count: bloodBanks.filter(b => b.status === 'open').length },
            { key: 'emergency', label: 'Emergency', count: emergencyBanks.length },
            { key: 'verified', label: 'Verified', count: bloodBanks.filter(b => b.verified).length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-red-500/20 text-red-400 border-red-400/30'
                  : 'bg-black/20 text-red-200 border-red-500/20 hover:bg-red-500/10'
              }`}
            >
              <span>{tab.label}</span>
              <Badge className={`${
                filter === tab.key ? 'bg-red-400/20 text-red-300' : 'bg-red-500/20 text-red-300'
              } text-xs`}>
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Blood Banks List */}
      <div className="relative z-10 p-6 space-y-4">
        {filteredBanks.map((bank) => (
          <div 
            key={bank.id} 
            className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-2xl cursor-pointer hover:border-red-400/40 transition-all duration-300"
            onClick={() => setSelectedBank(bank)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5 rounded-2xl"></div>
            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-semibold text-lg">{bank.name}</h3>
                    {bank.verified && (
                      <Badge className="bg-green-500/20 text-green-400 border border-green-400/30 text-xs">
                        <Shield className="w-2 h-2 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {bank.emergency && (
                      <Badge className="bg-red-500/20 text-red-400 border border-red-400/30 text-xs">
                        <Zap className="w-2 h-2 mr-1" />
                        Emergency
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-red-200 text-sm">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>{bank.distance}</span>
                      {bank.rating && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span>{bank.rating}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-red-200 text-sm">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span>{bank.openHours}</span>
                    </div>
                  </div>
                </div>
                
                <Badge className={`${getStatusColor(bank.status)} text-xs`}>
                  {getStatusIcon(bank.status)}
                  <span className="ml-1 capitalize">{bank.status.replace('_', ' ')}</span>
                </Badge>
              </div>

              {/* Blood Type Inventory */}
              <div className="mb-4">
                <div className="text-white font-medium mb-2 text-sm">Blood Inventory</div>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(bank.inventory || {}).map(([type, level]) => (
                    <div key={type} className={`${getInventoryColor(level)} rounded-lg p-2 text-center`}>
                      <div className="font-bold text-sm">{type}</div>
                      <div className="text-xs capitalize">{level}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="mb-4">
                <p className="text-red-100 text-sm">{bank.address}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border border-blue-400/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`tel:${bank.phone}`);
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white border border-green-400/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://maps.google.com/?q=${bank.coordinates.lat},${bank.coordinates.lng}`);
                  }}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Directions
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredBanks.length === 0 && (
          <div className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-2xl text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 rounded-2xl"></div>
            <div className="relative">
              <Building2 className="w-16 h-16 text-red-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-white font-medium mb-2">No blood banks found</h3>
              <p className="text-red-200 text-sm">Try adjusting your filter or check back later</p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-green-500/5 rounded-2xl"></div>
          <div className="relative">
            <h3 className="text-white font-semibold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-2">
                  <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-lg animate-pulse"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg border border-green-400/30">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-400">{bloodBanks.filter(b => b.status === 'open').length}</div>
                <div className="text-green-300 text-sm">Open Now</div>
              </div>
              
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-2">
                  <div className="absolute inset-0 bg-red-500/20 rounded-xl blur-lg animate-pulse"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg border border-red-400/30">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-400">{emergencyBanks.length}</div>
                <div className="text-red-300 text-sm">Emergency</div>
              </div>
              
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-2">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg animate-pulse"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg border border-blue-400/30">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-400">{bloodBanks.filter(b => b.verified).length}</div>
                <div className="text-blue-300 text-sm">Verified</div>
              </div>
              
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-2">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-lg animate-pulse"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg border border-purple-400/30">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-400">{bloodBanks.length}</div>
                <div className="text-purple-300 text-sm">Total Banks</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}