import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { buildNPCPrompt } from '@/lib/ai/prompts/npc-base';

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const {
      npcId,
      playerInput,
      characterProfile,
      personalityTraits,
      characterKnowledge,
      conversationHistory,
      sceneContext,
      relationshipLevel,
    } = await request.json();

    const systemPrompt = buildNPCPrompt({
      characterProfile,
      personalityTraits,
      characterKnowledge,
      relationshipLevel: relationshipLevel || 0,
      interactionHistory: JSON.stringify(
        conversationHistory?.filter((c: { npcId: string }) => c.npcId === npcId) || []
      ),
      sceneContext,
      playerInput,
    });

    const messages = (conversationHistory || []).map((entry: { speaker: string; text: string }) => ({
      role: entry.speaker === 'player' ? 'user' as const : 'assistant' as const,
      content: entry.text,
    }));

    messages.push({ role: 'user' as const, content: playerInput });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages,
    });

    const textContent = response.content.find(block => block.type === 'text');
    const text = textContent && 'text' in textContent ? textContent.text : '';

    return NextResponse.json({
      text,
      npcId,
    });
  } catch (error) {
    console.error('Dialogue API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate dialogue', text: 'The person remains silent.' },
      { status: 500 }
    );
  }
}
