import { create } from 'zustand';
import {
  GameState,
  Scene,
  CurrentScene,
  MeditationState,
  CombatState,
  MeditationContent,
  CombatContent,
  NarrativeContent,
  ChoiceOption,
  Player,
  WorldState,
  NarrativeState,
  UIState,
} from '@/lib/game/types';

interface GameStore extends GameState {
  // Current scene state
  currentScene: CurrentScene | null;
  currentPanelIndex: number;
  meditationState: MeditationState | null;
  combatState: CombatState | null;

  // Scene data (loaded from prologue)
  scenes: Scene[];
  setScenes: (scenes: Scene[]) => void;

  // Scene management
  loadScene: (sceneId: string) => Promise<void>;
  makeChoice: (choiceId: string) => void;
  advancePanel: () => void;

  // UI state
  setTextComplete: (complete: boolean) => void;

  // Meditation
  startMeditation: (content: MeditationContent) => void;
  sendMeditationResponse: (choiceId: string) => Promise<void>;
  endMeditation: (outcome: string) => void;

  // Combat
  startCombat: (content: CombatContent) => void;
  makeCombatChoice: (choiceId: string) => void;
  advanceCombatPanel: () => void;

  // Image generation
  generateSceneImage: (prompt: string, type: string) => Promise<string>;

  // Utility
  applyStatChanges: (changes: Record<string, number>) => void;
  setFlag: (key: string, value: boolean | number | string) => void;
}

const initialPlayer: Player = {
  name: null,
  age: 17,
  origin: 'unknown',
  cultivation: {
    realm: 'mortal',
    internalEnergy: 0,
    externalArts: 0,
    comprehension: 0,
  },
  techniques: [],
  traits: {
    orthodoxy: 0,
    aggression: 0,
    cunning: 0,
  },
};

const initialWorld: WorldState = {
  currentLocation: {
    id: 'starting',
    name: 'Unknown',
    nameZh: '未知',
    description: '',
    availableDestinations: [],
  },
  currentTime: {
    day: 1,
    period: 'dawn',
    season: 'winter',
    year: 1199,
  },
  flags: {},
  relationships: {},
};

const initialNarrative: NarrativeState = {
  currentScene: 'cold_open',
  sceneHistory: [],
  conversationHistory: [],
  choicesMade: [],
};

const initialUI: UIState = {
  mode: 'narrative',
  isTransitioning: false,
  textComplete: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  player: initialPlayer,
  world: initialWorld,
  narrative: initialNarrative,
  ui: initialUI,

  currentScene: null,
  currentPanelIndex: 0,
  meditationState: null,
  combatState: null,
  scenes: [],

  setScenes: (scenes: Scene[]) => {
    set({ scenes });
  },

  // Load and display a scene
  loadScene: async (sceneId: string) => {
    const { scenes } = get();
    set({ ui: { ...get().ui, isTransitioning: true } });

    // Find scene in data
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) {
      console.error(`Scene not found: ${sceneId}`);
      set({ ui: { ...get().ui, isTransitioning: false } });
      return;
    }

    // Resolve background image
    let background: string;
    if (typeof scene.background === 'object' && 'prompt' in scene.background) {
      background = await get().generateSceneImage(scene.background.prompt, 'landscape');
    } else {
      background = scene.background as string;
    }

    // Process panels for images
    const content = scene.content as NarrativeContent;
    if (content.panels) {
      for (const panel of content.panels) {
        if (panel.image && typeof panel.image === 'object' && 'prompt' in panel.image) {
          panel.image = await get().generateSceneImage(panel.image.prompt, 'panel');
        }
      }
    }

    // Get first panel text and speaker
    const firstPanel = content.panels?.[0];
    const text = firstPanel?.text || '';
    const speaker = firstPanel?.speaker;

    set({
      currentScene: {
        ...scene,
        background,
        text,
        speaker,
        choices: content.choices,
      } as CurrentScene,
      currentPanelIndex: 0,
      narrative: {
        ...get().narrative,
        currentScene: sceneId,
        sceneHistory: [...get().narrative.sceneHistory, sceneId],
      },
      ui: {
        ...get().ui,
        isTransitioning: false,
        mode: scene.type as UIState['mode'],
        textComplete: false,
      },
    });

    // Handle special scene types
    if (scene.type === 'meditation') {
      get().startMeditation(scene.content as MeditationContent);
    } else if (scene.type === 'combat') {
      get().startCombat(scene.content as CombatContent);
    }
  },

  makeChoice: (choiceId: string) => {
    const { currentScene, narrative, player, world } = get();
    const content = currentScene?.content as NarrativeContent;
    if (!content?.choices) return;

    const choice = content.choices.find(c => c.id === choiceId);
    if (!choice || choice.disabled) return;

    // Apply consequences
    const newFlags: Record<string, boolean | number | string> = { ...world.flags };
    if (choice.consequence.flags) {
      for (const [key, value] of Object.entries(choice.consequence.flags)) {
        if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
          newFlags[key] = value;
        }
      }
    }
    const newRelationships = { ...world.relationships };

    if (choice.consequence.relationship) {
      const { npcId, change } = choice.consequence.relationship;
      newRelationships[npcId] = (newRelationships[npcId] || 0) + change;
    }

    // Apply stat changes
    let newPlayer = { ...player };
    if (choice.consequence.statChanges) {
      newPlayer = applyStatChangesToPlayer(newPlayer, choice.consequence.statChanges);
    }

    set({
      player: newPlayer,
      world: { ...world, flags: newFlags, relationships: newRelationships },
      narrative: {
        ...narrative,
        choicesMade: [
          ...narrative.choicesMade,
          {
            sceneId: currentScene?.id || '',
            choiceText: choice.text,
            choiceId,
            consequences: choice.consequence,
          },
        ],
      },
    });

    // Load next scene
    get().loadScene(choice.consequence.nextScene);
  },

  advancePanel: () => {
    const { currentScene, currentPanelIndex } = get();
    const content = currentScene?.content as NarrativeContent;
    if (!content?.panels) return;

    if (currentPanelIndex < content.panels.length - 1) {
      const nextPanel = content.panels[currentPanelIndex + 1];
      set({
        currentPanelIndex: currentPanelIndex + 1,
        currentScene: {
          ...currentScene!,
          text: nextPanel.text,
          speaker: nextPanel.speaker,
        },
        ui: { ...get().ui, textComplete: false },
      });
    } else if (content.nextScene) {
      // Apply any scene-level flags/stat changes
      if (content.flags) {
        const newFlags = { ...get().world.flags };
        for (const [key, value] of Object.entries(content.flags)) {
          newFlags[key] = value as boolean | number | string;
        }
        set({ world: { ...get().world, flags: newFlags } });
      }
      if (content.statChanges) {
        const newPlayer = applyStatChangesToPlayer(get().player, content.statChanges);
        set({ player: newPlayer });
      }
      get().loadScene(content.nextScene);
    }
  },

  setTextComplete: (complete: boolean) => {
    set({ ui: { ...get().ui, textComplete: complete } });
  },

  // Meditation
  startMeditation: (content: MeditationContent) => {
    set({
      meditationState: {
        currentText: 'Close your eyes. Breathe. Let the world fall away...',
        choices: [],
        conversationHistory: [],
        context: content,
      },
      ui: { ...get().ui, mode: 'meditation' },
    });

    // Trigger initial AI response
    setTimeout(() => get().sendMeditationResponse('begin'), 1000);
  },

  sendMeditationResponse: async (choiceId: string) => {
    const { meditationState, player } = get();
    if (!meditationState) return;

    try {
      const response = await fetch('/api/meditation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          technique: meditationState.context.technique,
          bottleneck: meditationState.context.bottleneck,
          martialHistory: player.techniques,
          playerTraits: player.traits,
          conversationHistory: meditationState.conversationHistory,
          playerChoice: choiceId !== 'begin' ? choiceId : null,
        }),
      });

      const data = await response.json();

      set({
        meditationState: {
          ...meditationState,
          currentText: data.text,
          choices: data.choices,
          conversationHistory: [
            ...meditationState.conversationHistory,
            ...(choiceId !== 'begin' ? [{ role: 'user', text: choiceId }] : []),
            { role: 'assistant', text: data.text },
          ],
        },
      });

      if (data.isBreakthrough) {
        // End meditation after a delay
        setTimeout(() => get().endMeditation(data.detectedTheme), 3000);
      }
    } catch (error) {
      console.error('Meditation API error:', error);
      // Provide fallback response
      set({
        meditationState: {
          ...meditationState,
          currentText: 'The vision fades... You return to the present.',
          choices: [{ id: 'end', text: 'Open your eyes', consequence: { nextScene: 'post_meditation_balanced' } }],
        },
      });
    }
  },

  endMeditation: (outcome: string) => {
    const { meditationState, currentScene } = get();
    if (!meditationState || !currentScene) return;

    const content = currentScene.content as MeditationContent;
    const outcomeData = content.possibleOutcomes?.find(o => o.theme === outcome);

    if (outcomeData) {
      // Apply consequences
      if (outcomeData.consequence.statChanges) {
        const newPlayer = applyStatChangesToPlayer(get().player, outcomeData.consequence.statChanges);
        set({ player: newPlayer });
      }

      set({ meditationState: null });
      get().loadScene(outcomeData.consequence.nextScene);
    } else {
      // Fallback to first outcome or a default scene
      const fallback = content.possibleOutcomes?.[0];
      set({ meditationState: null });
      if (fallback) {
        get().loadScene(fallback.consequence.nextScene);
      }
    }
  },

  // Combat
  startCombat: (content: CombatContent) => {
    const firstExchange = content.exchanges[0];
    set({
      combatState: {
        panels: firstExchange.panels,
        currentPanelIndex: 0,
        choices: firstExchange.choices,
        showChoices: false,
        opponent: content.opponent,
        currentExchange: 0,
        content,
      },
      ui: { ...get().ui, mode: 'combat' },
    });

    // Show choices after panels are displayed
    setTimeout(() => {
      set({
        combatState: {
          ...get().combatState!,
          showChoices: true,
        },
      });
    }, 2000);
  },

  makeCombatChoice: (choiceId: string) => {
    const { combatState, player } = get();
    if (!combatState) return;

    const choice = combatState.choices.find(c => c.id === choiceId);
    if (!choice) return;

    // Simple combat resolution
    const playerStrength = player.cultivation.externalArts + player.cultivation.internalEnergy;
    const opponentStrength = combatState.opponent.strength;
    const effectiveness = choice.effectiveness;

    // Calculate outcome
    const roll = Math.random() * 100;
    const successThreshold = effectiveness + (playerStrength - opponentStrength);

    if (choice.type === 'flee') {
      // Flee attempt
      get().loadScene(combatState.content.outcomes.flee.nextScene);
      set({ combatState: null });
      return;
    }

    // Check if there are more exchanges
    const nextExchangeIndex = combatState.currentExchange + 1;
    if (nextExchangeIndex < combatState.content.exchanges.length) {
      // Continue to next exchange
      const nextExchange = combatState.content.exchanges[nextExchangeIndex];
      set({
        combatState: {
          ...combatState,
          panels: nextExchange.panels,
          currentPanelIndex: 0,
          choices: nextExchange.choices,
          showChoices: false,
          currentExchange: nextExchangeIndex,
        },
      });

      setTimeout(() => {
        set({
          combatState: {
            ...get().combatState!,
            showChoices: true,
          },
        });
      }, 2000);
    } else {
      // Final outcome
      if (roll < successThreshold) {
        get().loadScene(combatState.content.outcomes.victory.nextScene);
      } else if (roll > 100 - successThreshold / 2) {
        get().loadScene(combatState.content.outcomes.defeat.nextScene);
      } else {
        get().loadScene(combatState.content.outcomes.draw.nextScene);
      }
      set({ combatState: null });
    }
  },

  advanceCombatPanel: () => {
    const { combatState } = get();
    if (!combatState) return;

    if (combatState.currentPanelIndex < combatState.panels.length - 1) {
      set({
        combatState: {
          ...combatState,
          currentPanelIndex: combatState.currentPanelIndex + 1,
        },
      });
    } else {
      set({
        combatState: {
          ...combatState,
          showChoices: true,
        },
      });
    }
  },

  // Image generation
  generateSceneImage: async (prompt: string, type: string) => {
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, description: prompt }),
      });

      const data = await response.json();
      return data.url || '/images/placeholder.svg';
    } catch (error) {
      console.error('Failed to generate image:', error);
      return '/images/placeholder.svg';
    }
  },

  // Utility functions
  applyStatChanges: (changes: Record<string, number>) => {
    const newPlayer = applyStatChangesToPlayer(get().player, changes);
    set({ player: newPlayer });
  },

  setFlag: (key: string, value: boolean | number | string) => {
    set({
      world: {
        ...get().world,
        flags: {
          ...get().world.flags,
          [key]: value,
        },
      },
    });
  },
}));

// Helper function to apply stat changes to player
function applyStatChangesToPlayer(player: Player, changes: Record<string, number>): Player {
  const newPlayer = JSON.parse(JSON.stringify(player)) as Player;

  for (const [path, value] of Object.entries(changes)) {
    const keys = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let obj: any = newPlayer;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    const lastKey = keys[keys.length - 1];
    if (typeof obj[lastKey] === 'number') {
      obj[lastKey] += value;
    }
  }

  return newPlayer;
}
