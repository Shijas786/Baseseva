import { useEffect, useState } from 'react';

export function AbstractWeb3Background() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setMounted(true);

    // Mouse tracking for desktop interaction
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
      
      // Update CSS custom properties for interactive glow
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950"></div>
      
      {/* Deep Crimson to Midnight Blue Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-blue-950/30 to-cyan-950/20"></div>
      
      {/* Atmospheric Background Image */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat mix-blend-overlay"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1728810745136-d198019fc1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBsaWdodGluZyUyMHZvbHVtZXRyaWMlMjBkZXB0aCUyMHVsdHJhJTIwY2xlYW4lMjBVSSUyMGJhY2tkcm9wJTIwZGFyayUyMGdyYWRpZW50JTIwY3JpbXNvbiUyMGJsdWV8ZW58MXx8fHwxNzU5NTgxMDE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      ></div>

      {/* Floating Plasma Cells - Layer 1 (Furthest) */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={`plasma-1-${i}`}
            className="absolute opacity-20 animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-red-500/30 to-red-600/20 rounded-full blur-lg animate-pulse-gentle"></div>
          </div>
        ))}
      </div>

      {/* Network Mesh Lines - Background Layer */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="network" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path 
                d="M 0 60 L 60 0 L 120 60 L 60 120 Z" 
                stroke="url(#networkGradient)" 
                strokeWidth="0.5" 
                fill="none"
                className="animate-pulse-slow"
              />
            </pattern>
            <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
              <stop offset="50%" style={{ stopColor: '#06b6d4', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#network)" />
        </svg>
      </div>

      {/* Blockchain Node Particles - Mid Layer */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={`node-${i}`}
            className="absolute animate-float-medium"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${8 + Math.random() * 8}s`
            }}
          >
            <div className="relative">
              {/* Node Core */}
              <div className="w-2 h-2 bg-cyan-400/60 rounded-full shadow-lg shadow-cyan-400/30 animate-pulse"></div>
              
              {/* Connection Lines */}
              <div className="absolute inset-0">
                <div 
                  className="absolute w-12 h-0.5 bg-gradient-to-r from-cyan-400/20 to-transparent"
                  style={{ transform: `rotate(${Math.random() * 360}deg)` }}
                ></div>
                <div 
                  className="absolute w-8 h-0.5 bg-gradient-to-r from-blue-400/20 to-transparent"
                  style={{ transform: `rotate(${Math.random() * 360}deg)` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Liquid Light Waves */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent skew-y-12 animate-wave-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -skew-y-6 animate-wave-medium"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent skew-y-3 animate-wave-fast"></div>
      </div>

      {/* Floating Plasma Cells - Layer 2 (Closer) */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={`plasma-2-${i}`}
            className="absolute opacity-40 animate-float-medium"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 8}s`
            }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-red-500/40 to-red-600/30 rounded-full blur-md animate-pulse-gentle filter drop-shadow-lg"></div>
          </div>
        ))}
      </div>

      {/* Light Refractions & Rays */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(4)].map((_, i) => (
          <div
            key={`ray-${i}`}
            className="absolute animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          >
            <div 
              className="w-0.5 h-32 bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent blur-sm"
              style={{ transform: `rotate(${Math.random() * 360}deg)` }}
            ></div>
          </div>
        ))}
      </div>

      {/* Foreground Plasma Cells - Layer 3 (Closest) */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={`plasma-3-${i}`}
            className="absolute opacity-60 animate-float-fast"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${6 + Math.random() * 6}s`
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-red-400/50 to-red-500/40 rounded-full blur-sm animate-pulse-gentle filter drop-shadow-2xl"></div>
          </div>
        ))}
      </div>

      {/* Particle Trails */}
      <div className="absolute inset-0">
        {[...Array(16)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute animate-particle-trail"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }}
          >
            <div className="w-1 h-1 bg-cyan-400/80 rounded-full shadow-sm shadow-cyan-400/50 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Glassmorphism Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black/[0.05] backdrop-blur-[0.5px]"></div>

      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20"></div>

      {/* Interactive Glow Effect (responds to mouse on desktop) */}
      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-1000 pointer-events-none hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(6, 182, 212, 0.08), transparent 40%)`
        }}
      ></div>
    </div>
  );
}

// Add these custom CSS animations to your globals.css or create a separate CSS file
const styles = `
@keyframes float-slow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(10px, -15px) scale(1.05); }
  50% { transform: translate(-5px, -25px) scale(0.95); }
  75% { transform: translate(-15px, -10px) scale(1.02); }
}

@keyframes float-medium {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(15px, -20px) scale(1.08); }
  66% { transform: translate(-12px, -8px) scale(0.92); }
}

@keyframes float-fast {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(8px, -12px) scale(1.1); }
}

@keyframes pulse-gentle {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

@keyframes wave-slow {
  0% { transform: translateX(-100%) skewY(12deg); }
  100% { transform: translateX(100%) skewY(12deg); }
}

@keyframes wave-medium {
  0% { transform: translateX(-100%) skewY(-6deg); }
  100% { transform: translateX(100%) skewY(-6deg); }
}

@keyframes wave-fast {
  0% { transform: translateX(-100%) skewY(3deg); }
  100% { transform: translateX(100%) skewY(3deg); }
}

@keyframes particle-trail {
  0% { 
    transform: translate(0, 0) scale(0); 
    opacity: 0; 
  }
  10% { 
    transform: translate(10px, -10px) scale(1); 
    opacity: 1; 
  }
  90% { 
    transform: translate(100px, -50px) scale(0.5); 
    opacity: 0.8; 
  }
  100% { 
    transform: translate(120px, -60px) scale(0); 
    opacity: 0; 
  }
}

.animate-float-slow {
  animation: float-slow 20s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 12s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 8s ease-in-out infinite;
}

.animate-pulse-gentle {
  animation: pulse-gentle 4s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
}

.animate-wave-slow {
  animation: wave-slow 25s linear infinite;
}

.animate-wave-medium {
  animation: wave-medium 18s linear infinite;
}

.animate-wave-fast {
  animation: wave-fast 12s linear infinite;
}

.animate-particle-trail {
  animation: particle-trail 15s linear infinite;
}

.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}