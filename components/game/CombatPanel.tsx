'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CombatState, CombatChoice, Panel } from '@/lib/game/types';

interface CombatPanelProps {
  combatState: CombatState;
  onChoice: (choiceId: string) => void;
}

export function CombatPanel({ combatState, onChoice }: CombatPanelProps) {
  const { panels, currentPanelIndex, choices, showChoices } = combatState;

  return (
    <div className="relative w-full h-screen bg-stone-900 overflow-hidden">
      {/* Manga panel grid */}
      <div className="absolute inset-0 p-4">
        <motion.div
          className="grid grid-cols-2 gap-4 h-full"
          layout
        >
          <AnimatePresence mode="popLayout">
            {panels.slice(0, currentPanelIndex + 1).map((panel, index) => (
              <motion.div
                key={panel.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`
                  relative rounded-lg overflow-hidden border-2 border-stone-700
                  ${panel.panelSize === 'full' ? 'col-span-2' : ''}
                  ${panel.panelSize === 'wide' ? 'col-span-2 h-48' : ''}
                `}
              >
                {typeof panel.image === 'string' && (
                  <img
                    src={panel.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Panel text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-stone-900/90 to-transparent">
                  <p className="text-amber-100/90 text-sm font-serif">
                    {panel.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Combat choices overlay */}
      <AnimatePresence>
        {showChoices && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-0 left-0 right-0 p-6 bg-stone-900/95 border-t border-amber-900/30"
          >
            <p className="text-amber-100/60 text-sm mb-4 text-center">
              How do you respond?
            </p>
            <div className="max-w-2xl mx-auto space-y-2">
              {choices.map((choice) => (
                <motion.button
                  key={choice.id}
                  onClick={() => onChoice(choice.id)}
                  whileHover={{ x: 5 }}
                  className="w-full text-left px-4 py-3 rounded border border-amber-900/30
                    hover:bg-amber-900/20 hover:border-amber-700/50 transition-all"
                >
                  <span className="text-amber-600 mr-2">▸</span>
                  <span className="text-amber-100/80">{choice.text}</span>
                  <span className="text-amber-100/40 text-xs ml-2">
                    ({choice.type})
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
