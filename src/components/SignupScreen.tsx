import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DarkHealthBackground } from './DarkHealthBackground';
import { WalletCreationFlow } from './WalletCreationFlow';
import { MockWalletNotice } from './MockWalletNotice';
import { usePrivyAuth } from './hooks/usePrivyAuth';
import { Check, Shield, Smartphone, Heart, Users, Zap, Lock, User, Droplets, MapPin, Phone, Mail } from 'lucide-react';

interface SignupScreenProps {
  onComplete: () => void;
}

export function SignupScreen({ onComplete }: SignupScreenProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'profile' | 'wallet-setup' | 'creating' | 'complete'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [profile, setProfile] = useState({
    fullName: '',
    bloodType: '',
    city: '',
    phone: '',
    age: ''
  });
  const [walletData, setWalletData] = useState({
    address: '',
    mnemonic: '',
    confirmed: false
  });
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  
  const { login, linkEmailAccount, isAuthenticated, user, hasWallet, hasSmartWallet, isLoading: privyLoading } = usePrivyAuth();

  const handleEmailSubmit = async () => {
    try {
      // Use mock/Privy to initiate authentication
      await login('email');
      setStep('otp');
    } catch (error) {
      console.error('Email authentication failed:', error);
      // Fallback to OTP step for demo
      setStep('otp');
    }
  };

  const handleOtpSubmit = () => {
    // After OTP verification, proceed to profile setup
    setStep('profile');
  };

  const handleProfileSubmit = () => {
    setStep('wallet-setup');
  };

  const handleWalletSetup = () => {
    // This will be handled by the WalletCreationFlow component
    setStep('creating');
  };

  const handleWalletComplete = () => {
    setStep('complete');
  };

  const handleBackToProfile = () => {
    setStep('profile');
  };

  return (
    <div className="min-h-screen relative text-white flex flex-col overflow-hidden">
      {/* Dark Healthcare Professional Background */}
      <DarkHealthBackground />

      {/* Content Container */}
      <div className="relative z-10 p-6 flex flex-col min-h-screen">
        {/* Professional Header */}
        <div className="text-center pt-12 pb-8">
          <div className="relative mb-6">
            {/* Heart icon with glow */}
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent drop-shadow-lg tracking-tight">
              BaseSeva
            </h1>
            {/* Elegant underline */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent mx-auto opacity-60"></div>
          </div>
          
          <p className="text-xl text-red-100 mb-3 font-medium">Connecting Lives Through Blockchain</p>
          <p className="text-sm text-red-200/80">Secure • Transparent • Life-Saving</p>
          
          {/* Subtle heartbeat line */}
          <div className="flex items-center justify-center mt-6 mb-2">
            <div className="w-12 h-px bg-red-400/30"></div>
            <div className="w-2 h-2 bg-red-400 rounded-full mx-2 animate-pulse"></div>
            <div className="w-12 h-px bg-red-400/30"></div>
          </div>
        </div>

        {/* Professional Glass Container */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          {/* Elegant Glass Container */}
          <div className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-2xl">
            {/* Soft red glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5 rounded-2xl"></div>
            <div className="relative z-10">
        {step === 'email' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3 text-white">
                Join Our Mission
              </h2>
              <p className="text-red-100 mb-6 text-lg">Creating a trusted blood donation network</p>
              
              {/* Professional Feature highlights */}
              <div className="space-y-4 mb-6">
                <div className="relative bg-black/10 rounded-xl p-4 backdrop-blur-sm border border-red-500/20 text-left group hover:border-red-500/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start space-x-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mt-0.5 border border-red-400/30">
                      <Shield className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Secure & Verified</h3>
                      <p className="text-sm text-red-200/80">Blockchain-verified donations with complete transparency</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative bg-black/10 rounded-xl p-4 backdrop-blur-sm border border-red-500/20 text-left group hover:border-red-500/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start space-x-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mt-0.5 border border-red-400/30">
                      <Heart className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Life-Saving Impact</h3>
                      <p className="text-sm text-red-200/80">Connect with those who need your help most</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative bg-black/10 rounded-xl p-4 backdrop-blur-sm border border-red-500/20 text-left group hover:border-red-500/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start space-x-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mt-0.5 border border-red-400/30">
                      <Users className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Global Community</h3>
                      <p className="text-sm text-red-200/80">Join thousands of verified donors worldwide</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="relative">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-400/30">
                    <Mail className="w-4 h-4 text-red-400" />
                  </div>
                  <Label htmlFor="email" className="text-red-100 font-medium text-lg">Email Address</Label>
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-black/20 border-red-500/30 text-white placeholder-red-300/60 h-16 backdrop-blur-lg rounded-xl text-lg font-medium focus:border-red-400/60 focus:ring-2 focus:ring-red-400/20 transition-all duration-300"
                />
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-500/10 to-red-500/5 rounded-xl blur-lg opacity-50 -z-10"></div>
              </div>
              
              <Button 
                onClick={handleEmailSubmit}
                className="relative w-full h-16 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white transition-all duration-300 shadow-xl text-lg font-semibold rounded-xl border border-red-400/30 overflow-hidden group"
                disabled={!email}
              >
                {/* Button glow animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <Heart className="w-5 h-5" />
                  Continue to Verification
                </div>
              </Button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 bg-red-500/30 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative w-16 h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl flex items-center justify-center border border-red-400/30">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-3 text-white">
                Email Verification
              </h2>
              <p className="text-red-100 text-lg">Check your inbox for the verification code</p>
              <p className="text-red-200/80 text-sm mt-2">{email}</p>
            </div>

            {/* Professional Demo Code Display */}
            <div className="relative bg-black/20 border border-red-500/30 rounded-2xl p-6 text-center backdrop-blur-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-500/10 rounded-2xl blur-lg"></div>
              <div className="relative">
                <p className="text-sm text-red-300 mb-3 font-medium">Demo Code for Testing</p>
                <p className="text-4xl font-mono text-red-400 tracking-widest font-bold">
                  123456
                </p>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent mx-auto mt-3 opacity-60"></div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="relative">
                <Label htmlFor="otp" className="text-red-100 font-medium text-lg mb-3 block">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="● ● ● ● ● ●"
                  className="bg-black/20 border-red-500/30 text-white placeholder-red-300/60 h-16 text-center tracking-[0.5em] backdrop-blur-lg rounded-xl text-2xl font-bold focus:border-red-400/60 focus:ring-2 focus:ring-red-400/20 transition-all duration-300"
                  maxLength={6}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-500/10 to-red-500/5 rounded-xl blur-lg opacity-50 -z-10"></div>
              </div>
              
              <Button 
                onClick={handleOtpSubmit}
                className="relative w-full h-16 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white transition-all duration-300 shadow-xl text-lg font-semibold rounded-xl border border-red-400/30 overflow-hidden group"
                disabled={otp.length !== 6}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <Shield className="w-5 h-5" />
                  Verify & Create Wallet
                </div>
              </Button>

              {/* Professional Skip Option */}
              <Button 
                onClick={handleOtpSubmit}
                variant="outline"
                className="w-full h-14 border-red-500/30 text-red-300 hover:bg-red-500/10 backdrop-blur-lg rounded-xl font-medium transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" />
                  Skip Verification (Demo Mode)
                </div>
              </Button>
            </div>
          </div>
        )}

        {step === 'profile' && (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-[var(--base-blue)]" />
              <h2 className="text-2xl mb-2">Complete Your Profile</h2>
              <p className="text-gray-400">Help us create your donor identity</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                  placeholder="Enter your full name"
                  className="mt-2 bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] h-14 backdrop-blur-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select value={profile.bloodType} onValueChange={(value) => setProfile({...profile, bloodType: value})}>
                  <SelectTrigger className="mt-2 bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--foreground)] h-14 backdrop-blur-sm">
                    <SelectValue placeholder="Select your blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({...profile, age: e.target.value})}
                    placeholder="Age"
                    min="18"
                    max="65"
                    className="mt-2 bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] h-14 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({...profile, city: e.target.value})}
                    placeholder="Your city"
                    className="mt-2 bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] h-14 backdrop-blur-sm"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="+91 XXXXX XXXXX"
                  className="mt-2 bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] h-14 backdrop-blur-sm"
                />
              </div>
              
              <Button 
                onClick={handleProfileSubmit}
                className="w-full h-14 bg-gradient-to-r from-[var(--base-blue)] to-[var(--base-blue-light)] hover:from-[var(--base-blue-dark)] hover:to-[var(--base-blue)] text-white transition-all duration-300 shadow-lg"
                disabled={!profile.fullName || !profile.bloodType || !profile.city || !profile.phone || !profile.age}
              >
                Create My Donor Profile
              </Button>
              
              {/* Profile Requirements */}
              <div className="bg-[var(--glass-bg)] rounded-lg p-4 backdrop-blur-sm border border-[var(--glass-border)]">
                <h4 className="text-sm font-medium text-white mb-2">Donation Requirements</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Age: 18-65 years</li>
                  <li>• Weight: Minimum 50kg</li>
                  <li>• 3 months gap between donations</li>
                  <li>• Good health & no recent medications</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 'wallet-setup' && (
          <div className="space-y-6">
            <div className="text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-2xl mb-2">Smart Wallet Setup</h2>
              <p className="text-gray-400">Your secure blockchain identity</p>
            </div>
            
            {/* Wallet Features */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm mt-0.5">
                    <Lock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Bank-Level Security</h3>
                    <p className="text-sm text-gray-400">256-bit encryption with biometric authentication</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center backdrop-blur-sm mt-0.5">
                    <Shield className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Decentralized Identity</h3>
                    <p className="text-sm text-gray-400">You control your data - no centralized servers</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center backdrop-blur-sm mt-0.5">
                    <Heart className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">NFT Certificates</h3>
                    <p className="text-sm text-gray-400">Immutable proof of your life-saving donations</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-300 mb-1">Security Promise</h4>
                  <p className="text-sm text-yellow-200/80">
                    Your wallet will be protected with advanced encryption. You'll receive a secure recovery phrase 
                    that only you can access. We never store your private keys.
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleWalletSetup}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 shadow-lg"
            >
              <Lock className="w-5 h-5 mr-2" />
              Create My Secure Wallet
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              By creating a wallet, you agree to our terms of service and privacy policy. 
              Your data is encrypted and stored securely on the blockchain.
            </p>
          </div>
        )}

        {step === 'creating' && (
          <div className="space-y-8 text-center">
            {/* Enhanced Loading Animation */}
            <div className="relative w-32 h-32 mx-auto">
              {/* Outer spinning ring */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
              {/* Middle spinning ring */}
              <div className="absolute inset-4 rounded-full border-4 border-purple-500/20 border-r-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              {/* Inner pulsing core */}
              <div className="absolute inset-8 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <Zap className="w-8 h-8 text-white" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Deploying Neural Wallet
              </h2>
              <p className="text-blue-200 mb-8 text-xl">Quantum encryption in progress...</p>
              
              <div className="space-y-6">
                {/* Enhanced Progress Bar */}
                <div className="relative">
                  <Progress value={progress} className="h-4 bg-white/10 rounded-full overflow-hidden" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-sm"></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-300">Progress</span>
                  <span className="text-cyan-300 font-bold text-lg">{progress}% Complete</span>
                </div>
                
                {currentMessage && (
                  <div className="relative bg-white/5 rounded-2xl p-6 backdrop-blur-lg border border-blue-400/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl blur-lg"></div>
                    <div className="relative flex items-center justify-center space-x-3">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      <span className="text-lg text-cyan-200 font-medium ml-4">{currentMessage}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-6 text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40">
              <Check className="w-12 h-12 text-white" />
            </div>
            
            <div>
              <h2 className="text-3xl mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Welcome to BaseSeva! 🩸
              </h2>
              <p className="text-gray-300 mb-6">Your secure donor identity is ready</p>
              
              {/* Profile & Wallet Summary */}
              <div className="space-y-4 mb-6">
                {/* Email Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-left">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-300">Email Address</p>
                      <p className="text-white font-medium">{email}</p>
                    </div>
                  </div>
                </div>
                
                {/* Profile Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-left">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm text-gray-300">Donor Profile</p>
                        <p className="text-white font-medium">{profile.fullName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Blood Type</p>
                      <p className="text-red-400 font-bold">{profile.bloodType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>📍 {profile.city}</span>
                    <span>📱 {profile.phone}</span>
                    <span>👤 {profile.age} years</span>
                  </div>
                </div>
                
                {/* Smart Wallet Card */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-300">Smart Wallet</p>
                      <p className="text-purple-300 font-medium">Blockchain Identity Created</p>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                    <p className="font-mono text-xs text-gray-300 break-all">
                      {walletData.address || '0x742d...7f9e'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Shield className="w-3 h-3 text-green-400" />
                    <p className="text-xs text-green-300">Secured with biometric authentication</p>
                  </div>
                </div>
              </div>
              
              {/* Welcome Features */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-6">
                <p className="text-sm text-white mb-4 font-medium">Your BaseSeva Powers:</p>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-gray-300">Verified<br/>Donations</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 bg-red-500/20 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-red-400" />
                    </div>
                    <p className="text-gray-300">NFT<br/>Badges</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-gray-300">Community<br/>Network</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-3 border border-green-400/30">
                <p className="text-sm text-green-300 font-medium">🎉 Ready to save lives and earn rewards!</p>
              </div>
            </div>
          </div>
        )}

        {step === 'creating' && (
          <WalletCreationFlow 
            onComplete={handleWalletComplete}
            onBack={handleBackToProfile}
          />
        )}

            </div>
          </div>
          
          {/* Professional Footer */}
          <div className="text-center text-xs text-red-300/80 pt-8">
            <div className="flex items-center justify-center space-x-6 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-200">Blockchain</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-red-200">Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-red-200">Trusted</span>
              </div>
            </div>
            <p className="text-red-200 font-medium">Powered by Web3 Healthcare Protocol</p>
            <p className="text-[10px] text-red-300/60 mt-2">
              BaseSeva • Saving lives through technology and community
            </p>
            
            {/* Elegant signature line */}
            <div className="w-48 h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent mx-auto mt-4 opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  );
}