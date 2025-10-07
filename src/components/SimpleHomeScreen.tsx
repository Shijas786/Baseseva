import { memo, useState, useEffect } from 'react';
import { 
  Droplets, 
  Heart, 
  Trophy, 
  Shield,
  MapPin, 
  Upload, 
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useSwipe } from './hooks/useSwipe';

interface SimpleHomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const SimpleHomeScreen = memo(({ onNavigate }: SimpleHomeScreenProps) => {
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
    <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-white to-blue-50/50">
      {/* Netflix-Style Hero Cards */}
      <div className="py-4 md:py-8">
        <div className="container px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Netflix-Style Card */}
            <div 
              className="relative h-[400px] md:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
              {...swipeHandlers}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <div className="max-w-2xl">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                    {heroSlides[currentSlide].title}
                  </h2>
                  
                  <div className="mb-4 md:mb-6">
                    <p className="text-base md:text-lg text-white font-medium mb-2 leading-relaxed">
                      "{heroSlides[currentSlide].quote}"
                    </p>
                    <p className="text-sm md:text-base text-white/80 font-medium">
                      — {heroSlides[currentSlide].author}
                    </p>
                  </div>
                  
                  <p className="text-sm md:text-base text-white/90 mb-6 md:mb-8 leading-relaxed">
                    {heroSlides[currentSlide].description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button 
                      onClick={() => onNavigate('upload')}
                      className="bg-white text-gray-900 hover:bg-white/90 px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <Upload className="w-4 h-4 md:w-5 md:h-5" />
                      Record Donation
                    </button>
                    <button 
                      onClick={() => onNavigate('map')}
                      className="bg-white/20 text-white hover:bg-white/30 px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 border border-white/30"
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
                className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Netflix-style indicators */}
              <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 flex gap-1">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-8 h-1 md:w-12 md:h-1 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Card Thumbnails */}
            <div className="hidden md:flex mt-6 gap-3 justify-center">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`relative w-20 h-12 rounded-lg overflow-hidden transition-all ${
                    index === currentSlide ? 'ring-2 ring-red-500 scale-110' : 'opacity-60 hover:opacity-100'
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
      <div className="container px-4 md:px-6 py-4 md:py-8 max-w-7xl mx-auto">
        {/* Blood Donation Facts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white/70 rounded-xl p-4 text-center border border-gray-200/30 shadow-lg">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Heart className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 md:mb-2">1 Donation</h4>
            <p className="text-sm text-gray-600">Can save up to 3 lives</p>
          </div>

          <div className="bg-white/70 rounded-xl p-4 text-center border border-gray-200/30 shadow-lg">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Activity className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 md:mb-2">Every 2 Seconds</h4>
            <p className="text-sm text-gray-600">Someone needs blood</p>
          </div>

          <div className="bg-white/70 rounded-xl p-4 text-center border border-gray-200/30 shadow-lg">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 md:mb-2">Only 3%</h4>
            <p className="text-sm text-gray-600">Of eligible people donate</p>
          </div>
        </div>

        {/* Desktop Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200/30 shadow-lg">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Your Actions Matter</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="bg-white/60 rounded-xl border border-gray-200/20 p-3 md:p-4 hover:bg-white/80 transition-all cursor-pointer border-l-4 border-l-red-600 active:scale-95"
                     onClick={() => onNavigate('upload')}>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Upload className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-0.5 md:mb-1 text-sm md:text-base">Record Your Donation</h4>
                      <p className="text-xs md:text-sm text-gray-600">Secure your life-saving act on blockchain</p>
                    </div>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl border border-gray-200/20 p-3 md:p-4 hover:bg-white/80 transition-all cursor-pointer border-l-4 border-l-green-600 active:scale-95"
                     onClick={() => onNavigate('feed')}>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-0.5 md:mb-1 text-sm md:text-base">Answer the Call</h4>
                      <p className="text-xs md:text-sm text-gray-600">Someone nearby needs your blood type</p>
                    </div>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl border border-gray-200/20 p-3 md:p-4 hover:bg-white/80 transition-all cursor-pointer border-l-4 border-l-blue-600 active:scale-95"
                     onClick={() => onNavigate('map')}>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-0.5 md:mb-1 text-sm md:text-base">Find Donation Centers</h4>
                      <p className="text-xs md:text-sm text-gray-600">Locate the nearest blood donation facility</p>
                    </div>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Progress */}
          <div className="space-y-6">
            {/* Your Impact Stats */}
            <div className="bg-white/70 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200/30 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Your Impact</h3>
                <button 
                  onClick={() => onNavigate('profile')}
                  className="text-xs md:text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  View all <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/60 rounded-xl border border-gray-200/20 p-4 hover:scale-105 transition-transform">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Total Donations</p>
                      <p className="text-xl md:text-2xl font-bold text-red-600 mb-1">4</p>
                      <p className="text-xs text-gray-600">Lives saved: 12+</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-red-50 rounded-xl flex items-center justify-center">
                      <Droplets className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <span>↗</span>
                    <span>25% vs last month</span>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl border border-gray-200/20 p-4 hover:scale-105 transition-transform">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Current Streak</p>
                      <p className="text-xl md:text-2xl font-bold text-orange-600">{streakCount}mo</p>
                      <p className="text-xs text-gray-600">Consistent donations</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Trophy className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <span>↗</span>
                    <span>12% vs last month</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Section */}
            <div className="bg-white/70 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200/30 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-red-600" />
                    Your Life-Saving Journey
                  </h4>
                  <p className="text-sm text-gray-600">Progress to becoming a hero</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-600">{donationProgress}%</div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden mb-4 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 rounded-full transition-all relative"
                  style={{ width: `${donationProgress}%` }}
                >
                  <div className="absolute right-0 top-1/2 w-4 h-4 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 text-center">
                <span className="text-red-600 font-medium">{100 - donationProgress}% more</span> to unlock your next lifesaver badge!
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="mb-8 bg-gradient-to-r from-red-50 to-red-100/60 rounded-xl md:rounded-2xl p-4 md:p-6 border border-red-200/20 shadow-lg border-l-4 border-l-red-600">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-600 mb-2 text-base md:text-lg">Lives Waiting for You</h4>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                3 people with your blood type need help within 10km
              </p>
              <button 
                onClick={() => onNavigate('feed')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
              >
                <Heart className="w-4 h-4" />
                Answer the Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
