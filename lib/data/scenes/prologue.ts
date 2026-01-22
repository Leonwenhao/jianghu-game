import { Scene } from '@/lib/game/types';

export const PROLOGUE_SCENES: Scene[] = [
  // ========== COLD OPEN ==========
  {
    id: 'cold_open',
    type: 'narrative',
    background: { prompt: 'black void with single wisp of smoke rising slowly, minimalist, pure darkness, ethereal' },
    content: {
      panels: [
        {
          id: 'cold_open_1',
          text: '',  // Pure black, pause
          panelSize: 'full',
          textPosition: 'center',
        }
      ],
      nextScene: 'poetry_intro',
    }
  },

  {
    id: 'poetry_intro',
    type: 'narrative',
    background: { prompt: 'misty mountains at dawn, ink wash style, soft golden light breaking through clouds, serene and epic, traditional Chinese landscape' },
    content: {
      panels: [
        {
          id: 'poetry_1',
          text: '「十步殺一人，千里不留行」',
          textPosition: 'center',
          panelSize: 'full',
        },
        {
          id: 'poetry_2',
          text: 'Ten steps, one kill. A thousand miles, no trace.',
          textPosition: 'center',
          panelSize: 'full',
        },
        {
          id: 'poetry_3',
          text: '— Li Bai, "Song of the Wandering Knight"',
          textPosition: 'center',
          panelSize: 'full',
        }
      ],
      nextScene: 'massacre_01',
    }
  },

  // ========== THE MASSACRE ==========
  {
    id: 'massacre_01',
    type: 'narrative',
    background: { prompt: 'burning village at night, Song Dynasty architecture, flames reflecting off snow, distant mountains, devastation' },
    content: {
      panels: [
        {
          id: 'massacre_01_1',
          image: { prompt: 'close up of child eyes peering through wooden slats of cart, firelight reflected in frightened eyes, intense emotion' },
          text: 'The smell comes first. Smoke. Something else beneath it—something you will learn to recognize in the years ahead.',
          panelSize: 'full',
        },
        {
          id: 'massacre_01_2',
          image: { prompt: 'view from inside wooden cart looking out at burning village through gaps in wood, glimpse of chaos outside' },
          text: 'Through the gaps in the merchant\'s cart, the world is ending in fragments.',
          panelSize: 'half',
        },
        {
          id: 'massacre_01_3',
          image: { prompt: 'silhouettes of armored horsemen against burning buildings, Jurchen Jin dynasty soldiers, dramatic shadows, ominous' },
          text: 'Jurchen cavalry. You count seven horses pass by your hiding place. Their armor catches the firelight.',
          panelSize: 'half',
        }
      ],
      choices: [
        {
          id: 'stay_hidden',
          text: 'Press yourself deeper into the shadows. Do not breathe.',
          consequence: {
            nextScene: 'massacre_02_hidden',
            statChanges: { 'traits.aggression': -5 },
            flags: { 'prologue_hid': true }
          }
        },
        {
          id: 'peer_out',
          text: 'You need to see. Carefully, you shift to get a better view.',
          consequence: {
            nextScene: 'massacre_02_witnessed',
            statChanges: { 'traits.aggression': 5, 'cultivation.comprehension': 1 },
            flags: { 'prologue_witnessed': true }
          }
        },
        {
          id: 'call_out',
          text: 'Your mother was out there. You open your mouth to call—',
          disabled: true,
          disabledReason: 'Something stops you. Perhaps wisdom. Perhaps cowardice. You will never know.',
          consequence: { nextScene: 'massacre_02_hidden' }
        }
      ]
    }
  },

  // Branch: Stayed Hidden
  {
    id: 'massacre_02_hidden',
    type: 'narrative',
    background: { prompt: 'dark interior of wooden cart, child curled in corner among merchant goods, slivers of orange firelight through cracks, fear' },
    content: {
      panels: [
        {
          id: 'hidden_1',
          text: 'You make yourself small. Smaller than the sacks of rice. Smaller than the bolts of cloth. Small enough that death might not notice you.',
          panelSize: 'full',
        },
        {
          id: 'hidden_2',
          text: 'You press your hands over your ears, but the sounds find their way through. Screaming. Commands in a tongue you don\'t understand. Then, worse—silence.',
          panelSize: 'half',
        },
        {
          id: 'hidden_3',
          text: 'Hours pass. Or minutes. Time means nothing in the dark.',
          panelSize: 'half',
        }
      ],
      nextScene: 'massacre_03_aftermath',
    }
  },

  // Branch: Witnessed
  {
    id: 'massacre_02_witnessed',
    type: 'narrative',
    background: { prompt: 'wide shot of village square during massacre, chaos, soldiers on horseback, snow falling, dramatic cinematic lighting' },
    content: {
      panels: [
        {
          id: 'witnessed_1',
          image: { prompt: 'man in scholar robes performing martial arts stance against multiple soldiers, dynamic motion, snow falling, heroic' },
          text: 'Through the gap, you see him. A man in scholar\'s robes, moving like nothing you\'ve ever seen. His hands are empty, but soldiers fall before him.',
          panelSize: 'full',
        },
        {
          id: 'witnessed_2',
          image: { prompt: 'close up of martial artist face, determined expression, blood on cheek, dramatic lighting, intensity' },
          text: 'Three soldiers charge him at once. He steps between their blades like water flowing around stones. His palm strikes once, twice—they crumple.',
          panelSize: 'half',
        },
        {
          id: 'witnessed_3',
          text: 'For a moment, you believe he might save everyone.',
          panelSize: 'half',
        },
        {
          id: 'witnessed_4',
          image: { prompt: 'archer on horseback drawing bow, silhouetted against flames, ominous, dramatic angle, foreboding' },
          text: 'You do not see the archer.',
          panelSize: 'full',
        },
        {
          id: 'witnessed_5',
          image: { prompt: 'man fallen to knees, arrow in back, reaching toward someone off screen, tragic, snow falling, emotional' },
          text: 'The scholar falls. His eyes, in his final moment, find the cart where you hide. Find you. He says something—his lips move—but you cannot hear over the roaring in your ears.',
          panelSize: 'full',
        }
      ],
      nextScene: 'massacre_03_aftermath',
      flags: { 'saw_martial_artist_die': true }
    }
  },

  // Convergence: Aftermath
  {
    id: 'massacre_03_aftermath',
    type: 'narrative',
    background: { prompt: 'dawn breaking over destroyed village, smoke rising, snow covering ruins, melancholy, empty, devastation aftermath' },
    content: {
      panels: [
        {
          id: 'aftermath_1',
          text: 'When the sun rises, you are alone.',
          panelSize: 'full',
        },
        {
          id: 'aftermath_2',
          image: { prompt: 'child standing in ruined village, back to camera, looking at destruction, morning light, wide shot, loneliness, sorrow' },
          text: 'The village of Niu Family is gone. Your family is gone. The life you knew—gone.',
          panelSize: 'full',
        },
        {
          id: 'aftermath_3',
          text: 'You are seven years old.',
          panelSize: 'full',
        }
      ],
      nextScene: 'aftermath_choice',
    }
  },

  {
    id: 'aftermath_choice',
    type: 'narrative',
    background: { prompt: 'mountain crossroads in snow, one path leading to distant city, one into wild mountains, melancholy atmosphere, choice, solitude' },
    content: {
      panels: [
        {
          id: 'choice_1',
          text: 'The merchant who owned the cart is dead. His goods are scattered in the snow. No one will come looking for a child who does not exist.',
          panelSize: 'full',
        },
        {
          id: 'choice_2',
          text: 'Which way?',
          panelSize: 'full',
        }
      ],
      choices: [
        {
          id: 'go_south',
          text: 'South. Toward Lin\'an and the Song capital. Toward people.',
          consequence: {
            nextScene: 'timeskip_city',
            flags: { 'origin_path': 'city' }
          }
        },
        {
          id: 'go_mountains',
          text: 'Into the mountains. Away from soldiers. Away from everyone.',
          consequence: {
            nextScene: 'timeskip_mountain',
            flags: { 'origin_path': 'mountain' }
          }
        },
        {
          id: 'search_bodies',
          text: 'First—you have to know. You return to the village.',
          requirement: { flag: 'saw_martial_artist_die' },
          consequence: {
            nextScene: 'search_scholar',
            flags: { 'searched_scholar': true }
          }
        }
      ]
    }
  },

  // Optional: Search the scholar's body
  {
    id: 'search_scholar',
    type: 'narrative',
    background: { prompt: 'close up of fallen martial artist in snow, peaceful expression in death, morning light, respectful composition, serene' },
    content: {
      panels: [
        {
          id: 'search_1',
          text: 'You find him where he fell. The snow has begun to cover him, a white shroud.',
          panelSize: 'full',
        },
        {
          id: 'search_2',
          image: { prompt: 'child hands holding old book with Chinese characters, worn leather cover, morning light, significant moment, mystery' },
          text: 'In his robe, hidden against his chest: a small book. The pages are filled with characters you cannot read, and diagrams of a human body with lines flowing through it.',
          panelSize: 'half',
        },
        {
          id: 'search_3',
          text: 'You take it. You do not know why. Perhaps because he looked at you at the end. Perhaps because it is all that remains of a man who fought like a god and died like anyone else.',
          panelSize: 'half',
        }
      ],
      nextScene: 'aftermath_choice_2',
      flags: { 'has_mysterious_manual': true },
      statChanges: { 'cultivation.comprehension': 2 }
    }
  },

  {
    id: 'aftermath_choice_2',
    type: 'narrative',
    background: { prompt: 'mountain crossroads in snow, one path leading to distant city, one into wild mountains, melancholy atmosphere, choice' },
    content: {
      panels: [
        {
          id: 'choice2_1',
          text: 'Now. Which way?',
          panelSize: 'full',
        }
      ],
      choices: [
        {
          id: 'go_south_2',
          text: 'South. Toward Lin\'an. Maybe someone there can read this book.',
          consequence: {
            nextScene: 'timeskip_city',
            flags: { 'origin_path': 'city' }
          }
        },
        {
          id: 'go_mountains_2',
          text: 'Into the mountains. You will learn to read it yourself.',
          consequence: {
            nextScene: 'timeskip_mountain',
            flags: { 'origin_path': 'mountain' }
          }
        }
      ]
    }
  },

  // ========== TIME SKIP ==========
  {
    id: 'timeskip_city',
    type: 'narrative',
    background: { prompt: 'bustling Song Dynasty city street, Lin an capital, market stalls, crowds, traditional architecture, warm afternoon light, vibrant' },
    content: {
      panels: [
        {
          id: 'city_1',
          text: 'Ten years pass.',
          panelSize: 'full',
          textPosition: 'center',
        },
        {
          id: 'city_2',
          image: { prompt: 'young adult in simple clothes walking through crowded market street, determined expression, blend of poverty and pride, hope' },
          text: 'Lin\'an is a city of a million souls. You learned to survive among them—running messages, carrying loads, doing whatever work would fill your belly.',
          panelSize: 'full',
        },
        {
          id: 'city_3',
          text: 'But you never forgot that night. The man who moved like water. The book you still cannot fully read.',
          panelSize: 'half',
        },
        {
          id: 'city_4',
          text: 'The jianghu—the world of martial artists that exists in the shadows of the mundane world—you have glimpsed its edges. Heard whispers in teahouses. Seen things that made no sense.',
          panelSize: 'half',
        },
        {
          id: 'city_5',
          text: 'Now, finally, you are old enough to seek it.',
          panelSize: 'full',
        }
      ],
      nextScene: 'first_meditation',
    }
  },

  {
    id: 'timeskip_mountain',
    type: 'narrative',
    background: { prompt: 'remote mountain hermitage, simple hut among pine trees, mist in valleys below, peaceful isolation, serene beauty' },
    content: {
      panels: [
        {
          id: 'mountain_1',
          text: 'Ten years pass.',
          panelSize: 'full',
          textPosition: 'center',
        },
        {
          id: 'mountain_2',
          image: { prompt: 'young adult practicing martial arts stance alone on mountain cliff, dawn light, disciplined solitude, strength' },
          text: 'The mountains taught you what people could not. Patience. Silence. How to survive on nothing. How to listen to your own body.',
          panelSize: 'full',
        },
        {
          id: 'mountain_3',
          text: 'The book—you have memorized every character, traced every diagram. Some of it you understand now. Most of it remains a mystery.',
          panelSize: 'half',
        },
        {
          id: 'mountain_4',
          text: 'But you can feel something stirring within you. Qi, the old texts call it. Life force. You have touched it, briefly, in your deepest meditations.',
          panelSize: 'half',
        },
        {
          id: 'mountain_5',
          text: 'The world of martial artists exists somewhere below these peaks. You have avoided it long enough.',
          panelSize: 'full',
        }
      ],
      nextScene: 'first_meditation',
    }
  },

  // ========== FIRST MEDITATION ==========
  {
    id: 'first_meditation',
    type: 'meditation',
    background: { prompt: 'abstract void with flowing ink patterns, ethereal qi energy visualization, dark void with subtle amber and jade color gradients, spiritual' },
    content: {
      context: 'Your first true attempt at cultivation meditation',
      technique: 'Basic qi sensing',
      bottleneck: 'The trauma of the massacre blocks your inner peace',
      aiPrompt: `The player is attempting their first real meditation. They are trying to sense their qi.

Their background: Witnessed a massacre as a child. May have seen a martial artist die. Has spent 10 years either in the city streets or alone in the mountains.

Their key memory: The night of the massacre.

Guide them through a meditation that:
1. Asks them to focus inward
2. Confronts them with the memory they've buried
3. Asks what they felt—fear? anger? helplessness? fascination with the martial artist?
4. The answer shapes their initial cultivation path

Keep responses short (2-3 sentences). After 3-4 exchanges, guide toward a breakthrough moment.`,
      possibleOutcomes: [
        {
          theme: 'anger',
          consequence: {
            nextScene: 'post_meditation_aggressive',
            statChanges: { 'traits.aggression': 15, 'cultivation.internalEnergy': 5 },
            techniqueModifier: { style: 'aggressive', element: 'fire' }
          }
        },
        {
          theme: 'sorrow',
          consequence: {
            nextScene: 'post_meditation_defensive',
            statChanges: { 'traits.aggression': -10, 'cultivation.internalEnergy': 5 },
            techniqueModifier: { style: 'flowing', element: 'water' }
          }
        },
        {
          theme: 'determination',
          consequence: {
            nextScene: 'post_meditation_balanced',
            statChanges: { 'cultivation.comprehension': 5, 'cultivation.internalEnergy': 5 },
            techniqueModifier: { style: 'balanced', element: 'earth' }
          }
        }
      ]
    }
  },

  // ========== POST MEDITATION SCENES ==========
  {
    id: 'post_meditation_aggressive',
    type: 'narrative',
    background: { prompt: 'abstract spiritual scene with fiery energy, aggressive qi visualization, red and orange tones, power' },
    content: {
      panels: [
        {
          id: 'aggressive_1',
          text: 'Your eyes snap open. Heat pulses through your meridians—raw, untamed. The memory of flame and blood has ignited something within you.',
          panelSize: 'full',
        },
        {
          id: 'aggressive_2',
          text: 'This is your first true step on the martial path. The fire of vengeance burns bright, but can you control it?',
          panelSize: 'half',
        },
        {
          id: 'aggressive_3',
          text: 'Your cultivation has begun. The realm of Qi-Sensing awaits.',
          panelSize: 'half',
        }
      ],
      nextScene: 'prologue_end',
      statChanges: { 'cultivation.internalEnergy': 3 }
    }
  },

  {
    id: 'post_meditation_defensive',
    type: 'narrative',
    background: { prompt: 'abstract spiritual scene with flowing water energy, calm qi visualization, blue and teal tones, serenity' },
    content: {
      panels: [
        {
          id: 'defensive_1',
          text: 'Your eyes open slowly. Tears track down your cheeks—you hadn\'t noticed you were crying. The grief you\'ve carried for ten years flows like water, and with it, something else.',
          panelSize: 'full',
        },
        {
          id: 'defensive_2',
          text: 'Qi moves through you in gentle currents. Not the force of destruction, but the persistence of water wearing down stone.',
          panelSize: 'half',
        },
        {
          id: 'defensive_3',
          text: 'Your cultivation has begun. The realm of Qi-Sensing awaits.',
          panelSize: 'half',
        }
      ],
      nextScene: 'prologue_end',
      statChanges: { 'cultivation.internalEnergy': 3 }
    }
  },

  {
    id: 'post_meditation_balanced',
    type: 'narrative',
    background: { prompt: 'abstract spiritual scene with grounded earth energy, balanced qi visualization, brown and green tones, stability' },
    content: {
      panels: [
        {
          id: 'balanced_1',
          text: 'Your eyes open with clarity. The past is the past—unchangeable. But the future is a path you can walk with purpose.',
          panelSize: 'full',
        },
        {
          id: 'balanced_2',
          text: 'Qi stirs within you—steady, grounded. Like the mountain that endures all seasons, you have found your center.',
          panelSize: 'half',
        },
        {
          id: 'balanced_3',
          text: 'Your cultivation has begun. The realm of Qi-Sensing awaits.',
          panelSize: 'half',
        }
      ],
      nextScene: 'prologue_end',
      statChanges: { 'cultivation.internalEnergy': 3 }
    }
  },

  // ========== PROLOGUE END ==========
  {
    id: 'prologue_end',
    type: 'narrative',
    background: { prompt: 'misty mountains at dawn, ink wash style, soft golden light, serene and epic, traditional Chinese landscape, hope' },
    content: {
      panels: [
        {
          id: 'end_1',
          text: '「事了拂衣去，深藏功與名」',
          textPosition: 'center',
          panelSize: 'full',
        },
        {
          id: 'end_2',
          text: 'Deed done, brush off robes and depart. Hide deep your merit and fame.',
          textPosition: 'center',
          panelSize: 'full',
        },
        {
          id: 'end_3',
          text: '— Li Bai, "Song of the Wandering Knight"',
          textPosition: 'center',
          panelSize: 'full',
        },
        {
          id: 'end_4',
          text: 'End of Prologue',
          textPosition: 'center',
          panelSize: 'full',
        },
        {
          id: 'end_5',
          text: 'Your journey in the jianghu has only begun...',
          textPosition: 'center',
          panelSize: 'full',
        }
      ],
      choices: [
        {
          id: 'restart',
          text: 'Begin again',
          consequence: {
            nextScene: 'cold_open',
          }
        }
      ]
    }
  },
];

export function getPrologueScene(id: string): Scene | undefined {
  return PROLOGUE_SCENES.find(scene => scene.id === id);
}

export function getNextScene(currentId: string, choiceId?: string): string | undefined {
  const current = getPrologueScene(currentId);
  if (!current) return undefined;

  const content = current.content as { choices?: Array<{ id: string; consequence: { nextScene: string } }>; nextScene?: string };

  if (choiceId && content.choices) {
    const choice = content.choices.find(c => c.id === choiceId);
    return choice?.consequence.nextScene;
  }

  return content.nextScene;
}
