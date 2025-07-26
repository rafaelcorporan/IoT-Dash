import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize nodes (representing IoT devices in a network)
    const nodeCount = Math.floor((width * height) / 25000); // Responsive node count
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: []
      });
    }

    nodesRef.current = nodes;

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Create network grid background
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update node positions
      nodes.forEach((node, i) => {
        // Boundary collision
        if (node.x <= 0 || node.x >= width) node.vx *= -1;
        if (node.y <= 0 || node.y >= height) node.vy *= -1;

        // Mouse attraction (represents network activity)
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150 * 0.001;
          node.vx += dx * force;
          node.vy += dy * force;
        }

        // Apply velocity with damping
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Keep within bounds
        node.x = Math.max(5, Math.min(width - 5, node.x));
        node.y = Math.max(5, Math.min(height - 5, node.y));
      });

      // Draw connections (network links)
      nodes.forEach((node, i) => {
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              const opacity = Math.max(0, (150 - distance) / 150 * 0.2);
              
              // Different connection types for security themes
              if (distance < 80) {
                // Secure connections (green/cyan)
                ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
                ctx.lineWidth = 1.5;
              } else if (distance < 120) {
                // Normal connections (blue)
                ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                ctx.lineWidth = 1;
              } else {
                // Weak connections (gray)
                ctx.strokeStyle = `rgba(156, 163, 175, ${opacity})`;
                ctx.lineWidth = 0.5;
              }

              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.stroke();
            }
          }
        });
      });

      // Draw nodes (IoT devices)
      nodes.forEach((node, i) => {
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time + i * 0.5) * 0.5 + 0.5;
        
        // Mouse proximity effect
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, (200 - distance) / 200);
        
        // Node types based on position and activity
        const nodeType = i % 4;
        let color = '';
        let size = 2;
        
        switch (nodeType) {
          case 0: // Gateway nodes (larger, blue)
            color = `rgba(59, 130, 246, ${0.6 + pulse * 0.3 + proximity * 0.4})`;
            size = 3 + proximity * 2;
            break;
          case 1: // Sensor nodes (green)
            color = `rgba(16, 185, 129, ${0.4 + pulse * 0.2 + proximity * 0.3})`;
            size = 2 + proximity * 1.5;
            break;
          case 2: // Security nodes (cyan)
            color = `rgba(8, 145, 178, ${0.5 + pulse * 0.3 + proximity * 0.3})`;
            size = 2.5 + proximity * 1.5;
            break;
          case 3: // Warning nodes (yellow - occasional)
            if (Math.sin(time * 2 + i) > 0.7) {
              color = `rgba(245, 158, 11, ${0.7 + pulse * 0.3})`;
              size = 3 + pulse * 2;
            } else {
              color = `rgba(156, 163, 175, ${0.3 + pulse * 0.2 + proximity * 0.2})`;
              size = 1.5 + proximity;
            }
            break;
        }

        // Draw node with glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = size * 2;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw security shield icon on some nodes
        if (nodeType === 2 && proximity > 0.3) {
          ctx.strokeStyle = `rgba(8, 145, 178, ${proximity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          // Simple shield shape
          ctx.moveTo(node.x, node.y - 8);
          ctx.lineTo(node.x - 4, node.y - 4);
          ctx.lineTo(node.x - 4, node.y + 2);
          ctx.lineTo(node.x, node.y + 6);
          ctx.lineTo(node.x + 4, node.y + 2);
          ctx.lineTo(node.x + 4, node.y - 4);
          ctx.closePath();
          ctx.stroke();
        }
      });

      // Add scanning effect (security radar)
      const scanTime = Date.now() * 0.0005;
      const scanRadius = Math.sin(scanTime) * 100 + 150;
      const scanX = width * 0.8;
      const scanY = height * 0.2;
      
      ctx.strokeStyle = `rgba(16, 185, 129, 0.1)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(scanX, scanY, scanRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeStyle = `rgba(16, 185, 129, 0.05)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(scanX, scanY, scanRadius + 20, 0, Math.PI * 2);
      ctx.stroke();

      // Data flow animation (packets moving between nodes)
      const flowTime = Date.now() * 0.003;
      nodes.forEach((node, i) => {
        if (i < nodes.length - 1) {
          const nextNode = nodes[i + 1];
          const progress = (Math.sin(flowTime + i) + 1) / 2;
          const x = node.x + (nextNode.x - node.x) * progress;
          const y = node.y + (nextNode.y - node.y) * progress;
          
          if (Math.sqrt((nextNode.x - node.x) ** 2 + (nextNode.y - node.y) ** 2) < 150) {
            ctx.fillStyle = `rgba(59, 130, 246, ${0.8 * Math.sin(flowTime * 2 + i)})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default AnimatedBackground;