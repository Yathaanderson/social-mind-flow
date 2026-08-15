import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const stylePrompts: Record<string, string> = {
  minimalist: 'minimalist, clean, modern design, simple and elegant',
  colorful: 'vibrant, colorful, eye-catching, bold colors',
  professional: 'professional, corporate, formal, polished',
  artistic: 'artistic, creative, abstract, expressive',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 800) : '';
    const style = typeof body.style === 'string' ? stylePrompts[body.style] : undefined;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Descrição da imagem é obrigatória' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const fullPrompt = `${prompt}${style ? `, ${style}` : ''}. High quality, Instagram post format, square 1:1.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [{ role: 'user', content: fullPrompt }],
        modalities: ['image', 'text'],
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
      return new Response(JSON.stringify({ error: 'Falha ao gerar imagem' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const imageUrl: string | undefined = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'Nenhuma imagem retornada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('generate-post-image error', error);
    return new Response(JSON.stringify({ error: 'Erro inesperado ao gerar imagem' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
