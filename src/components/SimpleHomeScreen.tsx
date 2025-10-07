import { memo, useState, useEffect, useCallback } from 'react';
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

  // Mobile-optimized images with smaller sizes
  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1683791895200-201c0c40310f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMGRvbmF0aW9uJTIwbWVkaWNhbCUyMGhlcm9lc3xlbnwxfHx8fDE3NTk0NzE4MDB8MA&ixlib=rb-4.1.0&q=80&w=640&utm_source=figma&utm_medium=referral",
      title: "Every Drop Counts",
      quote: "Every drop counts, every donation saves lives",
      author: "Be a Hero Today",
      description: "Your donation can save up to 3 lives"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1666886573590-5815157da865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJvZmVzc2lvbmFscyUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzU5NDcxODA0fDA&ixlib=rb-4.1.0&q=80&w=640&utm_source=figma&utm_medium=referral",
      title: "Gift of Life",
      quote: "The gift of blood is the gift of life",
      author: "Share Your Life Force",
      description: "Be someone's miracle today"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1530043123514-c01b94ef483b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29tbXVuaXR5JTIwaGVscGluZ3xlbnwxfHx8fDE3NTk0NzE4MDh8MA&ixlib=rb-4.1.0&q=80&w=640&utm_source=figma&utm_medium=referral",
      title: "Time is Critical",
      quote: "Donate blood, because life doesn't wait",
      author: "Time is Critical",
      description: "Someone needs help right now"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1617080090911-91409e3496ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMGhlYXJ0JTIwY2hhcml0eXxlbnwxfHx8fDE3NTk0NzE4MTF8MA&ixlib=rb-4.1.0&q=80&w=640&utm_source=figma&utm_medium=referral",
      title: "Author of Hope",
      quote: "Your blood can write someone's survival story",
      author: "Be the Author of Hope",
      description: "Create hope with your donation"
    }
  ];

  // Optimized auto-advance - less frequent for mobile performance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000); // Increased interval for mobile performance
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, [heroSlides.length]);

  // Simplified swipe support for mobile
  const swipeHandlers = useSwipe({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
    threshold: 50
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Hero Section */}
      <div className="relative h-48 md:h-64 bg-gray-900 overflow-hidden">
        <img
          src={heroSlides[currentSlide].image}
          alt={heroSlides[currentSlide].title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Simplified Content */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center text-white">
            <h1 className="text-lg md:text-2xl font-bold mb-1">{heroSlides[currentSlide].title}</h1>
            <p className="text-sm md:text-base">{heroSlides[currentSlide].quote}</p>
          </div>
        </div>

        {/* Simple Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-2 rounded-full"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-2 rounded-full"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Simple Dots */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-1.5 h-1.5 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="p-4">
        {/* Simple Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => onNavigate('feed')}
            className="bg-white p-3 rounded-lg border border-gray-200 active:bg-gray-50"
          >
            <Heart className="w-6 h-6 text-red-600 mb-2 mx-auto" />
            <h3 className="font-medium text-gray-900 text-sm">View Requests</h3>
            <p className="text-xs text-gray-600">See blood requests</p>
          </button>

          <button
            onClick={() => onNavigate('upload')}
            className="bg-white p-3 rounded-lg border border-gray-200 active:bg-gray-50"
          >
            <Upload className="w-6 h-6 text-green-600 mb-2 mx-auto" />
            <h3 className="font-medium text-gray-900 text-sm">Record Donation</h3>
            <p className="text-xs text-gray-600">Upload proof</p>
          </button>

          <button
            onClick={() => onNavigate('map')}
            className="bg-white p-3 rounded-lg border border-gray-200 active:bg-gray-50"
          >
            <MapPin className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
            <h3 className="font-medium text-gray-900 text-sm">Find Centers</h3>
            <p className="text-xs text-gray-600">Locate centers</p>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="bg-white p-3 rounded-lg border border-gray-200 active:bg-gray-50"
          >
            <Trophy className="w-6 h-6 text-yellow-600 mb-2 mx-auto" />
            <h3 className="font-medium text-gray-900 text-sm">My Profile</h3>
            <p className="text-xs text-gray-600">View achievements</p>
          </button>
        </div>

        {/* Simple Stats */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <h3 className="font-medium text-gray-900 mb-3 text-center">Your Impact</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-red-600">5</div>
              <div className="text-xs text-gray-600">Donations</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">15</div>
              <div className="text-xs text-gray-600">Lives Saved</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">3</div>
              <div className="text-xs text-gray-600">Streak</div>
            </div>
          </div>
        </div>

        {/* Simple Progress */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Progress to Hero</h3>
            <span className="text-sm font-bold text-red-600">{donationProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-full bg-red-600 rounded-full"
              style={{ width: `${donationProgress}%` }}
            />
          </div>
        </div>

        {/* Emergency Alert */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-600 text-sm">3 people need help</p>
              <p className="text-xs text-gray-600">Within 10km of your location</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('feed')}
            className="w-full mt-3 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium"
          >
            Answer the Call
          </button>
        </div>
      </div>
    </div>
  );
});
