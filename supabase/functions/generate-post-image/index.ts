import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { prompt, style } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!prompt || prompt.trim() === '') {
      return new Response(JSON.stringify({ error: 'Prompt é obrigatório' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Input validation - limit prompt length
    const sanitizedPrompt = prompt.trim().slice(0, 500);

    const styleDescriptions: Record<string, string> = {
      minimalist: 'estilo minimalista, clean, moderno, com cores neutras e design simples',
      colorful: 'estilo colorido, vibrante, chamativo, com cores vivas e contrastantes',
      professional: 'estilo profissional, corporativo, formal, com visual elegante e sofisticado',
      artistic: 'estilo artístico, criativo, abstrato, com elementos visuais únicos e expressivos'
    };

    const stylePrompt = style && styleDescriptions[style] 
      ? `, ${styleDescriptions[style]}` 
      : '';

    const fullPrompt = `Crie uma imagem profissional para redes sociais: ${sanitizedPrompt}${stylePrompt}. A imagem deve ser de alta qualidade, visualmente atraente e adequada para postagens em redes sociais.`;

    console.log('Generating image for user:', user.id);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          { role: 'user', content: fullPrompt }
        ],
        modalities: ['image', 'text']
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Limite de requisições excedido. Aguarde alguns minutos e tente novamente.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Créditos insuficientes. Adicione créditos à sua conta para continuar gerando imagens.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error('Falha ao gerar imagem');
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract image from response
    const images = data.choices?.[0]?.message?.images;
    if (!images || images.length === 0) {
      throw new Error('Nenhuma imagem foi gerada');
    }

    const imageUrl = images[0]?.image_url?.url;
    if (!imageUrl) {
      throw new Error('URL da imagem não encontrada na resposta');
    }

    return new Response(JSON.stringify({ 
      imageBase64: imageUrl,
      message: data.choices?.[0]?.message?.content || 'Imagem gerada com sucesso!'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar imagem' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
