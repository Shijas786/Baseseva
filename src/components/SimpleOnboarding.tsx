import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Heart, ArrowRight, User, Mail, Droplets, MapPin, Check, Shield, 
  Sparkles, Zap, Star, Globe, Lock, Award, ChevronRight
} from 'lucide-react';

interface SimpleOnboardingProps {
  onComplete: () => void;
}

export function SimpleOnboarding({ onComplete }: SimpleOnboardingProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!isFormValid()) return;
    
    setIsLoading(true);
    // Simulate account creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    onComplete();
  };

  const isFormValid = () => {
    return email.includes('@') && name.trim().length > 0 && bloodType && city.trim().length > 0;
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-900 via-blue-800 to-red-900">
      {/* Simple Background for better mobile performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-blue-600 opacity-20"></div>
      
      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          {/* Logo & Brand Header */}
          <div className="text-center mb-10">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="relative w-20 h-20 bg-gradient-to-r from-red-600 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl border border-red-400/30">
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-red-400 via-white to-red-400 bg-clip-text text-transparent">
              BaseSeva
            </h1>
            <p className="text-red-200/80 text-lg">Save lives with blockchain</p>
            <p className="text-red-300/60 text-sm mt-2">Join the future of blood donation</p>
          </div>

          {/* Single Page Form */}
          <div className="relative bg-black/20 backdrop-blur-2xl border border-red-500/20 rounded-3xl p-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5 rounded-3xl"></div>
            
            <div className="relative space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
                <p className="text-red-200/80">Join the blockchain blood donation revolution</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Email Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <label className="text-white font-medium">Email Address</label>
                  </div>
                  <div className="relative">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-14 bg-black/30 border border-red-500/30 rounded-2xl px-6 text-white placeholder-red-300/50 focus:border-red-400/60 focus:bg-black/40 transition-all duration-300"
                    />
                    <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400/60" />
                  </div>
                </div>

                {/* Name Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-500 rounded-xl flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <label className="text-white font-medium">Full Name</label>
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full h-14 bg-black/30 border border-red-500/30 rounded-2xl px-6 text-white placeholder-red-300/50 focus:border-red-400/60 focus:bg-black/40 transition-all duration-300"
                    />
                    <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400/60" />
                  </div>
                </div>

                {/* Profile Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-white" />
                    </div>
                    <label className="text-white font-medium">Profile Information</label>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-red-200 text-sm mb-2">Blood Type</label>
                      <Select value={bloodType} onValueChange={setBloodType}>
                        <SelectTrigger className="w-full h-12 bg-black/30 border border-red-500/30 rounded-xl px-4 text-white focus:border-red-400/60">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 backdrop-blur-xl border border-red-500/30">
                          {bloodTypes.map((type) => (
                            <SelectItem key={type} value={type} className="text-white hover:bg-red-500/20">
                              <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-red-400" />
                                {type}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-red-200 text-sm mb-2">City</label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Your city"
                          className="w-full h-12 bg-black/30 border border-red-500/30 rounded-xl px-4 text-white placeholder-red-300/50 focus:border-red-400/60 focus:bg-black/40 transition-all duration-300"
                        />
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-400/60" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-400/20 rounded-xl p-4 text-center">
                  <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-blue-300 text-sm font-medium">Secure</div>
                  <div className="text-blue-200/70 text-xs">Blockchain protected</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-400/20 rounded-xl p-4 text-center">
                  <Star className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-green-300 text-sm font-medium">Reputation</div>
                  <div className="text-green-200/70 text-xs">Earn NFT badges</div>
                </div>
                <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-400/20 rounded-xl p-4 text-center">
                  <Award className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <div className="text-red-300 text-sm font-medium">Certificates</div>
                  <div className="text-red-200/70 text-xs">Verifiable proof</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-400/20 rounded-xl p-4 text-center">
                  <Globe className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-purple-300 text-sm font-medium">Global</div>
                  <div className="text-purple-200/70 text-xs">Connect worldwide</div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-400/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <h4 className="text-cyan-300 font-medium text-sm">Your Privacy Matters</h4>
                    <p className="text-cyan-200/70 text-xs mt-1">All data is encrypted and stored securely on the blockchain. You control what information you share.</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  onClick={handleComplete}
                  disabled={!isFormValid() || isLoading}
                  className={`w-full h-14 rounded-2xl text-white font-medium transition-all duration-300 ${
                    isFormValid() && !isLoading
                      ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-600/50 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating your account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      <span>Join BaseSeva</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-red-200/60 text-sm">
            <p>By joining, you agree to our Terms of Service and Privacy Policy</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Secure</span>
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Private</span>
              </span>
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Life-saving</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}