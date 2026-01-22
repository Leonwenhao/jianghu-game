'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { DialogueBox } from './DialogueBox';
import { ChoicePanel } from './ChoicePanel';
import { TypewriterText } from './TypewriterText';
import { CharacterPortrait } from './CharacterPortrait';
import { CurrentScene, ChoiceOption, Panel } from '@/lib/game/types';
import { useState, useEffect, useCallback, useRef } from 'react';

interface SceneRendererProps {
  scene: CurrentScene | null;
  currentPanelIndex: number;
  isTransitioning: boolean;
  onChoice: (choiceId: string) => void;
  onAdvancePanel: () => void;
  onTextComplete: () => void;
}

export function SceneRenderer({
  scene,
  currentPanelIndex,
  isTransitioning,
  onChoice,
  onAdvancePanel,
  onTextComplete,
}: SceneRendererProps) {
  const [textComplete, setTextComplete] = useState(false);
  const prevSceneRef = useRef<string | undefined>(undefined);
  const prevPanelRef = useRef<number>(0);

  // Reset text complete state when panel or scene ACTUALLY changes
  useEffect(() => {
    const sceneChanged = prevSceneRef.current !== scene?.id;
    const panelChanged = prevPanelRef.current !== currentPanelIndex;

    if (sceneChanged || panelChanged) {
      setTextComplete(false);
      prevSceneRef.current = scene?.id;
      prevPanelRef.current = currentPanelIndex;
    }
  }, [currentPanelIndex, scene?.id]);

  const handleTextComplete = useCallback(() => {
    setTextComplete(true);
    onTextComplete();
  }, [onTextComplete]);

  const handleClick = useCallback(() => {
    if (textComplete && scene) {
      const content = scene.content as { panels?: Panel[]; choices?: ChoiceOption[]; nextScene?: string };
      const panels = content.panels || [];
      const hasChoices = content.choices && content.choices.length > 0;

      // If there are more panels and no choices yet, advance
      if (currentPanelIndex < panels.length - 1) {
        onAdvancePanel();
      } else if (!hasChoices && content.nextScene) {
        // Auto-advance to next scene if no choices
        onAdvancePanel();
      }
    }
  }, [textComplete, scene, currentPanelIndex, onAdvancePanel]);

  if (!scene) return null;

  const content = scene.content as { panels?: Panel[]; choices?: ChoiceOption[]; nextScene?: string };
  const panels = content.panels || [];
  const currentPanel = panels[currentPanelIndex];
  const choices = content.choices;

  // Determine current text and speaker
  const currentText = currentPanel?.text || scene.text || '';
  const currentSpeaker = currentPanel?.speaker || scene.speaker;
  const currentImage = typeof currentPanel?.image === 'string' ? currentPanel.image : scene.background;
  const textPosition = currentPanel?.textPosition || 'bottom';

  // Check if we're at the last panel
  const isLastPanel = currentPanelIndex >= panels.length - 1;
  const showChoices = textComplete && isLastPanel && choices && choices.length > 0;

  return (
    <div
      className="relative w-full h-screen bg-stone-900 overflow-hidden"
      onClick={handleClick}
    >
      {/* Background Image - 70% of viewport */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${scene.id}-${currentPanelIndex}`}
          className="absolute inset-0 h-[70vh]"
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 1 }}
        >
          {currentImage && (
            <img
              src={currentImage}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-900" />
        </motion.div>
      </AnimatePresence>

      {/* Center text overlay for poetry/title scenes */}
      {textPosition === 'center' && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl px-8"
          >
            <TypewriterText
              text={currentText}
              speed={50}
              onComplete={handleTextComplete}
              className="text-2xl md:text-3xl text-amber-100/90 zh"
            />
          </motion.div>
        </div>
      )}

      {/* Text Area - 30% of viewport */}
      {textPosition !== 'center' && (
        <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-stone-900/95 border-t border-amber-900/30">
          <div className="max-w-4xl mx-auto p-6 h-full flex flex-col">
            {/* Speaker Portrait + Dialogue */}
            <div className="flex gap-4 flex-1 items-start">
              {currentSpeaker && (
                <CharacterPortrait
                  character={currentSpeaker}
                  className="w-20 h-20 flex-shrink-0"
                />
              )}
              <DialogueBox>
                <TypewriterText
                  text={currentText}
                  speed={30}
                  onComplete={handleTextComplete}
                />
              </DialogueBox>
            </div>

            {/* Choices */}
            <AnimatePresence>
              {showChoices && (
                <ChoicePanel
                  choices={choices}
                  onChoice={onChoice}
                />
              )}
            </AnimatePresence>

            {/* Click to continue indicator */}
            {textComplete && !showChoices && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-center text-amber-100/40 text-sm mt-2"
              >
                Click to continue...
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="absolute inset-0 bg-stone-900 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
