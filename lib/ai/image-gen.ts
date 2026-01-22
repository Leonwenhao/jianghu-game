export const BASE_STYLE_PROMPT = `Chinese wuxia art style, ink wash painting influence, cinematic composition, atmospheric lighting, muted earth tones with jade green and deep red accents, inspired by Hero (2002) and Crouching Tiger Hidden Dragon cinematography, dramatic shadows, traditional Song Dynasty setting`;

export const SCENE_PROMPTS = {
  landscape: (description: string) =>
    `${BASE_STYLE_PROMPT}, wide landscape shot, ${description}, misty mountains in background, traditional Chinese architecture, volumetric fog`,

  character: (description: string) =>
    `${BASE_STYLE_PROMPT}, character portrait, ${description}, expressive face, traditional hanfu clothing, detailed fabric textures, dramatic side lighting`,

  combat: (description: string) =>
    `${BASE_STYLE_PROMPT}, dynamic action scene, ${description}, motion blur on weapons, fabric flowing with movement, dramatic perspective, dust particles in air`,

  meditation: (description: string) =>
    `${BASE_STYLE_PROMPT}, abstract spiritual scene, ${description}, flowing ink dissolving in water, ethereal qi energy visualization, dark void with subtle color gradients`,

  panel: (description: string) =>
    `${BASE_STYLE_PROMPT}, manga panel composition, ${description}, strong blacks, clear focal point, emotional intensity`,
};

export type SceneType = keyof typeof SCENE_PROMPTS;

export function buildImagePrompt(type: SceneType, description: string): string {
  const promptGenerator = SCENE_PROMPTS[type];
  return promptGenerator ? promptGenerator(description) : `${BASE_STYLE_PROMPT}, ${description}`;
}

export async function generateImage(
  type: SceneType,
  description: string
): Promise<string> {
  const prompt = buildImagePrompt(type, description);

  const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_size: 'landscape_16_9',
      num_inference_steps: 4,
      num_images: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Image generation failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.images[0].url;
}

// Batch image generation for prologue
export interface ImageBatchItem {
  id: string;
  type: SceneType;
  description: string;
}

export async function generateImageBatch(
  items: ImageBatchItem[]
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  for (const item of items) {
    try {
      const url = await generateImage(item.type, item.description);
      results.set(item.id, url);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to generate image for ${item.id}:`, error);
      results.set(item.id, '/images/placeholder.png');
    }
  }

  return results;
}

// Prologue image definitions
export const PROLOGUE_IMAGES: ImageBatchItem[] = [
  { id: 'cold_open_bg', type: 'meditation', description: 'black void with smoke wisp rising slowly, minimalist, darkness' },
  { id: 'poetry_bg', type: 'landscape', description: 'misty mountains at dawn, ink wash style, soft golden light breaking through clouds, serene and epic' },
  { id: 'massacre_bg', type: 'landscape', description: 'burning village at night, Song Dynasty architecture, flames reflecting off snow, distant mountains' },
  { id: 'child_eyes', type: 'panel', description: 'close up of child eyes peering through wooden slats of cart, firelight reflected in frightened eyes, intense' },
  { id: 'cart_view', type: 'panel', description: 'view from inside wooden cart looking out at burning village through gaps in wood, glimpse of chaos outside' },
  { id: 'jurchen_cavalry', type: 'combat', description: 'silhouettes of armored horsemen against burning buildings, Jurchen Jin dynasty soldiers, dramatic shadows' },
  { id: 'martial_artist_fighting', type: 'combat', description: 'man in scholar robes performing martial arts stance against multiple soldiers, dynamic motion, snow falling' },
  { id: 'martial_artist_face', type: 'character', description: 'close up of martial artist face, determined expression, blood on cheek, dramatic lighting' },
  { id: 'archer', type: 'panel', description: 'archer on horseback drawing bow, silhouetted against flames, ominous, dramatic angle' },
  { id: 'scholar_fallen', type: 'panel', description: 'man fallen to knees, arrow in back, reaching toward someone off screen, tragic, snow falling, emotional' },
  { id: 'dawn_aftermath', type: 'landscape', description: 'dawn breaking over destroyed village, smoke rising, snow covering ruins, melancholy, empty' },
  { id: 'child_standing', type: 'panel', description: 'child standing in ruined village, back to camera, looking at destruction, morning light, wide shot, loneliness' },
  { id: 'crossroads', type: 'landscape', description: 'mountain crossroads in snow, one path leading to distant city, one into wild mountains, melancholy atmosphere, choice' },
  { id: 'mysterious_book', type: 'panel', description: 'child hands holding old book with Chinese characters, worn leather cover, morning light, significant moment' },
  { id: 'city_street', type: 'landscape', description: 'bustling Song Dynasty city street, Lin\'an capital, market stalls, crowds, traditional architecture, warm afternoon light' },
  { id: 'young_adult_city', type: 'character', description: 'young adult in simple clothes walking through crowded market street, determined expression, blend of poverty and pride' },
  { id: 'mountain_hermitage', type: 'landscape', description: 'remote mountain hermitage, simple hut among pine trees, mist in valleys below, peaceful isolation' },
  { id: 'young_adult_training', type: 'character', description: 'young adult practicing martial arts stance alone on mountain cliff, dawn light, disciplined solitude' },
  { id: 'meditation_abstract', type: 'meditation', description: 'abstract void with flowing ink patterns, ethereal qi energy visualization, dark void with subtle amber and jade color gradients' },
];
