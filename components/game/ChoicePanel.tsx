'use client';

import { motion } from 'framer-motion';
import { ChoiceOption } from '@/lib/game/types';

interface ChoicePanelProps {
  choices: ChoiceOption[];
  onChoice: (choiceId: string) => void;
}

export function ChoicePanel({ choices, onChoice }: ChoicePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mt-4 space-y-2"
    >
      {choices.map((choice, index) => (
        <motion.button
          key={choice.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => !choice.disabled && onChoice(choice.id)}
          disabled={choice.disabled}
          className={`
            w-full text-left px-4 py-3 rounded
            border border-amber-900/30
            transition-all duration-200
            ${choice.disabled
              ? 'opacity-50 cursor-not-allowed bg-stone-800/50'
              : 'hover:bg-amber-900/20 hover:border-amber-700/50 cursor-pointer bg-stone-800/30'
            }
          `}
        >
          <span className="text-amber-600 mr-2">▸</span>
          <span className="text-amber-100/80">{choice.text}</span>
          {choice.textZh && (
            <span className="text-amber-100/40 text-sm ml-2 zh">({choice.textZh})</span>
          )}
          {choice.disabled && choice.disabledReason && (
            <span className="block text-amber-100/30 text-sm mt-1 ml-4 italic">
              {choice.disabledReason}
            </span>
          )}
        </motion.button>
      ))}
    </motion.div>
  );
}
