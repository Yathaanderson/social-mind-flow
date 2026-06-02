import { ToneType } from '@/types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const toneLabels: Record<ToneType, string> = {
  formal: 'formal e profissional',
  casual: 'descontraído e informal',
  sales: 'vendedor e persuasivo',
  inspirational: 'inspirador e motivacional',
};

export async function generatePostIdeas(theme: string, tone: ToneType): Promise<string[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em marketing de redes sociais. Crie posts focados em Instagram em português do Brasil. Responda APENAS com um array JSON de strings, sem explicações ou formatação markdown.',
        },
        {
          role: 'user',
          content: `Crie 3 ideias de posts para Instagram sobre o tema "${theme}" com tom ${toneLabels[tone]}. Cada ideia deve ser um texto completo pronto para publicar, com emojis e hashtags relevantes. Responda apenas com um array JSON de 3 strings.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error?.message || `Erro na API OpenAI: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '[]';

  const match = content.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('Resposta inválida da API');

  const ideas: string[] = JSON.parse(match[0]);
  return ideas.slice(0, 3);
}
