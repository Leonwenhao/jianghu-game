'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface InkWashBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

interface ParticleData {
  id: number;
  bgR: number;
  bgG: number;
  bgB: number;
  bgA: number;
  initialX: number;
  initialY: number;
  initialScale: number;
  animateX: number;
  animateY: number;
  duration: number;
}

export function InkWashBackground({ intensity = 'medium', className = '' }: InkWashBackgroundProps) {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const particleCount = intensity === 'low' ? 10 : intensity === 'medium' ? 20 : 30;

  useEffect(() => {
    setIsMounted(true);
    const width = window.innerWidth;
    const height = window.innerHeight;
    setDimensions({ width, height });

    // Generate particle data only on client side
    const newParticles: ParticleData[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      bgR: 139 + Math.random() * 30,
      bgG: 90 + Math.random() * 30,
      bgB: 43 + Math.random() * 30,
      bgA: 0.1 + Math.random() * 0.2,
      initialX: Math.random() * width,
      initialY: Math.random() * height,
      initialScale: 0.5 + Math.random() * 1.5,
      animateX: width * (0.2 + Math.random() * 0.6),
      animateY: Math.random() * height,
      duration: 10 + Math.random() * 20,
    }));
    setParticles(newParticles);
  }, [particleCount]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 ink-wash-bg" />

      {/* Animated ink particles - only render after mount to avoid hydration mismatch */}
      {isMounted && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `rgba(${particle.bgR}, ${particle.bgG}, ${particle.bgB}, ${particle.bgA})`,
          }}
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            scale: particle.initialScale,
          }}
          animate={{
            y: [null, particle.animateY],
            x: [null, particle.animateX],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      ))}

      {/* Floating mist layers */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(ellipse at 30% 40%, rgba(139, 90, 43, 0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse at 70% 60%, rgba(139, 90, 43, 0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse at 30% 40%, rgba(139, 90, 43, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <motion.div
        className="absolute inset-0 opacity-15"
        animate={{
          background: [
            'radial-gradient(ellipse at 60% 30%, rgba(90, 125, 76, 0.3) 0%, transparent 40%)',
            'radial-gradient(ellipse at 40% 70%, rgba(90, 125, 76, 0.3) 0%, transparent 40%)',
            'radial-gradient(ellipse at 60% 30%, rgba(90, 125, 76, 0.3) 0%, transparent 40%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
    </div>
  );
}
