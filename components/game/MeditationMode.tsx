'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypewriterText } from './TypewriterText';
import { ChoicePanel } from './ChoicePanel';
import { MeditationState, ChoiceOption } from '@/lib/game/types';

interface MeditationModeProps {
  meditationState: MeditationState;
  onChoice: (choiceId: string) => Promise<void>;
  isProcessing: boolean;
}

export function MeditationMode({ meditationState, onChoice, isProcessing }: MeditationModeProps) {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
  const [textComplete, setTextComplete] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  // Reset text complete when text changes
  useEffect(() => {
    setTextComplete(false);
  }, [meditationState.currentText]);

  const handleChoice = async (choiceId: string) => {
    await onChoice(choiceId);
  };

  return (
    <div className="relative w-full h-screen bg-stone-950 overflow-hidden">
      {/* Abstract ink wash background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(ellipse at 30% 40%, rgba(139, 90, 43, 0.3) 0%, transparent 50%)',
              'radial-gradient(ellipse at 70% 60%, rgba(139, 90, 43, 0.3) 0%, transparent 50%)',
              'radial-gradient(ellipse at 30% 40%, rgba(139, 90, 43, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Ink particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-amber-900/20"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
            }}
            animate={{
              y: [null, Math.random() * dimensions.height],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Inner state visualization - glowing orb */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
        <motion.div
          className="w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(217, 119, 6, 0.6) 0%, rgba(217, 119, 6, 0) 70%)',
            boxShadow: '0 0 60px rgba(217, 119, 6, 0.3)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* Meditation dialogue */}
      <div className="absolute bottom-0 left-0 right-0 h-[45vh] flex items-end justify-center pb-12">
        <div className="max-w-2xl w-full px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-stone-900/60 backdrop-blur-sm rounded-lg p-6 border border-amber-900/20"
          >
            <TypewriterText
              text={meditationState.currentText}
              speed={40}
              onComplete={() => setTextComplete(true)}
            />

            {meditationState.choices && meditationState.choices.length > 0 && textComplete && !isProcessing && (
              <ChoicePanel
                choices={meditationState.choices}
                onChoice={handleChoice}
              />
            )}

            {isProcessing && (
              <div className="mt-4 text-amber-100/50 text-center">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ...
                </motion.span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
