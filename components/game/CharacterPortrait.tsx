'use client';

import { motion } from 'framer-motion';

interface CharacterPortraitProps {
  character: {
    id: string;
    name: string;
    portrait: string;
  };
  className?: string;
}

export function CharacterPortrait({ character, className = '' }: CharacterPortraitProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-lg overflow-hidden border-2 border-amber-900/30 ${className}`}
    >
      <img
        src={character.portrait}
        alt={character.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900/90 to-transparent p-1">
        <p className="text-amber-100/80 text-xs text-center truncate">
          {character.name}
        </p>
      </div>
    </motion.div>
  );
}
