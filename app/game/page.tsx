'use client';

import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { SceneRenderer } from '@/components/game/SceneRenderer';
import { MeditationMode } from '@/components/game/MeditationMode';
import { CombatPanel } from '@/components/game/CombatPanel';
import { TransitionEffects } from '@/components/ui/TransitionEffects';
import { PROLOGUE_SCENES } from '@/lib/data/scenes/prologue';
import { motion } from 'framer-motion';

export default function GamePage() {
  const {
    currentScene,
    currentPanelIndex,
    meditationState,
    combatState,
    ui,
    setScenes,
    loadScene,
    makeChoice,
    advancePanel,
    setTextComplete,
    sendMeditationResponse,
    makeCombatChoice,
  } = useGameStore();

  const [isLoading, setIsLoading] = useState(true);
  const [meditationProcessing, setMeditationProcessing] = useState(false);

  // Initialize the game
  useEffect(() => {
    const initGame = async () => {
      setScenes(PROLOGUE_SCENES);
      await loadScene('cold_open');
      setIsLoading(false);
    };

    initGame();
  }, [setScenes, loadScene]);

  const handleChoice = useCallback((choiceId: string) => {
    makeChoice(choiceId);
  }, [makeChoice]);

  const handleAdvancePanel = useCallback(() => {
    advancePanel();
  }, [advancePanel]);

  const handleTextComplete = useCallback(() => {
    setTextComplete(true);
  }, [setTextComplete]);

  const handleMeditationChoice = useCallback(async (choiceId: string) => {
    setMeditationProcessing(true);
    await sendMeditationResponse(choiceId);
    setMeditationProcessing(false);
  }, [sendMeditationResponse]);

  const handleCombatChoice = useCallback((choiceId: string) => {
    makeCombatChoice(choiceId);
  }, [makeCombatChoice]);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-stone-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-amber-600/50"
            animate={{
              boxShadow: [
                '0 0 20px rgba(217, 119, 6, 0.3)',
                '0 0 40px rgba(217, 119, 6, 0.5)',
                '0 0 20px rgba(217, 119, 6, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <p className="text-amber-100/60 text-lg font-serif">
            Loading...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-stone-900 overflow-hidden">
      {/* Transition Effects */}
      <TransitionEffects isTransitioning={ui.isTransitioning} />

      {/* Main Content based on game mode */}
      {ui.mode === 'meditation' && meditationState ? (
        <MeditationMode
          meditationState={meditationState}
          onChoice={handleMeditationChoice}
          isProcessing={meditationProcessing}
        />
      ) : ui.mode === 'combat' && combatState ? (
        <CombatPanel
          combatState={combatState}
          onChoice={handleCombatChoice}
        />
      ) : (
        <SceneRenderer
          scene={currentScene}
          currentPanelIndex={currentPanelIndex}
          isTransitioning={ui.isTransitioning}
          onChoice={handleChoice}
          onAdvancePanel={handleAdvancePanel}
          onTextComplete={handleTextComplete}
        />
      )}
    </div>
  );
}
