import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { DarkHealthBackground } from './DarkHealthBackground';
import { 
  Droplets, Award, MapPin, Calendar, Bell, Copy, Settings, Heart, Trophy, Shield, 
  Mail, Wallet, Eye, EyeOff, Check, Star, Zap, Users, TrendingUp, Edit3,
  Share2, QrCode, Gift, Camera, Phone, Clock, Target
} from 'lucide-react';

interface DonorProfileScreenProps {
  onNavigate: (screen: string) => void;
}

export function DonorProfileScreen({ onNavigate }: DonorProfileScreenProps) {
  const [showFullWallet, setShowFullWallet] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements'>('overview');
  
  // User data - in real app this would come from context/props
  const userData = {
    email: "alex.smith@example.com",
    phone: "+1 (555) 123-4567",
    walletAddress: "0x742d35cc6b64c8bA2B4d7a8E3a8f3c8b4d6a7f9e",
    shortWalletAddress: "0x742d...7f9e",
    name: "Alex Smith",
    bloodType: "O+",
    city: "New York, NY",
    joinDate: "March 2024",
    lastDonation: "2 weeks ago",
    nextEligible: "10 weeks",
    donationGoal: 6,
    currentDonations: 4,
    impactScore: 850,
    rank: "Gold Donor"
  };

  const copyWalletAddress = async () => {
    await navigator.clipboard.writeText(userData.walletAddress);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const copyEmailAddress = async () => {
    await navigator.clipboard.writeText(userData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const donations = [
    { 
      id: 1,
      date: '2024-09-15', 
      location: 'City Hospital', 
      status: 'verified',
      type: 'Whole Blood',
      impact: '3 lives saved',
      nftMinted: true
    },
    { 
      id: 2,
      date: '2024-07-22', 
      location: 'Red Cross Center', 
      status: 'verified',
      type: 'Platelets',
      impact: '2 lives saved',
      nftMinted: true
    },
    { 
      id: 3,
      date: '2024-05-10', 
      location: 'Community Blood Bank', 
      status: 'verified',
      type: 'Whole Blood',
      impact: '4 lives saved',
      nftMinted: true
    },
    { 
      id: 4,
      date: '2024-03-18', 
      location: 'University Medical', 
      status: 'verified',
      type: 'Plasma',
      impact: '3 lives saved',
      nftMinted: true
    },
  ];

  const achievements = [
    { name: 'First Drop', icon: '🩸', description: 'Completed first donation', earned: true, date: 'Mar 2024' },
    { name: 'Life Saver', icon: '❤️', description: 'Saved 10+ lives', earned: true, date: 'Jul 2024' },
    { name: 'Regular Hero', icon: '⭐', description: '4 donations in a year', earned: true, date: 'Sep 2024' },
    { name: 'Community Champion', icon: '🏆', description: '6 donations milestone', earned: false, progress: 67 },
    { name: 'Golden Donor', icon: '🥇', description: '1 year anniversary', earned: false, progress: 80 },
    { name: 'Plasma Pioneer', icon: '🧬', description: 'Specialized donation', earned: true, date: 'May 2024' },
  ];

  const impactStats = [
    { label: 'Lives Saved', value: '12+', icon: Heart, color: 'text-red-400' },
    { label: 'Total Donations', value: '4', icon: Droplets, color: 'text-blue-400' },
    { label: 'Impact Score', value: '850', icon: Star, color: 'text-yellow-400' },
    { label: 'Community Rank', value: '#47', icon: TrendingUp, color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Beautiful Healthcare Background */}
      <DarkHealthBackground />
      
      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-red-500/20 safe-area-pt">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">My Profile</h1>
              <p className="text-red-200 text-sm">Donor Dashboard & Impact</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                className="w-10 h-10 rounded-full border-red-500/30 bg-black/20 backdrop-blur-sm text-red-300 hover:bg-red-500/10"
                onClick={() => onNavigate('settings')}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="w-10 h-10 rounded-full border-red-500/30 bg-black/20 backdrop-blur-sm text-red-300 hover:bg-red-500/10"
                >
                  <Bell className="w-4 h-4" />
                </Button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 space-y-6 max-w-4xl mx-auto">
        {/* Hero Profile Card */}
        <div className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5 rounded-2xl"></div>
          <div className="relative">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Avatar with Glow */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg animate-pulse"></div>
                  <Avatar className="relative w-full h-full ring-4 ring-red-400/30 shadow-lg">
                    <AvatarImage src="https://images.unsplash.com/photo-1709879057923-9f846b583154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcGVvcGxlJTIwY29tbXVuaXR5fGVufDF8fHx8MTc1OTM1NjE2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" />
                    <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-500 text-white text-xl font-bold">
                      AS
                    </AvatarFallback>
                  </Avatar>
                  {/* Status indicator */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-400/30">
                    <Trophy className="w-3 h-3 mr-1" />
                    {userData.rank}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-red-200">
                    <Droplets className="w-4 h-4 text-red-400" />
                    <span className="font-semibold text-red-400">{userData.bloodType}</span>
                    <span className="text-sm">• Universal Donor</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-red-200">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{userData.city}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-red-200">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span>Joined {userData.joinDate}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Button className="bg-red-600 hover:bg-red-500 text-white border border-red-400/30">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="border-red-500/30 text-red-300 hover:bg-red-500/10">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" className="border-red-500/30 text-red-300 hover:bg-red-500/10">
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {impactStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-4 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-blue-500/5 rounded-2xl"></div>
                <div className="relative text-center">
                  <div className="relative w-12 h-12 mx-auto mb-3">
                    <div className="absolute inset-0 bg-red-500/20 rounded-xl blur-lg animate-pulse"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg border border-red-400/30">
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-red-200">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Donation Progress */}
        <div className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-green-500/5 rounded-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Annual Goal Progress</h3>
              <Badge className="bg-green-500/20 text-green-400 border border-green-400/30">
                <Target className="w-3 h-3 mr-1" />
                {Math.round((userData.currentDonations / userData.donationGoal) * 100)}%
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-200">Donations this year</span>
                <span className="text-white font-medium">{userData.currentDonations} of {userData.donationGoal}</span>
              </div>
              <Progress 
                value={(userData.currentDonations / userData.donationGoal) * 100} 
                className="h-3 bg-red-900/30 rounded-full overflow-hidden"
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-sm text-red-200">Last Donation</div>
                  <div className="text-white font-medium">{userData.lastDonation}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-red-200">Next Eligible</div>
                  <div className="text-white font-medium">{userData.nextEligible}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex border-b border-red-500/20">
            {[
              { id: 'overview', label: 'Overview', icon: Heart },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'achievements', label: 'Achievements', icon: Trophy }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 p-4 text-center transition-all duration-300 relative ${
                    activeTab === tab.id 
                      ? 'text-red-400 bg-red-500/10' 
                      : 'text-red-200 hover:text-red-300 hover:bg-red-500/5'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400"></div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h4 className="text-white font-semibold mb-4">Contact Information</h4>
                
                {/* Email */}
                <div className="relative bg-black/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-sm text-red-200">Email</div>
                        <div className="text-white font-medium">{userData.email}</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyEmailAddress}
                      className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                    >
                      {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Wallet */}
                <div className="relative bg-black/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-sm text-red-200">Wallet Address</div>
                        <div className="text-white font-mono text-sm">
                          {showFullWallet ? userData.walletAddress : userData.shortWalletAddress}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowFullWallet(!showFullWallet)}
                        className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                      >
                        {showFullWallet ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyWalletAddress}
                        className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                      >
                        {copiedWallet ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <h4 className="text-white font-semibold mb-4">Donation History</h4>
                {donations.map((donation) => (
                  <div key={donation.id} className="relative bg-black/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Droplets className="w-4 h-4 text-red-400" />
                          <span className="text-white font-medium">{donation.type}</span>
                          <Badge className="bg-green-500/20 text-green-400 border border-green-400/30 text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <div className="text-sm text-red-200">{donation.location}</div>
                        <div className="text-sm text-red-300">{donation.impact}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-red-200">{donation.date}</div>
                        {donation.nftMinted && (
                          <Badge className="bg-purple-500/20 text-purple-400 border border-purple-400/30 text-xs mt-1">
                            <Zap className="w-3 h-3 mr-1" />
                            NFT Minted
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-4">
                <h4 className="text-white font-semibold mb-4">Achievements & Badges</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`relative backdrop-blur-sm border rounded-xl p-4 ${
                      achievement.earned 
                        ? 'bg-green-500/10 border-green-400/30' 
                        : 'bg-black/20 border-red-500/20'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className={`font-medium ${achievement.earned ? 'text-green-400' : 'text-white'}`}>
                            {achievement.name}
                          </div>
                          <div className="text-sm text-red-200">{achievement.description}</div>
                          {achievement.earned ? (
                            <div className="text-xs text-green-300 mt-1">Earned {achievement.date}</div>
                          ) : (
                            <div className="mt-2">
                              <Progress value={achievement.progress} className="h-2 bg-red-900/30" />
                              <div className="text-xs text-red-300 mt-1">{achievement.progress}% complete</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}