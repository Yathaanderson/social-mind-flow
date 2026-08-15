import { ToneType } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export async function generatePostIdeas(theme: string, tone: ToneType): Promise<string[]> {
  const { data, error } = await supabase.functions.invoke('generate-post-ideas', {
    body: { theme, tone },
  });

  if (error) {
    throw new Error(data?.error || error.message || 'Não foi possível gerar as ideias');
  }
  if (data?.error) {
    throw new Error(data.error);
  }

  const ideas = Array.isArray(data?.ideas) ? (data.ideas as string[]) : [];
  if (ideas.length === 0) throw new Error('Nenhuma ideia foi gerada. Tente outro tema.');

  return ideas.slice(0, 3);
}
