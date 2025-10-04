import { useEffect, useRef } from 'react';

interface Web3HealthBackgroundProps {
  className?: string;
}

export function Web3HealthBackground({ className = '' }: Web3HealthBackgroundProps) {
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

    // Blockchain nodes
    const nodes: Array<{
      x: number;
      y: number;
      radius: number;
      pulse: number;
      pulseSpeed: number;
      connections: number[];
    }> = [];

    // Plasma particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      type: 'blood' | 'data';
    }> = [];

    // Digital vein segments
    const veins: Array<{
      points: Array<{ x: number; y: number }>;
      intensity: number;
      flow: number;
    }> = [];

    // Initialize blockchain nodes
    const initNodes = () => {
      const nodeCount = 15;
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 3 + Math.random() * 4,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02,
          connections: []
        });
      }

      // Create connections between nearby nodes
      nodes.forEach((node, i) => {
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + 
              Math.pow(node.y - otherNode.y, 2)
            );
            if (distance < 150 && node.connections.length < 3) {
              node.connections.push(j);
            }
          }
        });
      });
    };

    // Initialize digital veins
    const initVeins = () => {
      const veinCount = 8;
      for (let i = 0; i < veinCount; i++) {
        const points: Array<{ x: number; y: number }> = [];
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        
        let currentX = startX;
        let currentY = startY;
        
        // Create organic vein path
        for (let j = 0; j < 20 + Math.random() * 30; j++) {
          points.push({ x: currentX, y: currentY });
          
          // Organic branching movement
          const angle = Math.random() * Math.PI * 2;
          const distance = 15 + Math.random() * 25;
          currentX += Math.cos(angle) * distance;
          currentY += Math.sin(angle) * distance;
          
          // Keep within bounds
          currentX = Math.max(0, Math.min(canvas.width, currentX));
          currentY = Math.max(0, Math.min(canvas.height, currentY));
        }
        
        veins.push({
          points,
          intensity: 0.3 + Math.random() * 0.4,
          flow: Math.random() * Math.PI * 2
        });
      }
    };

    // Initialize particles
    const initParticles = () => {
      for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
      }
    };

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 1 + Math.random() * 3,
      life: Math.random() * 100,
      maxLife: 100 + Math.random() * 100,
      type: Math.random() > 0.7 ? 'blood' : 'data' as 'blood' | 'data'
    });

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw digital vein network
      veins.forEach(vein => {
        vein.flow += 0.02;
        
        ctx.strokeStyle = `rgba(59, 130, 246, ${vein.intensity * (0.3 + Math.sin(vein.flow) * 0.2)})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 10]);
        ctx.lineDashOffset = vein.flow * 10;
        
        ctx.beginPath();
        vein.points.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        
        // Draw data flow particles along veins
        if (Math.random() > 0.95) {
          const segmentIndex = Math.floor(Math.random() * (vein.points.length - 1));
          const point = vein.points[segmentIndex];
          
          ctx.fillStyle = `rgba(34, 197, 94, 0.8)`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw blockchain nodes
      nodes.forEach((node, i) => {
        node.pulse += node.pulseSpeed;
        
        // Node glow effect
        const pulseSize = 1 + Math.sin(node.pulse) * 0.3;
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * pulseSize * 3
        );
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.8)');
        gradient.addColorStop(0.5, 'rgba(79, 70, 229, 0.3)');
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulseSize * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Node core
        ctx.fillStyle = `rgba(79, 70, 229, ${0.8 + Math.sin(node.pulse) * 0.2})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connections
        node.connections.forEach(connectionIndex => {
          const targetNode = nodes[connectionIndex];
          if (targetNode) {
            const opacity = 0.15 + Math.sin(node.pulse + targetNode.pulse) * 0.1;
            ctx.strokeStyle = `rgba(79, 70, 229, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 6]);
            ctx.lineDashOffset = Date.now() * 0.01;
            
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.stroke();
            
            // Data packet flowing along connection
            if (Math.random() > 0.98) {
              const progress = (Date.now() * 0.001) % 1;
              const x = node.x + (targetNode.x - node.x) * progress;
              const y = node.y + (targetNode.y - node.y) * progress;
              
              ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
      });

      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Reset particle if life expired
        if (particle.life > particle.maxLife) {
          particles[i] = createParticle();
          return;
        }
        
        const lifeRatio = 1 - (particle.life / particle.maxLife);
        const opacity = lifeRatio * 0.6;
        
        if (particle.type === 'blood') {
          // Blood cell particles
          ctx.fillStyle = `rgba(239, 68, 68, ${opacity})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * lifeRatio, 0, Math.PI * 2);
          ctx.fill();
          
          // Blood cell inner structure
          ctx.fillStyle = `rgba(185, 28, 28, ${opacity * 0.5})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * lifeRatio * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Data particles
          ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;
          ctx.fillRect(
            particle.x - particle.size * lifeRatio / 2,
            particle.y - particle.size * lifeRatio / 2,
            particle.size * lifeRatio,
            particle.size * lifeRatio
          );
        }
      });

      // Draw floating holographic blood drop
      const time = Date.now() * 0.001;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const floatY = Math.sin(time * 0.5) * 20;
      
      // Holographic grid under blood drop
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      
      for (let i = -5; i <= 5; i++) {
        for (let j = -5; j <= 5; j++) {
          const gridX = centerX + i * 30;
          const gridY = centerY + j * 30 + floatY * 0.3;
          
          if (Math.abs(gridX - centerX) < 150 && Math.abs(gridY - centerY) < 150) {
            ctx.strokeRect(gridX - 15, gridY - 15, 30, 30);
          }
        }
      }
      
      // 3D holographic blood drop
      const dropSize = 25 + Math.sin(time * 2) * 3;
      const gradient = ctx.createRadialGradient(
        centerX, centerY + floatY, 0,
        centerX, centerY + floatY, dropSize * 2
      );
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
      gradient.addColorStop(0.6, 'rgba(239, 68, 68, 0.4)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      // Blood drop shape
      ctx.arc(centerX, centerY + floatY + dropSize * 0.3, dropSize * 0.8, 0, Math.PI * 2);
      ctx.moveTo(centerX, centerY + floatY - dropSize);
      ctx.quadraticCurveTo(
        centerX - dropSize * 0.3, centerY + floatY - dropSize * 0.5,
        centerX - dropSize * 0.5, centerY + floatY
      );
      ctx.quadraticCurveTo(
        centerX - dropSize * 0.3, centerY + floatY + dropSize * 0.5,
        centerX, centerY + floatY + dropSize
      );
      ctx.quadraticCurveTo(
        centerX + dropSize * 0.3, centerY + floatY + dropSize * 0.5,
        centerX + dropSize * 0.5, centerY + floatY
      );
      ctx.quadraticCurveTo(
        centerX + dropSize * 0.3, centerY + floatY - dropSize * 0.5,
        centerX, centerY + floatY - dropSize
      );
      ctx.fill();
      
      // Holographic scan lines
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([1, 3]);
      
      for (let i = 0; i < 10; i++) {
        const scanY = centerY + floatY - dropSize + (i / 10) * dropSize * 2;
        ctx.beginPath();
        ctx.moveTo(centerX - dropSize, scanY);
        ctx.lineTo(centerX + dropSize, scanY);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    initNodes();
    initVeins();
    initParticles();
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
      {/* CSS Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-red-900" />
      
      {/* Subtle overlay patterns */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(239, 68, 68, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)
          `
        }}
      />
      
      {/* Polygon mesh overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 40%, rgba(79, 70, 229, 0.5) 50%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, rgba(239, 68, 68, 0.5) 50%, transparent 60%)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Animated canvas layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Top gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/30" />
    </div>
  );
}