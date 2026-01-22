import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { buildMeditationPrompt } from '@/lib/ai/prompts/meditation';

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const {
      technique,
      bottleneck,
      martialHistory,
      playerTraits,
      conversationHistory,
      playerChoice,
    } = await request.json();

    const systemPrompt = buildMeditationPrompt({
      technique: technique || 'Basic qi sensing',
      bottleneck: bottleneck || 'The trauma of the past blocks your inner peace',
      martialHistory: martialHistory || [],
      playerTraits: playerTraits || { orthodoxy: 0, aggression: 0, cunning: 0 },
    });

    const messages = (conversationHistory || []).map((entry: { role: string; text: string }) => ({
      role: entry.role === 'user' ? 'user' as const : 'assistant' as const,
      content: entry.text,
    }));

    if (playerChoice) {
      messages.push({ role: 'user' as const, content: playerChoice });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: systemPrompt,
      messages: messages.length > 0 ? messages : [{ role: 'user', content: 'Begin the meditation.' }],
    });

    const textContent = response.content.find(block => block.type === 'text');
    const responseText = textContent && 'text' in textContent ? textContent.text : '';

    // Simple theme detection based on keywords
    let detectedTheme = 'determination';
    const lowerText = responseText.toLowerCase();
    if (lowerText.includes('anger') || lowerText.includes('rage') || lowerText.includes('revenge') || lowerText.includes('fury')) {
      detectedTheme = 'anger';
    } else if (lowerText.includes('sorrow') || lowerText.includes('grief') || lowerText.includes('loss') || lowerText.includes('tears')) {
      detectedTheme = 'sorrow';
    }

    // Generate choices for the player
    const choices = [
      { id: 'accept', text: 'Accept this truth and let it guide your qi.', consequence: { nextScene: 'post_meditation' } },
      { id: 'resist', text: 'No. There must be another way.', consequence: { nextScene: 'post_meditation' } },
      { id: 'question', text: 'But what does this mean for my path?', consequence: { nextScene: 'post_meditation' } },
    ];

    // Check if this is a breakthrough moment (after 3+ exchanges)
    const isBreakthrough = (conversationHistory?.length || 0) >= 3;

    return NextResponse.json({
      text: responseText,
      choices,
      detectedTheme,
      isBreakthrough,
    });
  } catch (error) {
    console.error('Meditation API error:', error);
    return NextResponse.json({
      text: 'The vision wavers... but you sense something stirring within.',
      choices: [
        { id: 'continue', text: 'Focus deeper.', consequence: { nextScene: 'post_meditation' } },
        { id: 'end', text: 'Open your eyes.', consequence: { nextScene: 'post_meditation' } },
      ],
      detectedTheme: 'determination',
      isBreakthrough: false,
    });
  }
}
