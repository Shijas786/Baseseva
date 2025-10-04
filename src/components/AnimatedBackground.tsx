import { useEffect, useState } from 'react';
import { Heart, Activity, Droplets } from 'lucide-react';

export function AnimatedBackground() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    type: 'heart' | 'pulse' | 'drop';
    left: number;
    delay: number;
    duration: number;
    size: number;
  }>>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile/tablet for performance optimization
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      
      // Reduce particles on mobile for performance
      const particleCount = isMobile ? 8 : 15;
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          type: ['heart', 'pulse', 'drop'][Math.floor(Math.random() * 3)] as 'heart' | 'pulse' | 'drop',
          left: Math.random() * 100, // Random horizontal position (%)
          delay: Math.random() * (isMobile ? 8 : 10), // Shorter delays on mobile
          duration: (isMobile ? 10 : 8) + Math.random() * (isMobile ? 8 : 12), // Slower on mobile
          size: 0.5 + Math.random() * (isMobile ? 1 : 1.5) // Smaller on mobile
        });
      }
      
      setParticles(newParticles);
    };

    generateParticles();
    
    // Longer intervals on mobile to reduce CPU usage
    const interval = setInterval(generateParticles, isMobile ? 45000 : 30000);
    
    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <div className="floating-particles">
      {particles.map((particle) => {
        const baseSize = particle.type === 'heart' ? 20 : particle.type === 'pulse' ? 30 : 15;
        const size = baseSize * particle.size;
        
        return (
          <div
            key={particle.id}
            className={`${particle.type}-particle`}
            style={{
              left: `${particle.left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          >
            {particle.type === 'heart' && (
              <Heart 
                className="w-full h-full" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.3))' }}
              />
            )}
            {particle.type === 'pulse' && (
              <div className="w-full h-full border-2 border-red-400/40 rounded-full" />
            )}
            {particle.type === 'drop' && (
              <Droplets 
                className="w-full h-full text-red-400/40" 
                style={{ filter: 'drop-shadow(0 0 6px rgba(220, 38, 38, 0.2))' }}
              />
            )}
          </div>
        );
      })}
      
      {/* Additional EKG-style lines */}
      <div className="absolute top-1/4 left-0 right-0 h-px bg-red-400/20">
        <div className="ekg-line" style={{ left: '10%', animationDelay: '0s' }} />
        <div className="ekg-line" style={{ left: '30%', animationDelay: '0.5s' }} />
        <div className="ekg-line" style={{ left: '50%', animationDelay: '1s' }} />
        <div className="ekg-line" style={{ left: '70%', animationDelay: '1.5s' }} />
        <div className="ekg-line" style={{ left: '90%', animationDelay: '2s' }} />
      </div>
      
      <div className="absolute top-3/4 left-0 right-0 h-px bg-red-400/20">
        <div className="ekg-line" style={{ left: '20%', animationDelay: '0.3s' }} />
        <div className="ekg-line" style={{ left: '40%', animationDelay: '0.8s' }} />
        <div className="ekg-line" style={{ left: '60%', animationDelay: '1.3s' }} />
        <div className="ekg-line" style={{ left: '80%', animationDelay: '1.8s' }} />
      </div>
    </div>
  );
}