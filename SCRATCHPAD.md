# Jianghu V2 Scratchpad

> Working document for development decisions, research synthesis, and session notes.

---

## Research Insights → Implementation Decisions

### From Competitive Analysis

| Research Finding | Decision for V2 |
|------------------|-----------------|
| Disco Elysium's 2d6 skill system creates reliable center (7 most common) | **Adopted**: Using 2d6 + skill vs DC for all checks |
| Citizen Sleeper's dice pool = daily resource | **Deferred to V3**: Daily Qi roll is good but adds complexity |
| 80 Days' travel nodes with faction-based encounters | **Deferred**: We don't have travel yet; flag for Act 1 |
| Banner Saga's delayed consequences | **Adopted**: Prologue sets flags for Act 1 impact |
| Tale of Wuxia's grind minigames cause drop-off | **Avoided**: No minigames, narrative summaries instead |
| Warm Snow's internal/external art slotting | **Deferred**: Interesting for technique combos in V3 |

### From Jin Yong Source Material

| Research Finding | Decision for V2 |
|------------------|-----------------|
| Xia/Xiao/Zi better than Good/Evil | **Adopted**: Three-axis alignment system |
| Five Greats as gameplay archetypes | **Deferred**: NPCs exist but archetype classes are V3 |
| Nine Yin Manual as MacGuffin | **Flagged**: Could be Act 1 goal, not in prologue |
| Technique learning: Observation → Instruction → Epiphany | **Adopted**: Techniques gained via scene events |
| 2002 Third Edition as canonical source | **Adopted**: All lore references use this version |
| Fans value Guo Jing + Huang Rong chemistry | **Noted**: They don't appear in prologue, but future |

### From Economics Research

| Research Finding | Decision for V2 |
|------------------|-----------------|
| Logistic function for stat growth (soft caps) | **Adopted**: Task T013 implements this |
| Division-based damage formula | **Adopted**: Task T015 implements this |
| 15-minute retention loop | **Adopted**: Prologue designed for 15-30 min sessions |
| Resource types: Silver, Potential, Merits, Insight | **Simplified**: V2 only uses Qi, Neili, Potential |
| Monetization: Pay-for-variety not pay-to-win | **Deferred**: No monetization in V2 |

### From AI Integration Research

| Research Finding | Decision for V2 |
|------------------|-----------------|
| RAG with lore database | **Deferred**: Too complex for V2, hardcoded cards instead |
| NPC JSON character cards | **Adopted**: Task T021 |
| NeMo Guardrails for output validation | **Simplified**: Prompt constraints + manual review |
| Tiered memory (short/episodic/reflective) | **Simplified**: V2 only implements short-term (10 turns) |
| State-Inference prompting pattern | **Adopted**: Prompts include relationship-based tone logic |

---

## Key Design Decisions

### Decision 001: Skill Check Formula
**Options considered:**
1. d20 + modifier (D&D style) — high variance
2. 2d6 + modifier (Disco Elysium style) — bell curve
3. d100 percentile — explicit odds

**Decision**: 2d6 + modifier
**Rationale**: Bell curve means DC 10 is genuinely average. Extreme results (2 or 12) are rare. This matches the literary feel — martial artists don't randomly fail basic things.

### Decision 002: Combat Resolution
**Options considered:**
1. Single roll (current V1)
2. Real-time action
3. Multi-exchange turn-based

**Decision**: Multi-exchange turn-based
**Rationale**: Matches wuxia novels where fights are described as sequences of moves. Real-time would require different tech stack.

### Decision 003: AI Dialogue Scope
**Options considered:**
1. AI generates all NPC dialogue
2. AI only for "free talk" sections
3. Hybrid: authored key lines + AI variations

**Decision**: AI for free talk sections, authored for critical plot
**Rationale**: AI can't reliably deliver specific plot information. Use it for flavor, not plot.

### Decision 004: Alignment Visibility
**Options considered:**
1. Hidden from player
2. Visible with exact numbers
3. Visible with vague descriptions ("You feel a pull toward righteousness")

**Decision**: Visible with exact numbers
**Rationale**: Players like seeing numbers go up. Can always add poetic descriptions later.

### Decision 005: Failure Consequence Philosophy
**Options considered:**
1. Failures are punishments (lose resources)
2. Failures are alternate paths (different but not worse)
3. Failures have mixed consequences (some good, some bad)

**Decision**: Failures are alternate paths with flavor consequences
**Rationale**: Disco Elysium insight — failed checks often lead to the most memorable moments. Failure should branch, not block.

---

## Open Questions

### Q1: How should meditation work in V2?
**Current state**: Meditation uses AI for conversation, detects theme via keywords.
**Issue**: Keyword detection is brittle.
**Options**:
1. Keep AI-driven with better prompt engineering
2. Make meditation a minigame (breathing rhythm)
3. Make meditation purely authored with branches

**Leaning toward**: Option 1 with structured output (ask AI to return JSON with theme)

### Q2: Should combat have positioning?
**Current assumption**: No positioning, just technique selection.
**Counter-argument**: Positioning adds tactical depth.
**Decision needed by**: Task T016 (combat flow)

**Leaning toward**: No positioning in V2. Add in V3 if combat feels flat.

### Q3: How to handle NPC death in dialogue?
**Scenario**: Dying martial artist in prologue. How does conversation end?
**Options**:
1. AI detects "time to die" and ends conversation
2. Timer/clock that triggers death after N exchanges
3. Player choice to leave or stay until death

**Leaning toward**: Option 2 — Clock with 5 segments, each exchange is 1 segment. At 0, death scene triggers.

### Q4: What's the prologue's role in player identity?
**Issue**: Player is currently a nameless child. When do they get identity?
**Options**:
1. Name themselves at start of prologue
2. Name revealed after time skip
3. Stay nameless through prologue (name in Act 1)

**Leaning toward**: Option 3 — Namelessness reinforces "you are anyone" and defers customization.

---

## Delayed Consequences (Prologue → Act 1)

These flags set in prologue will affect Act 1 (documented here for future reference):

| Flag | Set When | Act 1 Impact |
|------|----------|--------------|
| `prologue_spared_bandit` | Player doesn't kill wounded enemy | Bandit appears in Act 2 as ally or enemy |
| `prologue_has_martial_book` | Player grabbed the book | Faster technique learning, hunted by others |
| `prologue_path_city` | Chose city survival path | Street-smart skills, urban contacts |
| `prologue_path_mountain` | Chose mountain isolation path | Higher cultivation base, naive about people |
| `prologue_learned_from_dying` | Completed dialogue with dying martial artist | Starts with extra technique |
| `prologue_alignment_xia_high` | Xia ≥ 30 at prologue end | Beggar Sect recognizes you |
| `prologue_alignment_zi_high` | Zi ≥ 30 at prologue end | Western Venom path hint |
| `prologue_first_kill` | Killed someone in combat | Psychological effect, certain NPCs react |

---

## Playtest Notes

### Session: [DATE]
**Tester**: [NAME]
**Path taken**: [DESCRIPTION]
**Duration**: [MINUTES]

**Issues found**:
- [ ] Issue 1
- [ ] Issue 2

**Suggestions**:
- Suggestion 1
- Suggestion 2

**Pacing notes**:
- Scene X felt too slow
- Scene Y was confusing

---

## Changelog

### [DATE] - V2 Planning Complete
- Created DEVELOPMENT_PLAN.md with 6 milestones
- Created TASK_QUEUE.md with 37 tasks
- Created SCRATCHPAD.md for notes
- Research synthesized into actionable decisions

### [DATE] - [MILESTONE COMPLETED]
- Tasks completed: T001, T002, T003
- Issues encountered: [description]
- Changes from original plan: [if any]

---

## Things to Watch For (Review Checklist)

When reviewing Codex implementations, check:

### For All Tasks
- [ ] TypeScript types are complete (no `any`)
- [ ] No console.log statements left in production code
- [ ] Error cases handled gracefully
- [ ] Mobile responsive
- [ ] Matches existing code style

### For Combat Tasks
- [ ] Damage never goes negative
- [ ] Qi costs are deducted correctly
- [ ] Combat can't soft-lock (always have valid action)
- [ ] Flee option works

### For Dialogue Tasks
- [ ] AI stays in character
- [ ] Memory is limited (not infinite)
- [ ] Conversation can always end
- [ ] Relationship changes are bounded

### For Skill Check Tasks
- [ ] Probability math is correct
- [ ] Failure leads somewhere (not dead end)
- [ ] DCs are reasonable for starting stats

### For Save/Load Tasks
- [ ] Old saves don't crash on load
- [ ] State is complete (nothing lost)
- [ ] Can't corrupt save by refreshing mid-save

---

## References

- [Gemini Research Report](/Users/leonliu/Desktop/Jianghu Game V2 Development Research.pdf)
- [Jin Yong 2002 Third Edition](https://wuxiasociety.com/legend-of-the-condor-heroes-third-edition-changes)
- [Disco Elysium Wiki - Skills](https://discoelysium.fandom.com/wiki/Skills)
- [Citizen Sleeper Design Analysis](https://howtomakeanrpg.com/r/a/case-study-citizen-sleeper.html)

---

## Quick Reference: Key Formulas

### Skill Check
```
Roll = 2d6 + SkillValue + Modifiers
Success = Roll >= DC
```

### Damage
```
Damage = TechniqueBase * (Atk / (Atk + 50 * Def)) * CritMod
CritMod = 1.5 if critical, 1.0 otherwise
Variance = ±10%
Minimum = 1
```

### Upgrade Cost
```
Cost = 10 * (1.15)^Level
```

### Breakthrough Success
```
BaseChance = [50%, 40%, 30%, 25%, 20%] per realm
FinalChance = BaseChance + (Neili / RequiredNeili - 1) * 10%
```
