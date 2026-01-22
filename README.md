# 江湖 (Jianghu): Legend of the Condor Heroes

A cinematic narrative RPG set in Jin Yong's **Legend of the Condor Heroes (射鵰英雄傳)** universe, powered by AI dialogue and image generation.

## Vision

Players experience the jianghu—the martial arts underworld—as a nameless wanderer whose fate intersects with the epic story of Guo Jing, Huang Rong, and the Five Greats.

### Core Experience
- **Narrative immersion** — Story-first, gameplay serves the narrative
- **AI-driven dialogue** — NPCs respond dynamically within character constraints (Claude API)
- **Meaningful choices** — Decisions shape your martial path and relationships
- **Cinematic visuals** — Manga-panel presentation with ink wash aesthetics (Fal.ai)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| State Management | Zustand |
| AI Dialogue | Claude API (claude-sonnet-4-20250514) |
| Image Generation | Fal.ai (Flux models) |
| Deployment | Vercel |

## Project Structure

```
jianghu-game/
├── app/
│   ├── api/
│   │   ├── dialogue/      # AI dialogue endpoint
│   │   ├── meditation/    # Meditation mechanic endpoint
│   │   └── generate-image/# Image generation endpoint
│   ├── game/             # Main game page
│   └── page.tsx          # Landing page
├── components/
│   ├── game/             # Game UI components
│   │   ├── SceneRenderer.tsx
│   │   ├── DialogueBox.tsx
│   │   ├── ChoicePanel.tsx
│   │   ├── CombatPanel.tsx
│   │   └── MeditationMode.tsx
│   └── ui/               # Shared UI components
├── lib/
│   ├── ai/               # AI integration
│   │   └── prompts/      # System prompts for AI
│   ├── data/             # Game data
│   │   └── scenes/       # Scene definitions
│   └── game/             # Game engine types
└── stores/               # Zustand state management
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Environment Variables
Create a `.env.local` file:
```bash
ANTHROPIC_API_KEY=your_claude_api_key
FAL_KEY=your_fal_api_key
```

### Installation
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

---

## Development Progress

### Phase 1: MVP Foundation (Completed)
- [x] Next.js 14+ project setup with App Router
- [x] Tailwind CSS and base styling
- [x] Zustand state management store
- [x] TypeScript configuration
- [x] Project structure established

### Phase 2: Core Components (Completed)
- [x] SceneRenderer - Main scene display component
- [x] DialogueBox - Character dialogue with typewriter effect
- [x] ChoicePanel - Player choice interface
- [x] CombatPanel - Turn-based combat UI
- [x] MeditationMode - Meditation mechanic UI
- [x] CharacterPortrait - NPC portrait display
- [x] TypewriterText - Text animation component
- [x] InkWashBackground - Atmospheric background
- [x] TransitionEffects - Scene transitions

### Phase 3: AI Integration (Completed)
- [x] Claude API integration for dialogue
- [x] Dialogue route (`/api/dialogue`)
- [x] Meditation route (`/api/meditation`)
- [x] Narrator system prompt
- [x] NPC base prompt system
- [x] Meditation prompt system

### Phase 4: Image Generation (Completed)
- [x] Fal.ai integration
- [x] Image generation route (`/api/generate-image`)
- [x] Image generation script for assets

### Phase 5: Content (Completed)
- [x] Prologue scene data
- [x] Scene structure and types
- [x] Game state types

### Phase 6: Testing & Polish (Current)
- [x] Local testing completed
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Error handling improvements

---

## Research Notes

This project serves as a foundation for exploring:

1. **AI-driven narrative games** - How LLMs can enhance interactive storytelling
2. **Dynamic NPC systems** - Character personality persistence and memory
3. **Procedural content** - AI-generated scenes, dialogue variations
4. **Multi-model approaches** - Comparing different LLMs for game AI

### Planned LLM Experiments
- [ ] Compare Claude vs GPT-4 for dialogue quality
- [ ] Test local models (Llama, Mistral) for cost efficiency
- [ ] Experiment with fine-tuned models for character voices
- [ ] Evaluate image models (DALL-E, Midjourney, Stable Diffusion)

---

## License

This project is for research and educational purposes.

Jin Yong's works are copyrighted. This is a fan project and not affiliated with the official rights holders.

---

## Acknowledgments

- **Jin Yong (金庸)** - For creating the Legend of the Condor Heroes universe
- **Anthropic** - For Claude API
- **Fal.ai** - For image generation capabilities
