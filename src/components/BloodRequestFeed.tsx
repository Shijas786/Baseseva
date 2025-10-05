import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import * as Dialog from './ui/dialog';
import { DarkHealthBackground } from './DarkHealthBackground';
import { StatusPostingModal } from './StatusPostingModal';
import { 
  MapPin, Clock, Droplets, Phone, X, TrendingUp, Heart, Search, Filter,
  AlertCircle, User, Calendar, Zap, Shield, Star, ArrowRight, Navigation, Plus
} from 'lucide-react';

interface BloodRequestFeedProps {
  onNavigate: (screen: string) => void;
}

interface BloodRequest {
  id: string;
  name: string;
  avatar: string;
  bloodType: string;
  city: string;
  timestamp: string;
  timeLeft: string;
  urgency: 'critical' | 'urgent' | 'normal';
  hospital: string;
  contact: string;
  description: string;
  unitsNeeded: number;
  distance?: string;
  verified?: boolean;
}

export function BloodRequestFeed({ onNavigate }: BloodRequestFeedProps) {
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [filter, setFilter] = useState<'all' | 'critical' | 'urgent' | 'normal'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const requests: BloodRequest[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1709879057923-9f846b583154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcGVvcGxlJTIwY29tbXVuaXR5fGVufDF8fHx8MTc1OTM1NjE2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bloodType: 'O+',
      city: 'New York',
      timestamp: '2 hours ago',
      timeLeft: '6 hours',
      urgency: 'critical',
      hospital: 'Mount Sinai Hospital',
      contact: '+1 (555) 123-4567',
      description: 'Emergency surgery needed. Patient in critical condition.',
      unitsNeeded: 3,
      distance: '2.1 km',
      verified: true
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      bloodType: 'A-',
      city: 'Brooklyn',
      timestamp: '4 hours ago',
      timeLeft: '12 hours',
      urgency: 'urgent',
      hospital: 'Brooklyn Methodist Hospital',
      contact: '+1 (555) 987-6543',
      description: 'Scheduled surgery tomorrow morning. Need compatible donors.',
      unitsNeeded: 2,
      distance: '5.4 km',
      verified: true
    },
    {
      id: '3',
      name: 'Emma Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      bloodType: 'B+',
      city: 'Manhattan',
      timestamp: '6 hours ago',
      timeLeft: '18 hours',
      urgency: 'normal',
      hospital: 'NYU Langone Health',
      contact: '+1 (555) 456-7890',
      description: 'Upcoming procedure. Looking for willing donors in advance.',
      unitsNeeded: 1,
      distance: '3.7 km',
      verified: true
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      bloodType: 'AB-',
      city: 'Queens',
      timestamp: '8 hours ago',
      timeLeft: '24 hours',
      urgency: 'urgent',
      hospital: 'Queens General Hospital',
      contact: '+1 (555) 321-0987',
      description: 'Rare blood type needed for upcoming transfusion.',
      unitsNeeded: 2,
      distance: '8.2 km',
      verified: true
    }
  ];

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(req => req.urgency === filter);

  const handleCreateRequest = (requestData: any) => {
    console.log('New blood request created:', requestData);
    setIsCreateModalOpen(false);
    // Here you would typically:
    // 1. Send the request to your Supabase API
    // 2. Add it to your local state
    // 3. Show a success message
    // For now, we'll just log it
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-400/30';
      case 'urgent': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'normal': return 'bg-green-500/20 text-green-400 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <AlertCircle className="w-3 h-3" />;
      case 'urgent': return <Clock className="w-3 h-3" />;
      case 'normal': return <Heart className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Beautiful Healthcare Background */}
      <DarkHealthBackground />
      
      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-red-500/20 safe-area-pt">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Blood Requests</h1>
              <p className="text-red-200 text-sm">Help save lives in your community</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                className="w-10 h-10 rounded-full border-red-500/30 bg-black/20 backdrop-blur-sm text-red-300 hover:bg-red-500/10"
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="w-10 h-10 rounded-full border-red-500/30 bg-black/20 backdrop-blur-sm text-red-300 hover:bg-red-500/10"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* WhatsApp Status-style Request Circles */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {/* Create Request Circle (WhatsApp style) */}
            <div className="flex flex-col items-center min-w-[70px]">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-200 p-0 text-white mb-2"
              >
                <Plus className="w-6 h-6" />
              </Button>
              <span className="text-xs text-red-200 text-center leading-tight">
                Add Request
              </span>
            </div>

            {/* Existing Request Circles */}
            {filteredRequests.slice(0, 8).map((request) => (
              <div key={request.id} className="flex flex-col items-center min-w-[70px] cursor-pointer" onClick={() => setSelectedRequest(request)}>
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/30 border-2 border-red-400/50 flex items-center justify-center mb-2 hover:border-red-400/80 transition-all duration-200">
                    <span className="text-red-300 font-bold text-lg">{request.bloodType}</span>
                  </div>
                  
                  {/* Urgency dot */}
                  <div className={`absolute -top-1 -right-1 w-4 h-4 ${
                    request.urgency === 'critical' ? 'bg-red-500' :
                    request.urgency === 'urgent' ? 'bg-yellow-500' : 'bg-green-500'
                  } rounded-full border-2 border-black shadow-sm`} />
                </div>
                <span className="text-xs text-red-200 text-center leading-tight truncate w-full">
                  {request.name}
                </span>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: 'all', label: 'All Requests', count: requests.length },
              { key: 'critical', label: 'Critical', count: requests.filter(r => r.urgency === 'critical').length },
              { key: 'urgent', label: 'Urgent', count: requests.filter(r => r.urgency === 'urgent').length },
              { key: 'normal', label: 'Normal', count: requests.filter(r => r.urgency === 'normal').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 ${
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
      </div>

      {/* Emergency Banner */}
      <div className="relative z-10 p-6 pb-0">
        <div className="relative bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-4 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl blur-sm"></div>
          <div className="relative flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-red-500/30 rounded-xl blur-lg animate-pulse"></div>
              <div className="relative w-10 h-10 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg border border-red-400/30">
                <AlertCircle className="w-5 h-5 text-white animate-pulse" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-red-300 font-medium">Emergency Alert</div>
              <div className="text-red-200 text-sm">3 critical requests in your area need immediate attention</div>
            </div>
            <Button className="bg-red-600 hover:bg-red-500 text-white border border-red-400/30">
              <Navigation className="w-4 h-4 mr-2" />
              View Map
            </Button>
          </div>
        </div>
      </div>

      {/* Requests Feed */}
      <div className="relative z-10 p-6 space-y-4">
        {filteredRequests.map((request) => (
          <div 
            key={request.id} 
            className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-2xl cursor-pointer hover:border-red-400/40 transition-all duration-300"
            onClick={() => setSelectedRequest(request)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5 rounded-2xl"></div>
            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 ring-2 ring-red-400/30">
                      <AvatarImage src={request.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-500 text-white">
                        {request.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {request.verified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Shield className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{request.name}</span>
                      {request.verified && (
                        <Badge className="bg-green-500/20 text-green-400 border border-green-400/30 text-xs">
                          <Shield className="w-2 h-2 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-200">
                      <MapPin className="w-3 h-3" />
                      <span>{request.city}</span>
                      {request.distance && (
                        <>
                          <span>•</span>
                          <span>{request.distance}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <Badge className={`${getUrgencyColor(request.urgency)} text-xs`}>
                  {getUrgencyIcon(request.urgency)}
                  <span className="ml-1 capitalize">{request.urgency}</span>
                </Badge>
              </div>

              {/* Blood Type & Units */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-xl blur-lg animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-red-600 to-red-500 rounded-xl px-4 py-2 shadow-lg border border-red-400/30">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-white" />
                      <span className="text-white font-bold text-lg">{request.bloodType}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-white">
                  <div className="text-sm text-red-200">Units Needed</div>
                  <div className="font-bold">{request.unitsNeeded} units</div>
                </div>
                
                <div className="flex-1 text-right">
                  <div className="text-sm text-red-200">Time Left</div>
                  <div className="text-white font-medium">{request.timeLeft}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <p className="text-red-100 text-sm">{request.description}</p>
              </div>

              {/* Hospital & Contact */}
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="text-red-200">Hospital</div>
                  <div className="text-white font-medium">{request.hospital}</div>
                </div>
                
                <Button 
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border border-red-400/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRequest(request);
                  }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Help Now
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-2xl text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 rounded-2xl"></div>
            <div className="relative">
              <Heart className="w-16 h-16 text-red-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-white font-medium mb-2">No {filter} requests found</h3>
              <p className="text-red-200 text-sm">Check back later or try a different filter</p>
            </div>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <Dialog.Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <Dialog.DialogContent className="bg-black/40 backdrop-blur-xl border border-red-500/20 text-white max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5 rounded-2xl"></div>
            <div className="relative">
              <Dialog.DialogHeader>
                <Dialog.DialogTitle className="text-white text-xl">Blood Request Details</Dialog.DialogTitle>
                <Dialog.DialogDescription className="text-red-200">
                  Review request information and contact details
                </Dialog.DialogDescription>
              </Dialog.DialogHeader>
              
              <div className="space-y-6 mt-6">
                {/* Patient Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 ring-2 ring-red-400/30">
                    <AvatarImage src={selectedRequest.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-500 text-white text-lg">
                      {selectedRequest.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-bold text-lg">{selectedRequest.name}</h3>
                    <div className="flex items-center gap-2 text-red-200">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedRequest.city}</span>
                    </div>
                    <Badge className={`${getUrgencyColor(selectedRequest.urgency)} text-xs mt-1`}>
                      {getUrgencyIcon(selectedRequest.urgency)}
                      <span className="ml-1 capitalize">{selectedRequest.urgency}</span>
                    </Badge>
                  </div>
                </div>

                {/* Blood Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative bg-black/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-4 text-center">
                    <Droplets className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <div className="text-red-200 text-sm">Blood Type</div>
                    <div className="text-white font-bold text-xl">{selectedRequest.bloodType}</div>
                  </div>
                  <div className="relative bg-black/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-4 text-center">
                    <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-red-200 text-sm">Units Needed</div>
                    <div className="text-white font-bold text-xl">{selectedRequest.unitsNeeded}</div>
                  </div>
                </div>

                {/* Hospital & Time */}
                <div className="space-y-3">
                  <div className="relative bg-black/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-red-200 text-sm">Hospital</div>
                        <div className="text-white font-medium">{selectedRequest.hospital}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative bg-black/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-red-200 text-sm">Time Remaining</div>
                        <div className="text-white font-medium">{selectedRequest.timeLeft}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="relative bg-yellow-500/10 backdrop-blur-sm border border-yellow-400/30 rounded-xl p-4">
                  <h4 className="text-yellow-300 font-medium mb-2">Medical Details</h4>
                  <p className="text-yellow-200/80 text-sm">{selectedRequest.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white border border-red-400/30"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Hospital: {selectedRequest.contact}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10"
                    onClick={() => onNavigate('map')}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </Dialog.DialogContent>
        </Dialog.Dialog>
      )}

      {/* Create Request Modal */}
      <StatusPostingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRequest}
      />
    </div>
  );
}