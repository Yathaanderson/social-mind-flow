import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, tone, platform } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const toneDescriptions: Record<string, string> = {
      formal: 'profissional, corporativo e respeitoso',
      casual: 'descontraído, amigável e acessível',
      sales: 'persuasivo, focado em vendas e benefícios',
      inspirational: 'motivacional, inspirador e emotivo'
    };

    const platformGuidelines: Record<string, string> = {
      instagram: 'Use emojis, hashtags relevantes, e mantenha o texto engajador. Limite de 2200 caracteres.',
      linkedin: 'Tom mais profissional, foque em insights de negócios e networking. Pode ser mais longo.',
      twitter: 'Seja conciso e impactante. Limite de 280 caracteres. Use hashtags com moderação.',
      tiktok: 'Linguagem jovem e dinâmica. Use tendências e linguagem de internet.'
    };

    const systemPrompt = `Você é um expert em social media marketing, especializado em criar conteúdo viral e engajador.
    
Crie exatamente 3 posts únicos e criativos para ${platform || 'redes sociais'}.
Tom de voz: ${toneDescriptions[tone] || 'versátil e adaptável'}
${platform ? `Diretrizes da plataforma: ${platformGuidelines[platform]}` : ''}

IMPORTANTE:
- Cada post deve ser numerado (1., 2., 3.)
- Inclua emojis relevantes
- Adicione 3-5 hashtags ao final de cada post
- Seja criativo e original
- Adapte o conteúdo para engajar o público-alvo`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Tema: ${theme || 'Crie posts sobre tendências atuais de marketing digital'}` }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente em alguns minutos.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Créditos insuficientes. Adicione créditos à sua conta.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error('Failed to generate ideas');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse the numbered posts
    const posts = content.split(/\d+\.\s+/).filter((p: string) => p.trim()).map((p: string) => p.trim());

    return new Response(JSON.stringify({ ideas: posts }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating post ideas:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
