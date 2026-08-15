export type StudioFormat = 'reel' | 'stories' | 'carousel' | 'feed' | 'direct';
export type StudioObjective = 'alcance' | 'relacionamento' | 'educacao' | 'prova' | 'conversao';
export type StudioStatus = 'rascunho' | 'revisao' | 'aprovado' | 'produzido' | 'publicado';

export interface BrandProfile {
  name: string;
  niche: string;
  audience: string;
  tone: string;
  primaryCta: string;
  preferredWords: string;
  forbiddenWords: string;
}

export interface ProductContext {
  id: string;
  name: string;
  type: 'produto' | 'servico' | 'afiliado';
  description: string;
  verifiedFacts: string;
  benefits: string;
  objections: string;
  price: string;
  link: string;
}

export interface StudioAgent {
  id: string;
  name: string;
  description: string;
  category: string;
  format: StudioFormat;
  objective: StudioObjective;
  accent: string;
}

export interface GeneratedPiece {
  id: string;
  agentId: string;
  productId: string;
  title: string;
  format: StudioFormat;
  objective: StudioObjective;
  hook: string;
  script: string;
  caption: string;
  cta: string;
  visualPrompt: string;
  disclosureRequired: boolean;
  aiLabelRecommended: boolean;
  warnings: string[];
  status: StudioStatus;
  createdAt: string;
}
