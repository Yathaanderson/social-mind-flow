import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const toneLabels: Record<string, string> = {
  formal: 'formal e profissional',
  casual: 'descontraído e informal',
  sales: 'vendedor e persuasivo',
  inspirational: 'inspirador e motivacional',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const theme = typeof body.theme === 'string' ? body.theme.trim().slice(0, 300) : '';
    const tone = typeof body.tone === 'string' && toneLabels[body.tone] ? body.tone : 'casual';

    if (!theme) {
      return new Response(JSON.stringify({ error: 'Tema é obrigatório' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content:
              'Você é um especialista em marketing de redes sociais. Crie posts focados em Instagram em português do Brasil. Responda APENAS com um array JSON de strings, sem explicações ou formatação markdown.',
          },
          {
            role: 'user',
            content: `Crie 3 ideias de posts para Instagram sobre o tema "${theme}" com tom ${toneLabels[tone]}. Cada ideia deve ser um texto completo pronto para publicar, com emojis e hashtags relevantes. Responda apenas com um array JSON de 3 strings.`,
          },
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'Limite de requisições atingido. Tente novamente em instantes.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: 'Créditos de IA esgotados. Adicione créditos no workspace.' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!response.ok) {
      const text = await response.text();
      console.error('AI gateway error', response.status, text);
      return new Response(JSON.stringify({ error: 'Falha ao gerar ideias' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? '[]';
    const match = content.match(/\[[\s\S]*\]/);
    const ideas: string[] = match ? JSON.parse(match[0]) : [];

    return new Response(JSON.stringify({ ideas: ideas.slice(0, 3) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('generate-post-ideas error', error);
    return new Response(JSON.stringify({ error: 'Erro inesperado ao gerar ideias' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
