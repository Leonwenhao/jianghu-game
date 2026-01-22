import { NextResponse } from 'next/server';
import { buildImagePrompt, SceneType } from '@/lib/ai/image-gen';

export async function POST(request: Request) {
  const { type, description, aspectRatio = 'landscape_16_9' } = await request.json();

  const prompt = buildImagePrompt((type as SceneType) || 'panel', description);

  try {
    const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        image_size: aspectRatio,
        num_inference_steps: 4,
        num_images: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fal.ai error:', errorText);
      throw new Error('Image generation failed');
    }

    const data = await response.json();

    return NextResponse.json({
      url: data.images[0].url,
      prompt,
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', url: '/images/placeholder.png' },
      { status: 500 }
    );
  }
}
