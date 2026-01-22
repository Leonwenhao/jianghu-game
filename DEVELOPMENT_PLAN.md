# Jianghu Game V2 Development Plan

## Executive Summary

V2 transforms Jianghu from a narrative prototype into a **"Playable Novel"** — a game where story choices, martial cultivation, and resource management are inextricably linked. Based on Gemini's research, we're bridging the gap between narratively shallow MMORPGs and mechanically simple visual novels.

### V2 Goals
1. **Implement "Narrative Physics"** — Gameplay systems where choices have mechanical weight
2. **Add the Cultivation Loop** — Acquisition → Refinement → Breakthrough as core retention
3. **Overhaul Combat** — Technique-based, strategic encounters (not dice rolls)
4. **Integrate AI Dialogue** — NPCs with personality persistence via JSON schemas
5. **Polish the Prologue** — A complete, replayable 15-30 minute experience

### Design Principles (from Research)
- **Disco Elysium insight**: Dialogue as "Cultivation Checks," not charisma checks
- **Citizen Sleeper insight**: Daily Qi as dice pool for resource management
- **Banner Saga insight**: Delayed consequences — Prologue choices ripple forward
- **Tale of Wuxia warning**: Avoid grind minigames — automate with narrative summaries
- **Scope discipline**: Narrative & Cultivation Loop first; housing/pets/crafting = cut

### Alignment System (replacing Good/Evil)
- **Xia (俠)** — Chivalry, righteousness, "for nation and people"
- **Xiao (孝)** — Filial piety, loyalty to masters/family
- **Zi (自)** — Self/freedom, personal desire over duty

---

## Milestones Overview

| # | Milestone | Focus | Tasks | Complexity |
|---|-----------|-------|-------|------------|
| 0 | Foundation & Persistence | Save/load, image caching, error handling | 5 | Medium |
| 1 | Cultivation Engine | Stats, skill checks, Qi system, breakthroughs | 8 | Large |
| 2 | Combat Overhaul | Techniques, multi-turn, damage formulas | 7 | Large |
| 3 | NPC & Dialogue | Character cards, AI integration, memory | 6 | Medium |
| 4 | Prologue Enhancement | Skill checks, combat, dialogue in scenes | 6 | Medium |
| 5 | UI/UX Polish | Stats view, clocks, mobile, session design | 5 | Small |

**Total: 37 tasks**

---

## Milestone 0: Foundation & Persistence

### Description
Before adding features, we must fix critical infrastructure gaps. The game currently resets on refresh and image generation blocks gameplay. This milestone establishes the foundation everything else builds on.

### Success Criteria
- [ ] Player can refresh the page and resume where they left off
- [ ] Scene images load from cache (no API call on revisit)
- [ ] Errors display gracefully without breaking the game
- [ ] Game state can be exported/imported as JSON

### Estimated Complexity: Medium (2-3 days)

### Tasks
- T001: Implement localStorage persistence for game state
- T002: Add image generation caching layer
- T003: Create error boundary components
- T004: Add save slot UI (3 slots)
- T005: Implement state export/import for debugging

---

## Milestone 1: Cultivation Engine

### Description
The mathematical backbone of progression. This implements the "Cultivation Loop" from the research: Acquisition (gain Qi) → Refinement (convert to Neili) → Breakthrough (advance realm). Also implements the Disco Elysium-style skill check system.

### Success Criteria
- [ ] Player has visible Qi/Neili resources that change based on actions
- [ ] Skill checks appear in dialogue with success/failure outcomes
- [ ] Failed checks lead to interesting outcomes (not just "try again")
- [ ] Player can attempt a "Breakthrough" with risk/reward
- [ ] Alignment (Xia/Xiao/Zi) tracks and affects available choices

### Estimated Complexity: Large (4-5 days)

### Tasks
- T006: Redesign player stats schema (add Qi, Neili, Realm, Alignment)
- T007: Implement skill check system (2d6 + modifier vs DC)
- T008: Create SkillCheckPanel component (shows odds, allows roll)
- T009: Add "interesting failure" branching to scene system
- T010: Implement Breakthrough mechanic (probability + Qi Deviation risk)
- T011: Create Alignment tracking system (Xia/Xiao/Zi)
- T012: Add stat change animations and feedback
- T013: Implement logistic cost scaling for progression

---

## Milestone 2: Combat Overhaul

### Description
Replace the single-dice-roll combat with a technique-based system. Combat should feel like a martial arts exchange: reading opponent, choosing stance, executing technique. Implements the division-based damage formula from research.

### Success Criteria
- [ ] Combat has multiple exchanges (not instant resolution)
- [ ] Player chooses from learned techniques (not generic "attack")
- [ ] Opponent has visible stance/pattern player can read
- [ ] Damage uses division formula (never zero, diminishing returns)
- [ ] Retreat is a valid strategic option with consequences
- [ ] At least one combat encounter works end-to-end in prologue

### Estimated Complexity: Large (4-5 days)

### Tasks
- T014: Define Technique data schema (name, type, cost, effects)
- T015: Implement division-based damage formula
- T016: Create multi-exchange combat flow
- T017: Add opponent stance/pattern system
- T018: Implement technique selection UI
- T019: Add combat resource management (Qi cost per technique)
- T020: Create retreat mechanic with consequences

---

## Milestone 3: NPC & Dialogue System

### Description
Integrate the existing AI dialogue scaffold into actual gameplay. NPCs get JSON "character cards" that constrain AI responses. Implement tiered memory so NPCs remember past interactions.

### Success Criteria
- [ ] NPCs have JSON character cards defining personality/knowledge
- [ ] AI dialogue stays in-character (no lore breaks)
- [ ] NPCs remember at least the last 5 interactions
- [ ] Dialogue choices can trigger skill checks
- [ ] Relationship changes based on dialogue outcomes
- [ ] At least one AI dialogue scene works in prologue

### Estimated Complexity: Medium (3-4 days)

### Tasks
- T021: Create NPC character card JSON schema
- T022: Implement character card loader and validator
- T023: Update dialogue API to use character cards
- T024: Add short-term memory (last 10 turns)
- T025: Create DialogueScene component (connects to API)
- T026: Implement relationship change feedback

---

## Milestone 4: Prologue Enhancement

### Description
Apply all new systems to the existing prologue content. Add skill checks to existing choices, insert a combat encounter, and add an NPC dialogue scene. This is where we validate that systems work together.

### Success Criteria
- [ ] Prologue has at least 3 meaningful skill checks
- [ ] Prologue has 1 combat encounter (can be fled)
- [ ] Prologue has 1 AI dialogue scene
- [ ] Choices in prologue set up delayed consequences (flags for Act 1)
- [ ] Multiple distinct paths through prologue are viable
- [ ] Playthrough feels like 15-30 minutes of engagement

### Estimated Complexity: Medium (3-4 days)

### Tasks
- T027: Add skill checks to existing prologue choices
- T028: Create prologue combat encounter (bandit or soldier)
- T029: Create prologue NPC dialogue scene (dying martial artist)
- T030: Implement delayed consequence flags
- T031: Balance prologue paths (no "obviously correct" choice)
- T032: Playtest and tune prologue pacing

---

## Milestone 5: UI/UX Polish

### Description
Player-facing polish that improves retention and comprehension. Character sheet, progress visualization, mobile support, and session design (natural stopping points).

### Success Criteria
- [ ] Player can view their stats/alignment/techniques anytime
- [ ] "Clock" system shows impending deadlines visually
- [ ] Game is playable on mobile (responsive, touch-friendly)
- [ ] Natural session end points with "Continue?" prompts
- [ ] Loading states are smooth (no jarring transitions)

### Estimated Complexity: Small (2-3 days)

### Tasks
- T033: Create CharacterSheet component (stats, techniques, alignment)
- T034: Implement Clock visualization component
- T035: Mobile responsive pass on all components
- T036: Add session checkpoints with save prompts
- T037: Polish loading states and transitions

---

## Critical Path

```
M0 (Foundation) ──┬──> M1 (Cultivation) ──┬──> M4 (Prologue Enhancement)
                  │                       │
                  └──> M2 (Combat) ───────┤
                  │                       │
                  └──> M3 (Dialogue) ─────┘
                                          │
                                          v
                                    M5 (UI Polish)
```

**Blocking dependencies:**
- M0 must complete before anything else (save/load is foundational)
- M1, M2, M3 can run in parallel after M0
- M4 requires M1, M2, M3 to be complete (integrates all systems)
- M5 can start after M4 begins (doesn't require full completion)

---

## Out of Scope for V2

Based on Gemini's warning about scope creep, these are explicitly **deferred to V3+**:

- Housing/territory system
- Pet breeding (eagle raising)
- Crafting system
- Full Act 1 content (beyond prologue)
- Multiplayer/social features
- Monetization implementation
- Advanced AI memory (episodic/reflective)
- Gacha/battle pass systems
- Voice acting integration

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI responses break lore | High | High | Strict JSON schemas, output validation |
| Combat feels arbitrary | Medium | High | Extensive playtesting, tunable constants |
| Skill checks feel unfair | Medium | Medium | Show odds before rolling, interesting failures |
| Scope creep | High | High | Strict task definition, defer features to V3 |
| Image generation costs | Medium | Low | Caching, pre-generated fallbacks |

---

## Definition of Done (V2)

V2 is complete when:
1. A player can complete the prologue in 15-30 minutes
2. The prologue includes: narrative, skill checks, combat, AI dialogue
3. Choices feel meaningful (affect stats, alignment, future flags)
4. Game state persists across sessions
5. The experience is smooth on desktop and mobile
6. No critical bugs or crashes during normal play

---

## Next Steps

1. Review TASK_QUEUE.md for implementation details
2. Begin with Milestone 0 (Foundation)
3. After each milestone, conduct playtest review
4. Iterate based on findings before moving to next milestone
