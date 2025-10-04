import { useEffect, useRef } from 'react';

interface DarkHealthBackgroundProps {
  className?: string;
}

export function DarkHealthBackground({ className = '' }: DarkHealthBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Floating elements
    const hearts: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      pulse: number;
      pulseSpeed: number;
    }> = [];

    const helpingHands: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      float: number;
      floatSpeed: number;
    }> = [];

    const bloodDrops: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      fall: number;
      fallSpeed: number;
    }> = [];

    const networkNodes: Array<{
      x: number;
      y: number;
      radius: number;
      connections: number[];
      pulse: number;
      pulseSpeed: number;
    }> = [];

    // Initialize hearts
    const initHearts = () => {
      for (let i = 0; i < 8; i++) {
        hearts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 15 + Math.random() * 10,
          opacity: 0.1 + Math.random() * 0.15,
          speed: 0.3 + Math.random() * 0.4,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02
        });
      }
    };

    // Initialize helping hands
    const initHelpingHands = () => {
      for (let i = 0; i < 6; i++) {
        helpingHands.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 20 + Math.random() * 15,
          opacity: 0.05 + Math.random() * 0.1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: 0.005 + Math.random() * 0.01,
          float: Math.random() * Math.PI * 2,
          floatSpeed: 0.015 + Math.random() * 0.01
        });
      }
    };

    // Initialize blood drops
    const initBloodDrops = () => {
      for (let i = 0; i < 12; i++) {
        bloodDrops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 8 + Math.random() * 6,
          opacity: 0.15 + Math.random() * 0.2,
          fall: Math.random() * Math.PI * 2,
          fallSpeed: 0.01 + Math.random() * 0.02
        });
      }
    };

    // Initialize network nodes
    const initNetworkNodes = () => {
      const nodeCount = 12;
      for (let i = 0; i < nodeCount; i++) {
        networkNodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 2 + Math.random() * 3,
          connections: [],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.015
        });
      }

      // Create subtle connections
      networkNodes.forEach((node, i) => {
        networkNodes.forEach((otherNode, j) => {
          if (i !== j) {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + 
              Math.pow(node.y - otherNode.y, 2)
            );
            if (distance < 200 && node.connections.length < 2) {
              node.connections.push(j);
            }
          }
        });
      });
    };

    // Draw heart shape
    const drawHeart = (x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#dc2626';
      
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      
      // Left curve
      ctx.bezierCurveTo(
        x, y, 
        x - size / 2, y, 
        x - size / 2, y + topCurveHeight
      );
      
      ctx.bezierCurveTo(
        x - size / 2, y + (size + topCurveHeight) / 2, 
        x, y + (size + topCurveHeight) / 2, 
        x, y + size
      );
      
      // Right curve
      ctx.bezierCurveTo(
        x, y + (size + topCurveHeight) / 2, 
        x + size / 2, y + (size + topCurveHeight) / 2, 
        x + size / 2, y + topCurveHeight
      );
      
      ctx.bezierCurveTo(
        x + size / 2, y, 
        x, y, 
        x, y + topCurveHeight
      );
      
      ctx.fill();
      ctx.restore();
    };

    // Draw helping hand
    const drawHelpingHand = (x: number, y: number, size: number, opacity: number, rotation: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Hand silhouette
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      
      // Palm
      ctx.ellipse(0, 0, size * 0.4, size * 0.6, 0, 0, Math.PI * 2);
      
      // Fingers
      for (let i = 0; i < 5; i++) {
        const fingerAngle = (i - 2) * 0.3;
        const fingerX = Math.sin(fingerAngle) * size * 0.3;
        const fingerY = -size * 0.4;
        ctx.beginPath();
        ctx.ellipse(fingerX, fingerY, size * 0.08, size * 0.25, fingerAngle, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.fill();
      ctx.restore();
    };

    // Draw blood drop
    const drawBloodDrop = (x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      
      // Gradient for depth
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, '#dc2626');
      gradient.addColorStop(0.7, '#991b1b');
      gradient.addColorStop(1, '#7f1d1d');
      
      ctx.fillStyle = gradient;
      
      ctx.beginPath();
      // Drop shape
      ctx.arc(x, y + size * 0.2, size * 0.7, 0, Math.PI * 2);
      ctx.moveTo(x, y - size * 0.8);
      ctx.quadraticCurveTo(x - size * 0.3, y - size * 0.3, x - size * 0.4, y);
      ctx.quadraticCurveTo(x - size * 0.2, y + size * 0.3, x, y + size * 0.5);
      ctx.quadraticCurveTo(x + size * 0.2, y + size * 0.3, x + size * 0.4, y);
      ctx.quadraticCurveTo(x + size * 0.3, y - size * 0.3, x, y - size * 0.8);
      
      ctx.fill();
      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle network connections
      networkNodes.forEach((node, i) => {
        node.pulse += node.pulseSpeed;
        
        // Draw connections
        node.connections.forEach(connectionIndex => {
          const targetNode = networkNodes[connectionIndex];
          if (targetNode) {
            const opacity = 0.03 + Math.sin(node.pulse) * 0.02;
            ctx.strokeStyle = `rgba(220, 38, 38, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 8]);
            ctx.lineDashOffset = Date.now() * 0.01;
            
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.stroke();
          }
        });

        // Draw node
        const nodeOpacity = 0.1 + Math.sin(node.pulse) * 0.05;
        ctx.fillStyle = `rgba(220, 38, 38, ${nodeOpacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Add soft glow
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 4
        );
        glowGradient.addColorStop(0, `rgba(220, 38, 38, ${nodeOpacity * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw and animate hearts
      hearts.forEach(heart => {
        heart.pulse += heart.pulseSpeed;
        heart.y -= heart.speed;
        
        // Reset position when off screen
        if (heart.y < -50) {
          heart.y = canvas.height + 50;
          heart.x = Math.random() * canvas.width;
        }
        
        const currentSize = heart.size * (1 + Math.sin(heart.pulse) * 0.2);
        const currentOpacity = heart.opacity * (0.8 + Math.sin(heart.pulse) * 0.2);
        
        drawHeart(heart.x, heart.y, currentSize, currentOpacity);
        
        // Add soft glow around hearts
        const glowGradient = ctx.createRadialGradient(
          heart.x, heart.y, 0,
          heart.x, heart.y, currentSize * 2
        );
        glowGradient.addColorStop(0, `rgba(220, 38, 38, ${currentOpacity * 0.2})`);
        glowGradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(heart.x, heart.y, currentSize * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw and animate helping hands
      helpingHands.forEach(hand => {
        hand.rotation += hand.rotationSpeed;
        hand.float += hand.floatSpeed;
        
        const floatY = hand.y + Math.sin(hand.float) * 15;
        
        drawHelpingHand(hand.x, floatY, hand.size, hand.opacity, hand.rotation);
      });

      // Draw and animate blood drops
      bloodDrops.forEach(drop => {
        drop.fall += drop.fallSpeed;
        drop.y += Math.sin(drop.fall) * 0.5 + 0.3;
        
        // Reset position when off screen
        if (drop.y > canvas.height + 50) {
          drop.y = -50;
          drop.x = Math.random() * canvas.width;
        }
        
        drawBloodDrop(drop.x, drop.y, drop.size, drop.opacity);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    initHearts();
    initHelpingHands();
    initBloodDrops();
    initNetworkNodes();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={`fixed inset-0 ${className}`}>
      {/* Deep red gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-950 to-black" />
      
      {/* Subtle overlay gradients for depth */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(220, 38, 38, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(127, 29, 29, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(153, 27, 27, 0.1) 0%, transparent 70%)
          `
        }}
      />
      
      {/* Soft texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 1px,
              rgba(255, 255, 255, 0.03) 1px,
              rgba(255, 255, 255, 0.03) 2px
            )
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Animated canvas layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'overlay' }}
      />
      
      {/* Central glow effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at center, rgba(220, 38, 38, 0.08) 0%, transparent 70%)`
        }}
      />
      
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
    </div>
  );
}