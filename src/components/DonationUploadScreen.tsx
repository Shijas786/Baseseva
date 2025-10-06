import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { DarkHealthBackground } from './DarkHealthBackground';
import { Badge } from './ui/badge';
import { 
  Camera, Upload, FileImage, Check, Clock, Zap, Shield, Heart, 
  ArrowLeft, Info, Award, Smartphone, QrCode, MapPin, Calendar,
  Droplets, Star, Trophy, AlertCircle
} from 'lucide-react';

interface DonationUploadScreenProps {
  onNavigate: (screen: string) => void;
}

export function DonationUploadScreen({ onNavigate }: DonationUploadScreenProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'pending' | 'verified' | 'minting' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleCameraUpload = () => {
    setUploadStatus('uploading');
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('pending');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleCameraUpload();
    }
  };

  const handleVerification = () => {
    setUploadStatus('verified');
    setTimeout(() => {
      setUploadStatus('minting');
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadStatus('complete');
            return 100;
          }
          return prev + 15;
        });
      }, 300);
    }, 2000);
  };

  const renderStatusContent = () => {
    switch (uploadStatus) {
      case 'idle':
        return (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-lg animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl flex items-center justify-center shadow-lg border border-red-400/30">
                <Camera className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Record Your Donation</h2>
              <p className="text-red-100 mb-6">Upload proof of your blood donation to earn blockchain certificates</p>
            </div>

            <div className="space-y-4">
              {/* Camera Option */}
              <div className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5 rounded-2xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg animate-pulse"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg border border-blue-400/30">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Take Photo</h3>
                      <p className="text-sm text-red-200">Capture donation certificate or receipt</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleCameraUpload}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border border-blue-400/30"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Open Camera
                  </Button>
                </div>
              </div>

              {/* Upload Option */}
              <div className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5 rounded-2xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-lg animate-pulse"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg border border-green-400/30">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Upload File</h3>
                      <p className="text-sm text-red-200">Choose from gallery or files</p>
                    </div>
                  </div>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button 
                      asChild
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white border border-green-400/30 cursor-pointer"
                    >
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="relative bg-yellow-500/10 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-6 shadow-xl mt-6">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-500/5 rounded-2xl"></div>
              <div className="relative">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-300 mb-2">Photo Requirements</h4>
                    <ul className="text-sm text-yellow-200/80 space-y-1">
                      <li>• Clear photo of donation certificate or receipt</li>
                      <li>• Include date, location, and donation type</li>
                      <li>• Ensure all text is readable</li>
                      <li>• No personal medical information visible</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'uploading':
        return (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-lg animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg border border-blue-400/30">
                <Upload className="w-10 h-10 text-white animate-bounce" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Uploading...</h2>
              <p className="text-blue-200">Securely uploading your donation proof</p>
            </div>

            <div className="relative bg-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 shadow-xl">
              <div className="relative">
                <Progress value={progress} className="h-3 bg-blue-900/30 rounded-full mb-4" />
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300">Uploading to IPFS</span>
                  <span className="text-blue-400 font-bold">{progress}%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-yellow-500/30 rounded-2xl blur-lg animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg border border-yellow-400/30">
                <Clock className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Pending Verification</h2>
              <p className="text-yellow-200">Our team will manually verify your donation proof</p>
            </div>

            <div className="relative bg-black/20 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 shadow-xl">
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-200">Manual Review</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-400/30">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Under Review
                  </Badge>
                </div>
                
                {selectedFile && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-xl border border-yellow-400/20">
                    <FileImage className="w-8 h-8 text-yellow-400" />
                    <div className="text-left">
                      <div className="text-white font-medium">{selectedFile.name}</div>
                      <div className="text-sm text-yellow-200">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleVerification}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white border border-yellow-400/30"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Simulate Manual Verification
                </Button>
              </div>
            </div>
          </div>
        );

      case 'verified':
        return (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-green-500/30 rounded-2xl blur-lg animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl flex items-center justify-center shadow-lg border border-green-400/30">
                <Check className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Verified! ✅</h2>
              <p className="text-green-200">Your donation has been verified and approved</p>
            </div>

            <div className="relative bg-black/20 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 shadow-xl">
              <div className="relative space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <Droplets className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <div className="text-sm text-green-200">Donation Type</div>
                    <div className="text-white font-medium">Whole Blood</div>
                  </div>
                  <div>
                    <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-sm text-green-200">Location</div>
                    <div className="text-white font-medium">City Hospital</div>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-400/20">
                  <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-green-300 font-medium">Estimated Impact</div>
                  <div className="text-white text-lg font-bold">3 Lives Saved</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'minting':
        return (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-lg animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg border border-purple-400/30">
                <Zap className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Minting NFT Certificate</h2>
              <p className="text-purple-200">Creating your immutable donation record</p>
            </div>

            <div className="relative bg-black/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-xl">
              <div className="relative">
                <Progress value={progress} className="h-3 bg-purple-900/30 rounded-full mb-4" />
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">Blockchain Processing</span>
                  <span className="text-purple-400 font-bold">{progress}%</span>
                </div>
                
                <div className="mt-4 space-y-2 text-sm text-purple-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Creating smart contract</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Generating metadata</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Deploying to blockchain</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-green-500/30 rounded-2xl blur-lg animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl flex items-center justify-center shadow-lg border border-green-400/30">
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Donation Recorded! 🎉</h2>
              <p className="text-green-200">Your NFT certificate has been minted successfully</p>
            </div>

            <div className="relative bg-black/20 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 shadow-xl">
              <div className="relative space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl border border-green-400/30">
                  <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                  <div className="text-white font-bold text-lg">NFT Certificate #1234</div>
                  <div className="text-green-300 text-sm">Minted on Base Blockchain</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <Star className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                    <div className="text-green-200">Impact Score</div>
                    <div className="text-white font-bold">+150 pts</div>
                  </div>
                  <div>
                    <Heart className="w-6 h-6 text-red-400 mx-auto mb-1" />
                    <div className="text-green-200">Lives Saved</div>
                    <div className="text-white font-bold">3 people</div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <Button 
                    onClick={() => onNavigate('profile')}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white border border-green-400/30"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    View My Profile
                  </Button>
                  
                  <Button 
                    onClick={() => setUploadStatus('idle')}
                    variant="outline"
                    className="w-full border-green-500/30 text-green-300 hover:bg-green-500/10"
                  >
                    Record Another Donation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Beautiful Healthcare Background */}
      <DarkHealthBackground />
      
      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-red-500/20 safe-area-pt">
        <div className="p-6">
          <div className="flex items-center justify-between">
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
                <h1 className="text-xl font-bold text-white">Record on Chain</h1>
                <p className="text-red-200 text-sm">Upload donation proof</p>
              </div>
            </div>
            
            <Badge className="bg-purple-500/20 text-purple-400 border border-purple-400/30">
              <Zap className="w-3 h-3 mr-1" />
              Blockchain Verified
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-md mx-auto">
        <div className="relative bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-purple-500/5 rounded-2xl"></div>
          <div className="relative">
            {renderStatusContent()}
          </div>
        </div>
      </div>
    </div>
  );
}