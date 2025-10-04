import { useState, useEffect } from 'react';
import { NotificationSystem } from './NotificationSystem';
import { AnimatedBackground } from './AnimatedBackground';
import { useSwipe } from './hooks/useSwipe';
import { 
  Droplets, 
  Heart, 
  Trophy, 
  Shield, 
  MapPin, 
  Upload, 
  User,
  Activity,
  Quote,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [donationProgress] = useState(65);
  const [streakCount] = useState(5);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1683791895200-201c0c40310f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMGRvbmF0aW9uJTIwbWVkaWNhbCUyMGhlcm9lc3xlbnwxfHx8fDE3NTk0NzE4MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Every Drop Counts",
      quote: "Every drop counts, every donation saves lives",
      author: "Be a Hero Today",
      description: "Your donation can save up to 3 lives"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1666886573590-5815157da865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJvZmVzc2lvbmFscyUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzU5NDcxODA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Gift of Life",
      quote: "The gift of blood is the gift of life",
      author: "Share Your Life Force",
      description: "Be someone's miracle today"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1530043123514-c01b94ef483b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29tbXVuaXR5JTIwaGVscGluZ3xlbnwxfHx8fDE3NTk0NzE4MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Time is Critical",
      quote: "Donate blood, because life doesn't wait",
      author: "Time is Critical",
      description: "Someone needs help right now"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1617080090911-91409e3496ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMGhlYXJ0JTIwY2hhcml0eXxlbnwxfHx8fDE3NTk0NzE4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Author of Hope",
      quote: "Your blood can write someone's survival story",
      author: "Be the Author of Hope",
      description: "Create hope with your donation"
    }
  ];

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Add swipe support for mobile
  const swipeHandlers = useSwipe({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
    threshold: 50
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-white to-blue-50/50 relative">
      {/* Animated Background Particles */}
      <AnimatedBackground />
      
      {/* Desktop Header - Only show on desktop since ResponsiveLayout handles mobile */}
      <div className="hidden lg:block relative z-20 bg-white/80 backdrop-blur-sm border-b border-border/50">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Welcome back, Alex</h1>
              <p className="text-base text-secondary">Ready to make a difference today?</p>
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationSystem onNavigate={onNavigate} />
              <button 
                onClick={() => onNavigate('profile')}
                className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-primary-foreground hover:bg-primary-hover transition-colors shadow-lg"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Netflix-Style Hero Cards */}
      <div className="relative z-10 py-4 md:py-8 lg:py-12">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Netflix-Style Card */}
            <div 
              className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
              {...swipeHandlers}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                />
                {/* Netflix-style gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12">
                <div className="max-w-2xl">
                  {/* Title */}
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 transition-all duration-500">
                    {heroSlides[currentSlide].title}
                  </h2>
                  
                  {/* Quote */}
                  <div className="mb-4 md:mb-6">
                    <p className="text-base md:text-lg lg:text-xl text-white font-medium mb-2 leading-relaxed">
                      "{heroSlides[currentSlide].quote}"
                    </p>
                    <p className="text-sm md:text-base text-white/80 font-medium">
                      — {heroSlides[currentSlide].author}
                    </p>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm md:text-base lg:text-lg text-white/90 mb-6 md:mb-8 leading-relaxed">
                    {heroSlides[currentSlide].description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button 
                      onClick={() => onNavigate('upload')}
                      className="bg-white text-gray-900 hover:bg-white/90 px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      <Upload className="w-4 h-4 md:w-5 md:h-5" />
                      Record Donation
                    </button>
                    <button 
                      onClick={() => onNavigate('map')}
                      className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 border border-white/30"
                    >
                      <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                      Find Centers
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Netflix-style indicators */}
              <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 flex gap-1">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-8 h-1 md:w-12 md:h-1 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-white' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              {/* Netflix-style progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div 
                  className="h-full bg-blood transition-all duration-6000 ease-linear"
                  style={{ 
                    width: `${((currentSlide + 1) / heroSlides.length) * 100}%`,
                    animation: 'none'
                  }}
                />
              </div>
            </div>

            {/* Card Thumbnails (Netflix-style) */}
            <div className="hidden md:flex mt-6 gap-3 lg:gap-4 justify-center">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`relative w-20 h-12 lg:w-24 lg:h-14 rounded-lg overflow-hidden transition-all duration-300 ${
                    index === currentSlide 
                      ? 'ring-2 ring-blood scale-110' 
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img 
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-1 left-1 right-1">
                    <p className="text-xs text-white font-medium truncate">
                      {slide.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container px-4 md:px-6 lg:px-8 py-4 md:py-8 lg:py-12 max-w-7xl mx-auto">
        {/* Mobile Welcome Section - Only show on mobile */}
        <div className="lg:hidden mb-6 md:mb-8 relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg border border-border/30">
          <div className="relative h-48 md:h-56">
            <img 
              src="https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMGRvbmF0aW9uJTIwdm9sdW50ZWVyJTIwY29tbXVuaXR5fGVufDF8fHx8MTc1OTQ3NzczN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Blood donation volunteers"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute top-3 right-3 w-8 h-8 bg-blood/90 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white animate-pulse" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <button 
              onClick={() => onNavigate('feed')}
              className="w-full backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 animate-pulse" />
                Join Our Community
              </div>
            </button>
          </div>
        </div>

        {/* Blood Donation Facts */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8 lg:mb-12">
          <div className="card-mobile text-center touch-feedback">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blood/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 icon-float">
              <Heart className="w-6 h-6 md:w-8 md:h-8 text-blood" />
            </div>
            <h4 className="font-semibold text-primary mb-1 md:mb-2 text-mobile-base">1 Donation</h4>
            <p className="text-mobile-sm text-secondary">Can save up to 3 lives</p>
          </div>

          <div className="card-mobile text-center touch-feedback">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 icon-float" style={{ animationDelay: '0.5s' }}>
              <Activity className="w-6 h-6 md:w-8 md:h-8 text-success" />
            </div>
            <h4 className="font-semibold text-primary mb-1 md:mb-2 text-mobile-base">Every 2 Seconds</h4>
            <p className="text-mobile-sm text-secondary">Someone needs blood</p>
          </div>

          <div className="card-mobile text-center touch-feedback">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 icon-float" style={{ animationDelay: '1s' }}>
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-info" />
            </div>
            <h4 className="font-semibold text-primary mb-1 md:mb-2 text-mobile-base">Only 3%</h4>
            <p className="text-mobile-sm text-secondary">Of eligible people donate</p>
          </div>
        </div>

        {/* Desktop Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 md:mb-8 lg:mb-12">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-border/30 shadow-lg">
              <h3 className="text-base md:text-lg lg:text-xl font-semibold text-primary mb-3 md:mb-4 lg:mb-6">Your Actions Matter</h3>
              <div className="space-y-3 md:space-y-4 lg:space-y-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/20 p-3 md:p-4 lg:p-6 hover:bg-white/80 transition-all duration-300 cursor-pointer hover:scale-105 border-l-4 border-l-blood active:scale-95 touch-target"
                     onClick={() => onNavigate('upload')}>
                  <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-blood/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Upload className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blood" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-primary mb-0.5 md:mb-1 lg:mb-2 text-sm md:text-base lg:text-lg">Record Your Donation</h4>
                      <p className="text-xs md:text-sm lg:text-base text-secondary">Secure your life-saving act on blockchain</p>
                    </div>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-tertiary flex-shrink-0" />
                  </div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/20 p-3 md:p-4 lg:p-6 hover:bg-white/80 transition-all duration-300 cursor-pointer hover:scale-105 border-l-4 border-l-success active:scale-95 touch-target"
                     onClick={() => onNavigate('feed')}>
                  <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-primary mb-0.5 md:mb-1 lg:mb-2 text-sm md:text-base lg:text-lg">Answer the Call</h4>
                      <p className="text-xs md:text-sm lg:text-base text-secondary">Someone nearby needs your blood type</p>
                    </div>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-tertiary flex-shrink-0" />
                  </div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/20 p-3 md:p-4 lg:p-6 hover:bg-white/80 transition-all duration-300 cursor-pointer hover:scale-105 border-l-4 border-l-info active:scale-95 touch-target"
                     onClick={() => onNavigate('map')}>
                  <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-info/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-info" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-primary mb-0.5 md:mb-1 lg:mb-2 text-sm md:text-base lg:text-lg">Find Donation Centers</h4>
                      <p className="text-xs md:text-sm lg:text-base text-secondary">Locate the nearest blood donation facility</p>
                    </div>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-tertiary flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Progress */}
          <div className="space-y-6 lg:space-y-8">
            {/* Your Impact Stats */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-border/30 shadow-lg">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-base md:text-lg lg:text-xl font-semibold text-primary">Your Impact</h3>
                <button 
                  onClick={() => onNavigate('profile')}
                  className="text-xs md:text-sm text-secondary hover:text-primary flex items-center gap-1"
                >
                  View all <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
              
              <div className="space-y-4 lg:space-y-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/20 p-4 lg:p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-secondary text-xs md:text-sm font-medium mb-1">Total Donations</p>
                      <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blood mb-1">4</p>
                      <p className="text-xs text-secondary">Lives saved: 12+</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-blood/10 rounded-xl flex items-center justify-center icon-float">
                      <Droplets className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blood" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <span>↗</span>
                    <span>25% vs last month</span>
                  </div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/20 p-4 lg:p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-secondary text-xs md:text-sm font-medium mb-1">Current Streak</p>
                      <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{streakCount}mo</p>
                      <p className="text-xs text-secondary">Consistent donations</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-xl flex items-center justify-center icon-float" style={{ animationDelay: '0.5s' }}>
                      <Trophy className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <span>↗</span>
                    <span>12% vs last month</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-border/30 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blood icon-float" />
                    Your Life-Saving Journey
                  </h4>
                  <p className="text-sm text-secondary">Progress to becoming a hero</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blood">{donationProgress}%</div>
                  <div className="text-xs text-secondary">Complete</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden mb-4 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blood via-red-500 to-blood-dark rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${donationProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  <div className="absolute right-0 top-1/2 w-4 h-4 bg-blood rounded-full transform translate-x-1/2 -translate-y-1/2 icon-float shadow-lg"></div>
                </div>
              </div>
              
              <p className="text-sm text-secondary text-center">
                <span className="text-blood font-medium">{100 - donationProgress}% more</span> to unlock your next lifesaver badge!
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity - Full Width */}
        <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-border/30 shadow-lg">
          <h3 className="text-lg lg:text-xl font-semibold text-primary mb-4 lg:mb-6">Recent Activity</h3>
          <div className="space-y-3 lg:space-y-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/20 p-4 lg:p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center icon-float">
                  <Shield className="w-6 h-6 lg:w-7 lg:h-7" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-primary lg:text-lg">Donation Verified</p>
                  <p className="text-sm lg:text-base text-secondary">Your donation at KIMS Hospital has been verified</p>
                </div>
                <div className="text-xs lg:text-sm text-tertiary bg-gray-100 px-2 py-1 rounded-full">2 days ago</div>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-border/20 p-4 lg:p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center icon-float" style={{ animationDelay: '0.5s' }}>
                  <Trophy className="w-6 h-6 lg:w-7 lg:h-7" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-primary lg:text-lg">Achievement Unlocked</p>
                  <p className="text-sm lg:text-base text-secondary">Earned "Regular Donor" badge</p>
                </div>
                <div className="text-xs lg:text-sm text-tertiary bg-gray-100 px-2 py-1 rounded-full">1 week ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="mb-8 lg:mb-12 bg-gradient-to-r from-blood-light/80 to-blood-light/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-blood/20 shadow-lg border-l-4 border-l-blood">
          <div className="flex items-start gap-4 lg:gap-6">
            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-blood/20 text-blood rounded-2xl flex items-center justify-center icon-float">
              <Activity className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 animate-pulse" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blood mb-2 text-base md:text-lg lg:text-xl">Lives Waiting for You</h4>
              <p className="text-secondary mb-4 text-sm md:text-base lg:text-lg">
                3 people with your blood type need help within 10km
              </p>
              <button 
                onClick={() => onNavigate('feed')}
                className="btn-mobile btn-mobile-primary text-sm hover:scale-105 transition-transform duration-200"
              >
                <Heart className="w-4 h-4 mr-2 animate-pulse" />
                Answer the Call
              </button>
            </div>
          </div>
        </div>

        {/* Inspirational CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl lg:rounded-3xl p-6 md:p-8 lg:p-12 border border-border/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-blood/5 rounded-full transform translate-x-12 md:translate-x-16 lg:translate-x-20 -translate-y-12 md:-translate-y-16 lg:-translate-y-20 icon-float"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-success/5 rounded-full transform -translate-x-16 md:-translate-x-20 lg:-translate-x-24 translate-y-16 md:translate-y-20 lg:translate-y-24 icon-float" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blood/20 to-blood/10 rounded-2xl md:rounded-3xl lg:rounded-4xl flex items-center justify-center mx-auto mb-4 md:mb-6 lg:mb-8 icon-float shadow-lg">
                <Heart className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blood animate-pulse" />
              </div>
              
              <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-2 md:mb-3 lg:mb-4">Be the Miracle Someone Needs</h4>
              <p className="text-sm md:text-base lg:text-lg text-secondary mb-6 md:mb-8 lg:mb-10 max-w-sm md:max-w-md lg:max-w-lg mx-auto leading-relaxed">
                Your blood type could be the exact match that saves a life today. 
                Every hero starts with a single choice.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 lg:gap-6 justify-center mb-4 md:mb-6 lg:mb-8">
                <button 
                  onClick={() => onNavigate('map')}
                  className="btn-mobile btn-mobile-primary hover:scale-105 transition-transform duration-200 shadow-lg"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Start My Hero Journey
                </button>
                <button 
                  onClick={() => onNavigate('feed')}
                  className="btn-mobile btn-mobile-secondary hover:scale-105 transition-transform duration-200"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  See Who Needs Help
                </button>
              </div>
              
              <p className="text-xs md:text-sm text-tertiary bg-gray-100/60 rounded-full px-3 md:px-4 lg:px-6 py-1 md:py-2 inline-block">
                Join 2,847 verified heroes in your area
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}