import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/** Una llamada de texto a texto. El orquestador no sabe qué modelo hay detrás. */
export async function completeWithClaude(prompt, { maxTokens = 8000 } = {}) {
  const res = await client.messages.create({
    model: 'claude-sonnet-5-5',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });
  return res.content.filter(b => b.type === 'text').map(b => b.text).join('');
}
