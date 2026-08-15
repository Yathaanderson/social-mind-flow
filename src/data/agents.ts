import type { StudioAgent } from '@/types/studio';

export const studioAgents: StudioAgent[] = [
  { id: 'reels-script', name: 'Roteirista de Reels', description: 'Roteiros de 15, 30 ou 60 segundos com gancho, cenas e CTA.', category: 'Vídeo', format: 'reel', objective: 'alcance', accent: 'coral' },
  { id: 'stories-sequence', name: 'Stories em Sequência', description: 'Sequências com enquete, prova, bastidor, objeção e Direct.', category: 'Conteúdo', format: 'stories', objective: 'relacionamento', accent: 'violet' },
  { id: 'carousel-educational', name: 'Carrossel Educacional', description: 'Estruturas de 5 a 10 páginas para ensinar e quebrar objeções.', category: 'Conteúdo', format: 'carousel', objective: 'educacao', accent: 'blue' },
  { id: 'copy-caption', name: 'Copy e Legendas', description: 'Legendas, capas, CTAs e variações de abertura para testar.', category: 'Conteúdo', format: 'feed', objective: 'conversao', accent: 'amber' },
  { id: 'proof-objections', name: 'Prova e Objeções', description: 'Transforma fatos e dúvidas reais em conteúdo de confiança.', category: 'Conversão', format: 'reel', objective: 'prova', accent: 'emerald' },
  { id: 'affiliate-brand', name: 'Afiliados e Marca', description: 'Adapta peças para comissão, parceria e divulgação comercial.', category: 'Segurança', format: 'feed', objective: 'conversao', accent: 'rose' },
  { id: 'repurpose', name: 'Reaproveitamento Multiformato', description: 'Converte um conteúdo em Reel, Stories, carrossel e Direct.', category: 'Escala', format: 'reel', objective: 'alcance', accent: 'cyan' },
  { id: 'direct-conversion', name: 'Direct e Conversão', description: 'Respostas consultivas para comentários e mensagens.', category: 'Conversão', format: 'direct', objective: 'conversao', accent: 'orange' },
  { id: 'auditor', name: 'Auditor de Conteúdo', description: 'Revisa fatos, repetição, CTA, claims e divulgação antes da aprovação.', category: 'Segurança', format: 'feed', objective: 'prova', accent: 'slate' },
];

export const formatLabels: Record<string, string> = {
  reel: 'Reel', stories: 'Stories', carousel: 'Carrossel', feed: 'Feed', direct: 'Direct',
};

export const objectiveLabels: Record<string, string> = {
  alcance: 'Alcance', relacionamento: 'Relacionamento', educacao: 'Educação', prova: 'Prova', conversao: 'Conversão',
};
