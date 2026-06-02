const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const stylePrompts: Record<string, string> = {
  minimalist: 'minimalist, clean, modern design, simple and elegant',
  colorful: 'vibrant, colorful, eye-catching, bold colors',
  professional: 'professional, corporate, formal, polished',
  artistic: 'artistic, creative, abstract, expressive',
};

export async function generateImage(
  prompt: string,
  style?: string
): Promise<string> {
  const styleSuffix = style ? `, ${stylePrompts[style] || ''}` : '';

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: `${prompt}${styleSuffix}. High quality, Instagram post format, 1024x1024.`,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json',
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error?.message || `Erro na API OpenAI: ${response.status}`);
  }

  const data = await response.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error('Nenhuma imagem retornada');

  return `data:image/png;base64,${b64}`;
}
