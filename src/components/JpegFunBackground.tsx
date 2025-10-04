export function JpegFunBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base Dark Gradient - jpeg.fun style */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black"></div>
      
      {/* Subtle Blood Donation Color Wash */}
      <div className="absolute inset-0 bg-gradient-to-tr from-red-950/20 via-transparent to-blue-950/10"></div>
      
      {/* Clean Minimalist Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>
      
      {/* Floating Blood Cells - Minimal & Clean */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={`cell-${i}`}
            className="absolute opacity-30 animate-pulse-gentle"
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + i}s`
            }}
          >
            <div 
              className="w-3 h-3 bg-red-500/40 rounded-full blur-sm"
              style={{
                transform: `scale(${0.8 + Math.random() * 0.4})`
              }}
            ></div>
          </div>
        ))}
      </div>
      
      {/* Blockchain Network Nodes - Simple & Modern */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={`node-${i}`}
            className="absolute opacity-20"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${30 + (i * 8)}%`,
            }}
          >
            <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400/50"></div>
            
            {/* Simple connecting lines */}
            <div 
              className="absolute w-8 h-px bg-gradient-to-r from-cyan-400/30 to-transparent"
              style={{ 
                left: '2px',
                top: '2px',
                transform: `rotate(${45 + i * 30}deg)` 
              }}
            ></div>
          </div>
        ))}
      </div>
      
      {/* Subtle Light Rays - jpeg.fun aesthetic */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 right-0 w-96 h-96 opacity-5"
          style={{
            background: 'radial-gradient(circle at center, white 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-80 h-80 opacity-5"
          style={{
            background: 'radial-gradient(circle at center, #06b6d4 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        ></div>
      </div>
      
      {/* Clean Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
      
      {/* Professional Overlay */}
      <div className="absolute inset-0 bg-black/5"></div>
    </div>
  );
}