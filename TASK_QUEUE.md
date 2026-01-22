# Jianghu V2 Task Queue

> **Instructions for Codex**: Each task is self-contained. Read the Context, implement the Requirements, verify against Acceptance Criteria. Do not modify files outside the listed scope unless absolutely necessary.

---

## Milestone 0: Foundation & Persistence

---

### Task 001: Implement localStorage Persistence

**Status**: Pending
**Milestone**: 0 - Foundation
**Priority**: P0
**Estimated Complexity**: Medium

#### Context
The game currently resets on page refresh. Players lose all progress. This is the #1 blocker for any meaningful gameplay session. We need to persist the entire Zustand store to localStorage and rehydrate on load.

#### Requirements
1. Create a persistence middleware for the Zustand store
2. Save game state to localStorage on every state change (debounced, 500ms)
3. Load game state from localStorage on app initialization
4. Handle migration if stored state schema differs from current (version field)
5. Provide a `resetGame()` action that clears localStorage and resets state

#### Acceptance Criteria
- [ ] Refresh page mid-scene → returns to same scene, same panel
- [ ] Player stats persist across refresh
- [ ] Flags and choices persist across refresh
- [ ] `resetGame()` clears everything and starts fresh
- [ ] No console errors on fresh load (empty localStorage)

#### Files to Modify/Create
- `stores/gameStore.ts` (add persistence middleware)
- `lib/storage/persistence.ts` (new - persistence utilities)

#### Dependencies
None

---

### Task 002: Add Image Generation Caching

**Status**: Pending
**Milestone**: 0 - Foundation
**Priority**: P0
**Estimated Complexity**: Medium

#### Context
Currently, `generateSceneImage()` calls the Fal.ai API every time a scene loads. This is slow (~3-5 seconds) and expensive. Generated images should be cached in localStorage (as base64 or URLs if Fal provides persistent URLs).

#### Requirements
1. Create an image cache layer that checks localStorage before API call
2. Cache key should be hash of the image prompt
3. Store generated image URL (or base64 if URL expires)
4. Add cache expiry (7 days) to prevent stale images
5. Provide cache stats in console (hits/misses) for debugging

#### Acceptance Criteria
- [ ] First visit to scene → API call, image cached
- [ ] Second visit to same scene → instant load from cache, no API call
- [ ] Cache persists across page refreshes
- [ ] Old cache entries (>7 days) are regenerated
- [ ] Cache can be manually cleared via debug function

#### Files to Modify/Create
- `lib/storage/imageCache.ts` (new - caching utilities)
- `stores/gameStore.ts` (modify `generateSceneImage` to use cache)
- `app/api/generate-image/route.ts` (no changes needed)

#### Dependencies
None

---

### Task 003: Create Error Boundary Components

**Status**: Pending
**Milestone**: 0 - Foundation
**Priority**: P1
**Estimated Complexity**: Small

#### Context
API failures or state corruption can crash the entire app. We need React error boundaries to catch errors gracefully and offer recovery options.

#### Requirements
1. Create a root-level ErrorBoundary component
2. Catch errors and display a friendly message
3. Offer "Retry" (reload current scene) and "Reset" (clear state) options
4. Log errors to console with full stack trace
5. Wrap the game page in the error boundary

#### Acceptance Criteria
- [ ] Thrown error in component → error screen, not white screen
- [ ] "Retry" button reloads the current scene
- [ ] "Reset" button clears localStorage and restarts
- [ ] Error details visible in console for debugging
- [ ] App doesn't crash on API timeout

#### Files to Modify/Create
- `components/ui/ErrorBoundary.tsx` (new)
- `app/game/page.tsx` (wrap content in ErrorBoundary)

#### Dependencies
- T001 (needs resetGame action)

---

### Task 004: Add Save Slot UI

**Status**: Pending
**Milestone**: 0 - Foundation
**Priority**: P1
**Estimated Complexity**: Medium

#### Context
Players should be able to maintain multiple saves (3 slots). This enables experimentation with different choices without losing progress.

#### Requirements
1. Create SaveSlotPanel component showing 3 slots
2. Each slot shows: scene name, playtime, last saved timestamp
3. "Save" button saves current state to selected slot
4. "Load" button loads state from selected slot
5. "Delete" button clears a slot (with confirmation)
6. Accessible from a menu button during gameplay

#### Acceptance Criteria
- [ ] Player can save to slot 1, make different choices, save to slot 2
- [ ] Loading slot 1 restores the first save state
- [ ] Empty slots show "Empty" and only allow Save
- [ ] Delete requires confirmation click
- [ ] Save slots persist across browser sessions

#### Files to Modify/Create
- `components/ui/SaveSlotPanel.tsx` (new)
- `components/ui/GameMenu.tsx` (new - menu overlay)
- `lib/storage/saveSlots.ts` (new - save slot utilities)
- `app/game/page.tsx` (add menu button)

#### Dependencies
- T001 (persistence infrastructure)

---

### Task 005: Implement State Export/Import

**Status**: Pending
**Milestone**: 0 - Foundation
**Priority**: P2
**Estimated Complexity**: Small

#### Context
For debugging and sharing, we need to export/import game state as JSON. This also serves as a backup mechanism.

#### Requirements
1. Add `exportState()` function that returns JSON string
2. Add `importState(json)` function that validates and loads state
3. Add UI buttons in settings/debug menu
4. Validate imported state has correct schema version
5. Warn user that import will overwrite current state

#### Acceptance Criteria
- [ ] Export button downloads a `.json` file
- [ ] Import button accepts `.json` file upload
- [ ] Invalid JSON shows error message
- [ ] Schema mismatch shows warning with option to proceed
- [ ] Successful import loads the game state immediately

#### Files to Modify/Create
- `lib/storage/stateExport.ts` (new)
- `components/ui/DebugPanel.tsx` (new - only in dev mode)

#### Dependencies
- T001 (persistence infrastructure)

---

## Milestone 1: Cultivation Engine

---

### Task 006: Redesign Player Stats Schema

**Status**: Pending
**Milestone**: 1 - Cultivation
**Priority**: P0
**Estimated Complexity**: Medium

#### Context
Current player stats are too simple. Based on research, we need: Qi (raw energy), Neili (refined internal power), Realm (cultivation stage), and Alignment (Xia/Xiao/Zi). This forms the foundation of the skill check system.

#### Requirements
1. Update `PlayerState` interface with new stats:
   - `qi: number` (0-100, raw energy)
   - `neili: number` (0-1000, refined power, grows with realm)
   - `realm: CultivationRealm` (enum: Mortal, Sensing, Meridian, Circulation, Core)
   - `alignment: { xia: number, xiao: number, zi: number }` (each -100 to 100)
2. Add cultivation skills for checks:
   - `zenMind: number` (resist provocation, meditation)
   - `wuxue: number` (martial knowledge, technique comprehension)
   - `qinggong: number` (lightness skill, agility)
   - `neigong: number` (internal cultivation power)
3. Update initial player state in gameStore
4. Migrate existing save data (add defaults for new fields)

#### Acceptance Criteria
- [ ] New stats appear in game state
- [ ] Old saves load without crashing (migration works)
- [ ] Stats can be modified via `applyStatChanges`
- [ ] TypeScript types are complete and accurate
- [ ] No breaking changes to existing scene consequences

#### Files to Modify/Create
- `lib/game/types.ts` (update PlayerState, add CultivationRealm)
- `stores/gameStore.ts` (update initial state, add migration)
- `lib/storage/migration.ts` (new - state migration utilities)

#### Dependencies
- T001 (persistence - so migration works)

---

### Task 007: Implement Skill Check System

**Status**: Pending
**Milestone**: 1 - Cultivation
**Priority**: P0
**Estimated Complexity**: Large

#### Context
Disco Elysium uses 2d6 + skill vs DC. We adapt this for wuxia: checks against ZenMind, Wuxue, Qinggong, Neigong. The bell curve of 2d6 (most common result: 7) allows for tight balance.

#### Requirements
1. Create `SkillCheck` type:
   ```typescript
   interface SkillCheck {
     skill: 'zenMind' | 'wuxue' | 'qinggong' | 'neigong';
     dc: number; // 6 (trivial) to 20 (impossible)
     modifiers?: { source: string; value: number }[];
     onSuccess: string; // scene ID or consequence
     onFailure: string; // scene ID or consequence
   }
   ```
2. Implement `rollSkillCheck(check: SkillCheck)` function:
   - Roll 2d6
   - Add player's skill value
   - Add any modifiers (from items, conditions, etc.)
   - Compare to DC
   - Return `{ success: boolean, roll: number, total: number }`
3. Calculate and display success probability before roll
4. Record check results in narrative history

#### Acceptance Criteria
- [ ] `rollSkillCheck` returns correct success/failure
- [ ] Probability calculation matches actual outcomes over many rolls
- [ ] Modifiers correctly affect the roll
- [ ] Check results are recorded in `choicesMade`
- [ ] Function is pure (same inputs = predictable for testing)

#### Files to Modify/Create
- `lib/game/skillChecks.ts` (new)
- `lib/game/types.ts` (add SkillCheck type)
- `stores/gameStore.ts` (add check recording)

#### Dependencies
- T006 (needs new player stats)

---

### Task 008: Create SkillCheckPanel Component

**Status**: Pending
**Milestone**: 1 - Cultivation
**Priority**: P0
**Estimated Complexity**: Medium

#### Context
When a skill check is triggered, the player should see: the skill being tested, current skill value, any modifiers, success probability, and a "Roll" button. After rolling, show the dice result with animation.

#### Requirements
1. Create `SkillCheckPanel` component:
   - Shows skill name and player's value
   - Shows DC and calculated probability
   - Lists active modifiers (if any)
   - "Roll" button triggers the check
2. Add dice roll animation (simple CSS, 1-2 seconds)
3. Show result: "Success!" or "Failure..." with total
4. After result, auto-advance to success/failure scene
5. Integrate with SceneRenderer (show panel when scene has skillCheck)

#### Acceptance Criteria
- [ ] Panel appears when scene contains a skill check
- [ ] Probability displays as percentage (e.g., "68% chance")
- [ ] Dice animation plays on roll
- [ ] Result clearly shows success or failure
- [ ] Scene advances to correct branch after roll

#### Files to Modify/Create
- `components/game/SkillCheckPanel.tsx` (new)
- `components/game/SceneRenderer.tsx` (integrate SkillCheckPanel)
- `app/globals.css` (dice animation styles)

#### Dependencies
- T007 (skill check logic)

---

### Task 009: Add Interesting Failure Branching

**Status**: Pending
**Milestone**: 1 - Cultivation
**Priority**: P1
**Estimated Complexity**: Medium

#### Context
Per research, failed checks should lead to interesting outcomes, not dead ends. A failed Qinggong check shouldn't kill the player — it should result in a humiliating fall that lowers reputation but reveals a hidden cave.

#### Requirements
1. Update scene schema to support `onFailure` as object with:
   - `nextScene: string`
   - `consequences: Consequence[]`
   - `narrative: string` (failure-specific text)
2. Create helper to process failure consequences
3. Failure consequences should differ from success (not just "no reward")
4. Add `failurePanel` field to scenes (optional flavor text for failures)

#### Acceptance Criteria
- [ ] Failed skill checks lead to different scenes than success
- [ ] Failure scenes have unique narrative text
- [ ] Failure consequences are applied (stat changes, flags)
- [ ] Player never gets "stuck" due to failed check
- [ ] Failures feel like story branches, not punishments

#### Files to Modify/Create
- `lib/game/types.ts` (update Choice/SkillCheck types)
- `lib/data/scenes/prologue.ts` (will need updates in T027)
- `stores/gameStore.ts` (handle failure branching)

#### Dependencies
- T007 (skill check system)

---

### Task 010: Implement Breakthrough Mechanic

**Status**: Pending
**Milestone**: 1 - Cultivation
**Priority**: P1
**Estimated Complexity**: Large

#### Context
Moving between cultivation realms (Mortal → Sensing → Meridian, etc.) requires a "Breakthrough." This is probabilistic: success depends on Neili density and stabilizing items. Failure causes "Qi Deviation" (temporary debuff).

#### Requirements
1. Define breakthrough requirements per realm:
   - Mortal → Sensing: 100 Neili, 50% base chance
   - Sensing → Meridian: 300 Neili, 40% base chance
   - etc.
2. Implement `attemptBreakthrough()` action:
   - Check if requirements met
   - Calculate success probability (base + bonuses)
   - On success: advance realm, reset Neili to 0, gain stat bonuses
   - On failure: apply "Qi Deviation" debuff (-20% all stats for 3 scenes)
3. Breakthrough attempt costs all current Qi
4. Create BreakthroughPanel component for the UI

#### Acceptance Criteria
- [ ] Can only attempt when requirements are met
- [ ] Success advances realm and shows celebration
- [ ] Failure applies Qi Deviation debuff
- [ ] Debuff wears off after 3 scene transitions
- [ ] Breakthrough history is recorded

#### Files to Modify/Create
- `lib/game/cultivation.ts` (new - breakthrough logic)
- `lib/game/types.ts` (add QiDeviation debuff type)
- `components/game/BreakthroughPanel.tsx` (new)
- `stores/gameStore.ts` (add attemptBreakthrough action)

#### Dependencies
- T006 (realm system in stats)

---

### Task 011: Create Alignment Tracking System

**Status**: Pending
**Milestone**: 1 - Cultivation
**Priority**: P1
**Estimated Complexity**: Medium

#### Context
Instead of Good/Evil, we track Xia (chivalry), Xiao (loyalty), and Zi (self). These are NOT mutually exclusive — a character can be high in multiple. Choices shift these values, and certain dialogue options only appear at certain thresholds.

#### Requirements
1. Each alignment ranges from -100 to 100
2. Implement `adjustAlignment(type, delta)` action
3. Choices can have alignment requirements: `{ requiresXia: 30 }`
4. Choices can have alignment consequences: `{ xia: +10, zi: -5 }`
5. Create visual indicator showing current alignment balance
6. Add helper to check if choice is available based on alignment

#### Acceptance Criteria
- [ ] Choices correctly shift alignment values
- [ ] Alignment values stay within -100 to 100
- [ ] Choices with unmet requirements are hidden or grayed
- [ ] Alignment is visible somewhere in UI (could be character sheet)
- [ ] Multiple alignments can be positive simultaneously

#### Files to Modify/Create
- `lib/game/alignment.ts` (new)
- `lib/game/types.ts` (add alignment requirement type)
- `stores/gameStore.ts` (add adjustAlignment action)
- `components/game/ChoicePanel.tsx` (filter/gray unavailable choices)

#### Dependencies
- T006 (alignment in player stats)

---

### Task 012: Add Stat Change Animations

**Status**: Pending
**Milestone**: 1 - Cultivation
**Priority**: P2
**Estimated Complexity**: Small

#### Context
When stats change (Qi gained, alignment shifted), the player should see feedback. A floating "+10 Qi" or "Xia +5" makes progression feel tangible.

#### Requirements
1. Create `StatChangeNotification` component
2. Floating text that rises and fades (1.5s animation)
3. Color-coded: green for gains, red for losses
4. Queue multiple notifications (don't overlap)
5. Trigger automatically when `applyStatChanges` is called

#### Acceptance Criteria
- [ ] Stat changes show floating notifications
- [ ] Multiple changes show sequentially, not overlapping
- [ ] Positive changes are green, negative are red
- [ ] Animation is smooth (60fps)
- [ ] Notifications don't block gameplay

#### Files to Modify/Create
- `components/ui/StatChangeNotification.tsx` (new)
- `stores/gameStore.ts` (add notification queue)
- `app/game/page.tsx` (render notification layer)

#### Dependencies
- T006 (stat system)

---

### Task 013: Implement Logistic Cost Scaling

**Status**: Pending
**Milestone**: 1 - Cultivation
**Priority**: P2
**Estimated Complexity**: Small

#### Context
Per research, stat growth should follow a logistic curve: fast early gains, linear middle, diminishing returns at high levels. This prevents infinite grinding while allowing meaningful progression.

#### Requirements
1. Create `calculateUpgradeCost(stat, currentLevel)` function
2. Formula: `Cost = Base * (1 + GrowthRate)^Level`
3. Base cost: 10 Potential (XP equivalent)
4. Growth rate: 0.15 (15% increase per level)
5. Add `Potential` as a trackable resource (gained from choices/combat)

#### Acceptance Criteria
- [ ] Level 1→2 costs 10 Potential
- [ ] Level 10→11 costs ~40 Potential
- [ ] Level 50→51 costs ~1000+ Potential
- [ ] Cost calculation is consistent and testable
- [ ] Potential can be gained and spent in game

#### Files to Modify/Create
- `lib/game/progression.ts` (new)
- `lib/game/types.ts` (add Potential to player stats)
- `stores/gameStore.ts` (add Potential tracking)

#### Dependencies
- T006 (stat system)

---

## Milestone 2: Combat Overhaul

---

### Task 014: Define Technique Data Schema

**Status**: Pending
**Milestone**: 2 - Combat
**Priority**: P0
**Estimated Complexity**: Medium

#### Context
Combat should use learned techniques, not generic "attack." Each technique has a name, type (strike/palm/kick/stance), Qi cost, damage formula, and special effects.

#### Requirements
1. Create `Technique` interface:
   ```typescript
   interface Technique {
     id: string;
     name: string;
     nameZh: string; // Chinese name
     type: 'strike' | 'palm' | 'kick' | 'stance' | 'qinggong';
     qiCost: number;
     baseDamage: number;
     effects?: TechniqueEffect[];
     description: string;
     requirements?: { stat: string; min: number };
   }
   ```
2. Create initial techniques (5-10 for testing):
   - Basic Fist (starter)
   - Sweeping Kick (knockback)
   - Iron Palm (high damage, high cost)
   - Defensive Stance (reduce damage taken)
   - Swift Retreat (escape combat)
3. Player starts with 2-3 techniques
4. Techniques can be learned through scenes

#### Acceptance Criteria
- [ ] Technique schema is complete and typed
- [ ] 5+ techniques defined with balanced stats
- [ ] Player state includes `techniques: string[]` (IDs)
- [ ] Techniques can be loaded by ID
- [ ] New techniques can be added via scene consequences

#### Files to Modify/Create
- `lib/game/types.ts` (add Technique interface)
- `lib/data/techniques/index.ts` (new - technique definitions)
- `stores/gameStore.ts` (add techniques to player)

#### Dependencies
- T006 (stat system for requirements)

---

### Task 015: Implement Division-Based Damage Formula

**Status**: Pending
**Milestone**: 2 - Combat
**Priority**: P0
**Estimated Complexity**: Small

#### Context
Per research, subtraction formulas (Atk - Def) create "immune" situations. Division-based formulas ensure damage never hits zero while giving diminishing returns on defense.

#### Requirements
1. Implement damage formula:
   ```
   Damage = TechniqueBase * (Atk / (Atk + K * Def)) * CritMod * ElementMod
   ```
   - K = 50 (scaling constant)
   - CritMod = 1.5 on critical hit (10% chance base)
   - ElementMod = 1.0 for now (future expansion)
2. Create `calculateDamage(technique, attacker, defender)` function
3. Add randomness: ±10% variance on final damage
4. Minimum damage is always 1 (never zero)

#### Acceptance Criteria
- [ ] High attack vs low defense = high damage
- [ ] Low attack vs high defense = low but non-zero damage
- [ ] Critical hits do 50% more damage
- [ ] Damage has slight variance (not always same number)
- [ ] Formula is testable with unit tests

#### Files to Modify/Create
- `lib/game/combat.ts` (new)
- `lib/game/types.ts` (add combat stat types if needed)

#### Dependencies
- T014 (technique schema)

---

### Task 016: Create Multi-Exchange Combat Flow

**Status**: Pending
**Milestone**: 2 - Combat
**Priority**: P0
**Estimated Complexity**: Large

#### Context
Current combat is single-roll resolution. Real combat should be 3-7 exchanges where player and opponent trade actions. Each exchange: player picks technique, opponent responds, damage is calculated, repeat until HP depleted or flee.

#### Requirements
1. Update `CombatState` to track:
   - `playerHp: number` (current/max)
   - `opponentHp: number` (current/max)
   - `currentExchange: number`
   - `exchangeLog: ExchangeResult[]`
2. Implement combat loop:
   - Player selects technique
   - Opponent selects technique (AI or predetermined pattern)
   - Both execute simultaneously
   - Damage calculated and applied
   - Check for victory/defeat/flee
3. Victory when opponent HP ≤ 0
4. Defeat when player HP ≤ 0
5. Combat ends and transitions to appropriate scene

#### Acceptance Criteria
- [ ] Combat lasts multiple exchanges (not instant)
- [ ] HP bars update after each exchange
- [ ] Exchange log shows what happened
- [ ] Combat ends correctly on victory/defeat
- [ ] Player can flee mid-combat (separate task)

#### Files to Modify/Create
- `lib/game/types.ts` (update CombatState)
- `lib/game/combat.ts` (add combat flow logic)
- `stores/gameStore.ts` (update combat actions)
- `components/game/CombatPanel.tsx` (update for multi-exchange)

#### Dependencies
- T014, T015 (techniques and damage formula)

---

### Task 017: Add Opponent Stance/Pattern System

**Status**: Pending
**Milestone**: 2 - Combat
**Priority**: P1
**Estimated Complexity**: Medium

#### Context
Opponents should have readable patterns. A "Defensive" opponent might alternate between guard and counter. This creates a mini-game of reading the opponent and choosing the right technique.

#### Requirements
1. Create `OpponentPattern` type:
   - `aggressive`: favors high-damage attacks
   - `defensive`: favors guards, counters
   - `tricky`: random, unpredictable
   - `wounded`: changes behavior below 30% HP
2. Implement `selectOpponentTechnique(opponent, state)` function
3. Show opponent's current stance/tell before player chooses
4. Opponent has limited technique pool (defined in opponent data)

#### Acceptance Criteria
- [ ] Opponent behavior matches their pattern type
- [ ] Player can see opponent's stance before choosing
- [ ] Wounded opponents change behavior
- [ ] Different opponents feel distinct
- [ ] Pattern system is data-driven (not hardcoded)

#### Files to Modify/Create
- `lib/game/types.ts` (add OpponentPattern)
- `lib/game/combat.ts` (add AI selection logic)
- `lib/data/opponents/index.ts` (new - opponent definitions)
- `components/game/CombatPanel.tsx` (show stance indicator)

#### Dependencies
- T016 (combat flow)

---

### Task 018: Implement Technique Selection UI

**Status**: Pending
**Milestone**: 2 - Combat
**Priority**: P0
**Estimated Complexity**: Medium

#### Context
During combat, player needs to see their available techniques, Qi costs, and select one. The UI should be quick and clear — combat is time-pressured mentally.

#### Requirements
1. Create `TechniqueSelector` component
2. Show all learned techniques with:
   - Name (Chinese + English)
   - Qi cost (grayed if not enough Qi)
   - Brief effect description
3. Disabled techniques (not enough Qi) show but can't be selected
4. Clicking technique selects it and advances combat
5. Keyboard shortcuts: 1-5 for quick selection

#### Acceptance Criteria
- [ ] All player techniques are displayed
- [ ] Insufficient-Qi techniques are visually disabled
- [ ] Selection triggers combat exchange
- [ ] Keyboard shortcuts work
- [ ] UI is readable and doesn't obscure combat panel

#### Files to Modify/Create
- `components/game/TechniqueSelector.tsx` (new)
- `components/game/CombatPanel.tsx` (integrate selector)

#### Dependencies
- T014 (techniques), T016 (combat flow)

---

### Task 019: Add Combat Resource Management

**Status**: Pending
**Milestone**: 2 - Combat
**Priority**: P1
**Estimated Complexity**: Small

#### Context
Techniques cost Qi. Player must manage Qi during combat — spam big moves and run out, or use efficient techniques for sustained fight.

#### Requirements
1. Player's Qi is visible during combat
2. Using a technique deducts its `qiCost`
3. At 0 Qi, only "Basic Fist" (0 cost) and "Flee" are available
4. Qi regenerates slowly each exchange (+5)
5. Some techniques/items can boost Qi regen

#### Acceptance Criteria
- [ ] Qi bar shows during combat
- [ ] Using techniques deducts correct amount
- [ ] Can't use techniques you can't afford
- [ ] Qi slowly regenerates each turn
- [ ] Running out of Qi doesn't soft-lock (basic attack always available)

#### Files to Modify/Create
- `lib/game/combat.ts` (add Qi management)
- `stores/gameStore.ts` (combat Qi tracking)
- `components/game/CombatPanel.tsx` (add Qi display)

#### Dependencies
- T016 (combat flow)

---

### Task 020: Create Retreat Mechanic

**Status**: Pending
**Milestone**: 2 - Combat
**Priority**: P1
**Estimated Complexity**: Medium

#### Context
Per research, retreat should be a valid strategic option with consequences. Fleeing isn't free — it costs reputation and might have narrative consequences.

#### Requirements
1. Add "Flee" option always available in combat
2. Flee requires Qinggong check (DC based on opponent speed)
3. Success: exit combat, go to flee scene
4. Failure: opponent gets free attack, then can try again
5. Fleeing applies consequences:
   - Reputation -5
   - Flag set: `fled_from_{opponent_id}`

#### Acceptance Criteria
- [ ] Flee option always visible
- [ ] Flee triggers Qinggong skill check
- [ ] Failed flee results in damage taken
- [ ] Successful flee exits combat
- [ ] Flee consequences are applied

#### Files to Modify/Create
- `lib/game/combat.ts` (add flee logic)
- `components/game/CombatPanel.tsx` (add flee button)
- `stores/gameStore.ts` (handle flee consequences)

#### Dependencies
- T007 (skill checks), T016 (combat flow)

---

## Milestone 3: NPC & Dialogue System

---

### Task 021: Create NPC Character Card Schema

**Status**: Pending
**Milestone**: 3 - Dialogue
**Priority**: P0
**Estimated Complexity**: Medium

#### Context
Per research, NPCs need JSON "character cards" that constrain AI responses. This prevents hallucination and keeps characters consistent.

#### Requirements
1. Create `NPCCharacterCard` interface:
   ```typescript
   interface NPCCharacterCard {
     id: string;
     name: string;
     nameZh: string;
     archetype: string; // e.g., "Wit/Trickster", "Stoic Warrior"
     currentState: {
       location: string;
       mood: 'neutral' | 'happy' | 'angry' | 'fearful' | 'suspicious';
       relationshipWithPlayer: number; // -100 to 100
       knownSecrets: string[];
       currentDisguise?: string;
     };
     speakingStyle: {
       tone: string;
       forbiddenTopics: string[];
       catchphrases: string[];
       verbosity: 'terse' | 'normal' | 'verbose';
     };
     martialArts: string[]; // techniques they know
     faction?: string;
   }
   ```
2. Create 3 sample NPC cards for testing
3. Include validation function for card completeness

#### Acceptance Criteria
- [ ] Schema is complete and TypeScript typed
- [ ] 3 sample NPCs created (varied types)
- [ ] Validation catches incomplete cards
- [ ] Cards are loadable by ID
- [ ] Schema matches research recommendations

#### Files to Modify/Create
- `lib/game/types.ts` (add NPCCharacterCard)
- `lib/data/npcs/index.ts` (new - NPC definitions)
- `lib/ai/npcValidation.ts` (new - validation)

#### Dependencies
None

---

### Task 022: Implement Character Card Loader

**Status**: Pending
**Milestone**: 3 - Dialogue
**Priority**: P0
**Estimated Complexity**: Small

#### Context
NPCs need to be loaded by ID for dialogue scenes. The loader should merge base card with current game state (relationship might have changed).

#### Requirements
1. Create `loadNPCCard(npcId: string, gameState)` function
2. Merge base card with dynamic state (relationship from gameStore)
3. Return enriched card ready for prompt construction
4. Handle missing NPC gracefully (error, not crash)

#### Acceptance Criteria
- [ ] Can load any defined NPC by ID
- [ ] Relationship value comes from game state
- [ ] Missing NPC returns error object
- [ ] Card includes all necessary prompt data
- [ ] Function is synchronous (cards are local data)

#### Files to Modify/Create
- `lib/ai/npcLoader.ts` (new)
- `stores/gameStore.ts` (ensure relationships are accessible)

#### Dependencies
- T021 (character card schema)

---

### Task 023: Update Dialogue API for Character Cards

**Status**: Pending
**Milestone**: 3 - Dialogue
**Priority**: P0
**Estimated Complexity**: Medium

#### Context
The existing `/api/dialogue` route needs to use character cards. The prompt should inject the card data to constrain Claude's responses.

#### Requirements
1. Update dialogue route to accept `npcId` parameter
2. Load character card in the API route
3. Construct prompt that includes:
   - NPC personality and speaking style
   - Current mood and relationship
   - Forbidden topics (things NPC won't discuss)
   - Player's recent actions (from request body)
4. Add output validation: reject responses that break character
5. Return structured response with dialogue + optional action tags

#### Acceptance Criteria
- [ ] API accepts npcId and player message
- [ ] Response matches NPC's speaking style
- [ ] Forbidden topics are not discussed
- [ ] Relationship level affects tone
- [ ] Response includes action tags if appropriate

#### Files to Modify/Create
- `app/api/dialogue/route.ts` (major update)
- `lib/ai/prompts/npc-base.ts` (update prompt construction)
- `lib/ai/npcLoader.ts` (use in API)

#### Dependencies
- T021, T022 (character cards)

---

### Task 024: Add Short-Term Memory

**Status**: Pending
**Milestone**: 3 - Dialogue
**Priority**: P1
**Estimated Complexity**: Medium

#### Context
NPCs should remember recent conversation. Per research, we implement short-term memory: last 10 turns of dialogue per NPC.

#### Requirements
1. Add `npcMemory: { [npcId]: DialogueTurn[] }` to game state
2. Each turn stores: `{ role: 'player' | 'npc', text: string, timestamp: number }`
3. Limit to 10 turns per NPC (FIFO)
4. Include memory in dialogue API prompt
5. Memory persists across sessions (via save system)

#### Acceptance Criteria
- [ ] NPC remembers what player said last conversation
- [ ] Memory is included in AI prompt
- [ ] Old memories are pruned (keep last 10)
- [ ] Memory persists across save/load
- [ ] Each NPC has separate memory

#### Files to Modify/Create
- `lib/game/types.ts` (add DialogueTurn, npcMemory)
- `stores/gameStore.ts` (add memory management)
- `app/api/dialogue/route.ts` (include memory in prompt)

#### Dependencies
- T023 (dialogue API), T001 (persistence)

---

### Task 025: Create DialogueScene Component

**Status**: Pending
**Milestone**: 3 - Dialogue
**Priority**: P0
**Estimated Complexity**: Large

#### Context
A new scene type: `dialogue`. Player has free-form conversation with NPC via AI. This component handles the chat interface and integrates with the API.

#### Requirements
1. Create `DialogueScene` component:
   - NPC portrait and name on one side
   - Chat history in the middle
   - Player input at bottom (text field + send button)
2. Handle API calls with loading state
3. Allow "end conversation" to exit dialogue mode
4. Support choice injection (NPC can offer choices mid-dialogue)
5. Integrate with SceneRenderer (render when scene type is 'dialogue')

#### Acceptance Criteria
- [ ] Can have multi-turn conversation with NPC
- [ ] Loading indicator shows during API call
- [ ] Can end conversation and proceed
- [ ] NPC responses appear in chat
- [ ] Choices can appear from NPC (optional feature)

#### Files to Modify/Create
- `components/game/DialogueScene.tsx` (new)
- `components/game/SceneRenderer.tsx` (add dialogue scene handling)
- `lib/game/types.ts` (add dialogue scene type)

#### Dependencies
- T023 (dialogue API)

---

### Task 026: Implement Relationship Change Feedback

**Status**: Pending
**Milestone**: 3 - Dialogue
**Priority**: P2
**Estimated Complexity**: Small

#### Context
When relationship changes (through dialogue or actions), player should see feedback. "Huang Rong's opinion of you improved" with visual indicator.

#### Requirements
1. Create `RelationshipChangeNotification` component
2. Show NPC name and delta (+10 or -5)
3. Color: green for improvement, red for decline
4. Trigger on relationship changes in dialogue or choices
5. Can reuse StatChangeNotification pattern

#### Acceptance Criteria
- [ ] Relationship changes show notification
- [ ] NPC name is displayed
- [ ] Direction of change is clear (up/down)
- [ ] Notification doesn't block gameplay
- [ ] Works for both dialogue and choice consequences

#### Files to Modify/Create
- `components/ui/RelationshipNotification.tsx` (new, or extend StatChangeNotification)
- `stores/gameStore.ts` (trigger on relationship change)

#### Dependencies
- T012 (stat notification pattern)

---

## Milestone 4: Prologue Enhancement

---

### Task 027: Add Skill Checks to Prologue

**Status**: Pending
**Milestone**: 4 - Prologue
**Priority**: P0
**Estimated Complexity**: Medium

#### Context
Apply the skill check system to existing prologue choices. At least 3 checks that affect outcomes.

#### Requirements
1. Identify 3+ prologue moments for skill checks:
   - Hiding from soldiers → ZenMind check (stay calm)
   - Grabbing the martial arts book → Qinggong check (quick hands)
   - Understanding what you witnessed → Wuxue check (comprehension)
2. Add skill check data to those scene choices
3. Create success and failure branches for each
4. Ensure failure branches are interesting (not dead ends)
5. Balance DCs for new player stats (achievable but not trivial)

#### Acceptance Criteria
- [ ] At least 3 skill checks in prologue
- [ ] Each check has distinct success/failure paths
- [ ] Failure paths are narratively interesting
- [ ] DCs are achievable (40-70% success rate at start)
- [ ] Skill checks feel integrated, not forced

#### Files to Modify/Create
- `lib/data/scenes/prologue.ts` (add skill checks)
- May need new scene IDs for failure branches

#### Dependencies
- T007, T008, T009 (skill check system)

---

### Task 028: Create Prologue Combat Encounter

**Status**: Pending
**Milestone**: 4 - Prologue
**Priority**: P0
**Estimated Complexity**: Large

#### Context
Add one combat encounter to the prologue. Options: encounter a bandit during the massacre, or face a wounded soldier. Should be winnable but challenging.

#### Requirements
1. Design opponent: "Wounded Jin Soldier" or "Desperate Bandit"
2. Create opponent data (HP, techniques, pattern)
3. Insert combat scene into prologue flow
4. Create victory, defeat, and flee outcomes
5. Combat should be optional (player can choose to hide instead)
6. Victory grants: technique observation, item, or flag

#### Acceptance Criteria
- [ ] Combat encounter exists in prologue
- [ ] Combat uses the new multi-exchange system
- [ ] Player can win, lose, or flee
- [ ] Each outcome leads to appropriate scene
- [ ] Combat feels meaningful to the story

#### Files to Modify/Create
- `lib/data/scenes/prologue.ts` (add combat scenes)
- `lib/data/opponents/index.ts` (add prologue opponent)
- Scene branches for victory/defeat/flee

#### Dependencies
- T014-T020 (combat system)

---

### Task 029: Create Prologue NPC Dialogue Scene

**Status**: Pending
**Milestone**: 4 - Prologue
**Priority**: P0
**Estimated Complexity**: Large

#### Context
Add one AI dialogue scene: conversation with a dying martial artist who can teach you something. This tests the dialogue system in-story.

#### Requirements
1. Create NPC: "Dying Martial Artist" (knows a basic technique)
2. Create character card with appropriate personality
3. Insert dialogue scene into prologue (after massacre, before time skip)
4. NPC can teach player a technique through dialogue
5. Relationship affects what NPC reveals
6. Conversation has natural ending (NPC dies or player leaves)

#### Acceptance Criteria
- [ ] Dialogue scene works with AI
- [ ] NPC stays in character
- [ ] Player can learn something from conversation
- [ ] Scene has clear ending trigger
- [ ] Memory persists if player returns (edge case)

#### Files to Modify/Create
- `lib/data/scenes/prologue.ts` (add dialogue scene)
- `lib/data/npcs/index.ts` (add dying martial artist)
- Scene transitions into/out of dialogue

#### Dependencies
- T021-T025 (dialogue system)

---

### Task 030: Implement Delayed Consequence Flags

**Status**: Pending
**Milestone**: 4 - Prologue
**Priority**: P1
**Estimated Complexity**: Small

#### Context
Per Banner Saga insight, choices should have delayed consequences. Prologue choices set flags that will affect Act 1 (even though Act 1 isn't built yet).

#### Requirements
1. Identify prologue choices with future impact:
   - Spared the bandit? Flag: `prologue_spared_bandit`
   - Took the book? Flag: `prologue_has_martial_book`
   - Which path (city/mountain)? Flag: `prologue_path_city` or `prologue_path_mountain`
2. Ensure flags are set in scene consequences
3. Document intended Act 1 impacts in SCRATCHPAD.md
4. Add flag display in debug panel

#### Acceptance Criteria
- [ ] Key prologue choices set persistent flags
- [ ] Flags are visible in debug panel
- [ ] Flags persist across sessions
- [ ] Documentation exists for future impact
- [ ] Flags use consistent naming convention

#### Files to Modify/Create
- `lib/data/scenes/prologue.ts` (add flag consequences)
- `SCRATCHPAD.md` (document future impacts)
- `components/ui/DebugPanel.tsx` (show flags)

#### Dependencies
- T001 (persistence)

---

### Task 031: Balance Prologue Paths

**Status**: Pending
**Milestone**: 4 - Prologue
**Priority**: P1
**Estimated Complexity**: Medium

#### Context
Multiple paths through prologue should all feel viable. No "obviously correct" choice. Different paths = different stats/techniques, not better/worse.

#### Requirements
1. Audit all prologue branches for rewards
2. Ensure each path grants comparable total value
3. Differentiate by type, not magnitude:
   - Combat path → +technique, +aggression
   - Stealth path → +qinggong, +cunning
   - Scholar path → +wuxue, +comprehension
4. Add "unique" rewards per path (can't get everything in one run)
5. Test all paths are completable

#### Acceptance Criteria
- [ ] All major paths have comparable rewards
- [ ] Paths differ in character they build
- [ ] No path is obviously superior
- [ ] Unique rewards encourage replayability
- [ ] All paths reach the same endpoint (end of prologue)

#### Files to Modify/Create
- `lib/data/scenes/prologue.ts` (balance consequences)
- May need new scenes for underdeveloped paths

#### Dependencies
- T027, T028, T029 (content exists to balance)

---

### Task 032: Playtest and Tune Prologue Pacing

**Status**: Pending
**Milestone**: 4 - Prologue
**Priority**: P2
**Estimated Complexity**: Medium

#### Context
Final polish pass. Play through all paths, note pacing issues, tune text lengths, adjust skill check DCs based on feel.

#### Requirements
1. Play through each major path at least twice
2. Note any pacing issues (too slow, too fast, confusing)
3. Adjust typewriter speeds if needed
4. Tune skill check DCs based on success rates
5. Ensure total playtime is 15-30 minutes per path
6. Document findings in SCRATCHPAD.md

#### Acceptance Criteria
- [ ] All paths playtested
- [ ] No pacing issues noted
- [ ] Skill checks feel fair
- [ ] Playtime within target range
- [ ] Playtest notes documented

#### Files to Modify/Create
- Various scene files (tuning)
- `SCRATCHPAD.md` (playtest notes)

#### Dependencies
- T027-T031 (content complete)

---

## Milestone 5: UI/UX Polish

---

### Task 033: Create CharacterSheet Component

**Status**: Pending
**Milestone**: 5 - UI/UX
**Priority**: P0
**Estimated Complexity**: Medium

#### Context
Player needs to see their stats, alignment, techniques, and realm at any time. Accessible via menu or keyboard shortcut.

#### Requirements
1. Create `CharacterSheet` component showing:
   - Name, realm, Qi/Neili bars
   - Cultivation skills (ZenMind, Wuxue, Qinggong, Neigong)
   - Alignment triangle (Xia/Xiao/Zi visualization)
   - Learned techniques list
   - Active effects/debuffs
2. Toggle with 'C' key or menu button
3. Overlay style (doesn't navigate away from game)
4. Close with 'Esc' or clicking outside

#### Acceptance Criteria
- [ ] All player stats are displayed
- [ ] Opens with 'C' key
- [ ] Closes with 'Esc'
- [ ] Doesn't break game state
- [ ] Responsive on mobile

#### Files to Modify/Create
- `components/ui/CharacterSheet.tsx` (new)
- `app/game/page.tsx` (add toggle logic)

#### Dependencies
- T006 (stat system)

---

### Task 034: Implement Clock Visualization

**Status**: Pending
**Milestone**: 5 - UI/UX
**Priority**: P2
**Estimated Complexity**: Medium

#### Context
Per Citizen Sleeper, "Clocks" show impending events. In prologue, this could be "Time until soldiers arrive" or "Dying martial artist's remaining strength."

#### Requirements
1. Create `Clock` component (segmented circle)
2. Clocks have: name, current segments, max segments
3. Clocks can tick up or down based on events
4. When clock fills/empties, trigger consequence
5. Display active clocks in UI corner

#### Acceptance Criteria
- [ ] Clocks display as segmented circles
- [ ] Clocks update based on events
- [ ] Full/empty clocks trigger scenes
- [ ] Multiple clocks can be active
- [ ] Clocks persist across saves

#### Files to Modify/Create
- `components/ui/Clock.tsx` (new)
- `lib/game/types.ts` (add Clock type)
- `stores/gameStore.ts` (add clock management)

#### Dependencies
None (can be built standalone)

---

### Task 035: Mobile Responsive Pass

**Status**: Pending
**Milestone**: 5 - UI/UX
**Priority**: P1
**Estimated Complexity**: Medium

#### Context
Game should be playable on mobile. All components need responsive review.

#### Requirements
1. Audit all components for mobile display
2. Fix any text overflow or touch target issues
3. Ensure buttons are at least 44x44px for touch
4. Test combat and dialogue on mobile viewport
5. Add touch gestures where appropriate (swipe to advance?)

#### Acceptance Criteria
- [ ] All scenes render correctly on mobile
- [ ] Buttons are easily tappable
- [ ] Text is readable without zooming
- [ ] Combat is playable on touch
- [ ] No horizontal scroll on mobile

#### Files to Modify/Create
- Various component files (CSS adjustments)
- `app/globals.css` (responsive utilities)

#### Dependencies
None

---

### Task 036: Add Session Checkpoints

**Status**: Pending
**Milestone**: 5 - UI/UX
**Priority**: P2
**Estimated Complexity**: Small

#### Context
Per retention research, natural stopping points help session design. After major events, prompt "Save and continue?" to create clean breaks.

#### Requirements
1. Define checkpoint scenes (after combat, after dialogue, act boundaries)
2. Create `CheckpointPrompt` component
3. Show prompt at checkpoint scenes
4. Options: "Continue" or "Save & Quit"
5. "Save & Quit" autosaves and shows "See you next time" message

#### Acceptance Criteria
- [ ] Checkpoints appear after major events
- [ ] Can continue without interruption
- [ ] Save & Quit autosaves correctly
- [ ] Returning loads to checkpoint
- [ ] Doesn't feel intrusive (skippable)

#### Files to Modify/Create
- `components/ui/CheckpointPrompt.tsx` (new)
- `lib/data/scenes/prologue.ts` (mark checkpoint scenes)
- `lib/game/types.ts` (add checkpoint flag to scenes)

#### Dependencies
- T001, T004 (save system)

---

### Task 037: Polish Loading States

**Status**: Pending
**Milestone**: 5 - UI/UX
**Priority**: P2
**Estimated Complexity**: Small

#### Context
API calls (dialogue, image generation) need smooth loading states. No jarring flashes or layout shifts.

#### Requirements
1. Create consistent `LoadingSpinner` component
2. Add skeleton states for image loading
3. Ensure dialogue API shows typing indicator
4. No layout shift when content loads
5. Minimum display time for loaders (300ms) to prevent flash

#### Acceptance Criteria
- [ ] All async operations show loading state
- [ ] No layout shifts during loading
- [ ] Loading states match game aesthetic
- [ ] Minimum 300ms display prevents flash
- [ ] Errors are handled gracefully

#### Files to Modify/Create
- `components/ui/LoadingSpinner.tsx` (new or update)
- Various components (add loading states)
- `app/globals.css` (skeleton animations)

#### Dependencies
None

---

## Task Status Summary

| Status | Count |
|--------|-------|
| Pending | 37 |
| In Progress | 0 |
| Review | 0 |
| Complete | 0 |

---

## Priority Legend

- **P0**: Must have for V2 MVP - blocks release
- **P1**: Should have - significantly improves experience
- **P2**: Nice to have - polish and convenience
