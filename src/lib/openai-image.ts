import { supabase } from '@/integrations/supabase/client';

export async function generateImage(prompt: string, style?: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('generate-post-image', {
    body: { prompt, style },
  });

  if (error) {
    throw new Error(data?.error || error.message || 'Não foi possível gerar a imagem');
  }
  if (data?.error) {
    throw new Error(data.error);
  }
  if (!data?.imageUrl) {
    throw new Error('Nenhuma imagem retornada');
  }

  return data.imageUrl as string;
}
