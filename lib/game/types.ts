// lib/game/types.ts

export interface GameState {
  // Player identity
  player: Player;

  // World state
  world: WorldState;

  // Narrative state
  narrative: NarrativeState;

  // UI state
  ui: UIState;
}

export interface Player {
  name: string | null;
  age: number;
  origin: string;

  // Cultivation stats
  cultivation: CultivationStats;

  // Known techniques
  techniques: Technique[];

  // Personality/path indicators
  traits: PlayerTraits;
}

export interface CultivationStats {
  realm: CultivationRealm;
  internalEnergy: number;
  externalArts: number;
  comprehension: number;
}

export interface PlayerTraits {
  orthodoxy: number;      // -100 (heterodox) to 100 (orthodox)
  aggression: number;     // -100 (peaceful) to 100 (violent)
  cunning: number;        // -100 (straightforward) to 100 (scheming)
}

export type CultivationRealm =
  | 'mortal'
  | 'qi-sensing'
  | 'qi-condensation'
  | 'foundation'
  | 'core-formation';

export interface Technique {
  id: string;
  name: string;
  nameZh: string;
  type: 'internal' | 'external' | 'weapon' | 'movement';
  mastery: number; // 0-100
  origin: string;  // How/where learned
  description: string;
}

export interface WorldState {
  currentLocation: Location;
  currentTime: GameTime;
  flags: Record<string, boolean | number | string>;
  relationships: Record<string, number>; // NPC ID -> relationship value
}

export interface Location {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  availableDestinations: string[];
}

export interface GameTime {
  day: number;
  period: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'evening' | 'night' | 'midnight';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  year: number; // Song Dynasty year
}

export interface NarrativeState {
  currentScene: string;
  sceneHistory: string[];
  conversationHistory: ConversationEntry[];
  choicesMade: ChoiceRecord[];
}

export interface ConversationEntry {
  speaker: 'player' | 'npc' | 'narrator';
  npcId?: string;
  text: string;
  timestamp: number;
}

export interface ChoiceRecord {
  sceneId: string;
  choiceText: string;
  choiceId: string;
  consequences: Record<string, unknown>;
}

export interface UIState {
  mode: 'narrative' | 'navigation' | 'meditation' | 'combat';
  isTransitioning: boolean;
  textComplete: boolean;
}

// Scene types
export interface Scene {
  id: string;
  type: 'narrative' | 'dialogue' | 'navigation' | 'meditation' | 'combat';

  // Visual
  background: string | { prompt: string };  // URL or generation prompt
  music?: string;
  ambientSound?: string;

  // Content varies by type
  content: NarrativeContent | DialogueContent | NavigationContent | MeditationContent | CombatContent;
}

export interface NarrativeContent {
  panels: Panel[];
  choices?: ChoiceOption[];
  nextScene?: string;  // Auto-advance if no choices
  flags?: Record<string, unknown>;
  statChanges?: Record<string, number>;
}

export interface Panel {
  id?: string;
  image?: string | { prompt: string };
  text: string;
  speaker?: {
    id: string;
    name: string;
    portrait: string;
  };
  textPosition?: 'bottom' | 'top' | 'overlay' | 'center';
  panelSize?: 'full' | 'half' | 'third' | 'wide';
}

export interface ChoiceOption {
  id: string;
  text: string;
  textZh?: string;
  disabled?: boolean;
  disabledReason?: string;
  requirement?: {
    stat?: string;
    minValue?: number;
    flag?: string;
  };
  consequence: {
    nextScene: string;
    flags?: Record<string, unknown>;
    statChanges?: Record<string, number>;
    relationship?: { npcId: string; change: number };
  };
}

export interface DialogueContent {
  npcId: string;
  initialPrompt: string;
  context: string;
  exitOptions: ChoiceOption[];
}

export interface NavigationContent {
  description: string;
  destinations: {
    id: string;
    name: string;
    description: string;
    requirement?: Record<string, unknown>;
    consequence: {
      nextScene: string;
      timeAdvance?: number;
    };
  }[];
}

export interface MeditationContent {
  context: string;           // What triggered this meditation
  technique?: string;        // Technique being cultivated
  bottleneck?: string;       // What's blocking progress
  aiPrompt: string;          // System prompt for AI meditation guide
  possibleOutcomes: {
    theme: string;           // e.g., 'aggressive', 'peaceful', 'confused'
    consequence: {
      nextScene: string;
      techniqueModifier?: {
        style?: string;
        element?: string;
      };
      statChanges?: Record<string, number>;
    };
  }[];
}

export interface CombatContent {
  opponent: {
    id: string;
    name: string;
    description: string;
    portrait: string;
    style: string;
    strength: number;
  };
  context: string;           // Narrative setup
  exchanges: CombatExchange[];
  outcomes: {
    victory: { nextScene: string; rewards: Record<string, unknown> };
    defeat: { nextScene: string; consequences: Record<string, unknown> };
    draw: { nextScene: string };
    flee: { nextScene: string; consequences: Record<string, unknown> };
  };
}

export interface CombatExchange {
  narration: string;
  panels: Panel[];
  choices: CombatChoice[];
}

export interface CombatChoice {
  id: string;
  text: string;
  type: 'aggressive' | 'defensive' | 'counter' | 'observe' | 'flee';
  requirement?: Record<string, unknown>;
  effectiveness: number;  // Base chance of success
}

// Meditation state for the store
export interface MeditationState {
  currentText: string;
  choices: ChoiceOption[];
  conversationHistory: { role: string; text: string }[];
  context: MeditationContent;
}

// Combat state for the store
export interface CombatState {
  panels: Panel[];
  currentPanelIndex: number;
  choices: CombatChoice[];
  showChoices: boolean;
  opponent: CombatContent['opponent'];
  currentExchange: number;
  content: CombatContent;
}

// Current scene with resolved background
export interface CurrentScene extends Omit<Scene, 'background'> {
  background: string;
  text?: string;
  speaker?: Panel['speaker'];
  choices?: ChoiceOption[];
}

// Character profile for NPC dialogue
export interface CharacterProfile {
  id: string;
  name: string;
  nameZh: string;
  portrait: string;
  personality: string;
  knowledge: string;
  background: string;
}
