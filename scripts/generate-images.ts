/**
 * Image Generation Script for Prologue
 *
 * Run this script to generate all prologue images before launching the game.
 * Usage: npx ts-node scripts/generate-images.ts
 *
 * Make sure to set FAL_KEY in your environment.
 */

import { PROLOGUE_IMAGES, buildImagePrompt } from '../lib/ai/image-gen';
import * as fs from 'fs';
import * as path from 'path';

const FAL_KEY = process.env.FAL_KEY;

if (!FAL_KEY) {
  console.error('FAL_KEY environment variable not set');
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, '../public/images/generated');

async function generateImage(prompt: string): Promise<string> {
  const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_KEY}`,
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

async function downloadImage(url: string, filepath: string): Promise<void> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(buffer));
}

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Generating ${PROLOGUE_IMAGES.length} images...`);
  console.log(`Output directory: ${OUTPUT_DIR}`);

  for (let i = 0; i < PROLOGUE_IMAGES.length; i++) {
    const item = PROLOGUE_IMAGES[i];
    const filename = `${item.id}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);

    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`[${i + 1}/${PROLOGUE_IMAGES.length}] Skipping ${item.id} (already exists)`);
      continue;
    }

    console.log(`[${i + 1}/${PROLOGUE_IMAGES.length}] Generating ${item.id}...`);

    try {
      const prompt = buildImagePrompt(item.type, item.description);
      console.log(`  Prompt: ${prompt.substring(0, 100)}...`);

      const imageUrl = await generateImage(prompt);
      console.log(`  Downloading from: ${imageUrl.substring(0, 50)}...`);

      await downloadImage(imageUrl, filepath);
      console.log(`  Saved to: ${filepath}`);

      // Rate limiting - wait 2 seconds between requests
      if (i < PROLOGUE_IMAGES.length - 1) {
        console.log('  Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`  Error generating ${item.id}:`, error);
    }
  }

  console.log('Done!');
}

main().catch(console.error);
