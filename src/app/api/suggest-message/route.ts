import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function POST() {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt:
      "Generate 3 friendly anonymous questions separated by || only.",
  });

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
