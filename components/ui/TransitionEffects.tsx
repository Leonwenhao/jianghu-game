'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface TransitionEffectsProps {
  isTransitioning: boolean;
  type?: 'ink-dissolve' | 'fade' | 'slide';
}

export function TransitionEffects({ isTransitioning, type = 'ink-dissolve' }: TransitionEffectsProps) {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {type === 'ink-dissolve' && (
            <div className="absolute inset-0 ink-wash-bg">
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 3],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                style={{
                  background: 'radial-gradient(circle, rgba(26,26,26,1) 0%, transparent 70%)',
                  transformOrigin: 'center',
                }}
              />
              {/* Ink splatter effects */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-32 h-32 rounded-full bg-stone-900/80"
                  initial={{
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                    scale: 0,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    ease: 'easeOut',
                  }}
                  style={{
                    filter: 'blur(20px)',
                  }}
                />
              ))}
            </div>
          )}

          {type === 'fade' && (
            <motion.div
              className="absolute inset-0 bg-stone-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}

          {type === 'slide' && (
            <motion.div
              className="absolute inset-0 bg-stone-900"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
