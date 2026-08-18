import { useMemo, useState } from 'react';
import { Check, Copy, FileText, Image, Instagram, Layers3, LibraryBig, MessageCircle, Plus, Rocket, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { formatLabels, objectiveLabels, studioAgents } from '@/data/agents';
import type { BrandProfile, GeneratedPiece, ProductContext, StudioAgent } from '@/types/studio';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createPost } from '@/integrations/firebase/firestore';

const initialBrand: BrandProfile = {
  name: 'Minha marca', niche: 'Produtos e serviços', audience: 'Pessoas que buscam soluções práticas', tone: 'Direto, próximo e útil', primaryCta: 'Acesse o link da bio', preferredWords: 'prático, simples, real', forbiddenWords: 'garantia, cura, resultado absoluto',
};

const initialProduct: ProductContext = {
  id: 'demo-product', name: 'Novo produto ou serviço', type: 'produto', description: '', verifiedFacts: '', benefits: '', objections: '', price: '', link: '',
};

function createPiece(agent: StudioAgent, product: ProductContext, brand: BrandProfile): GeneratedPiece {
  const productName = product.name || 'seu produto';
  const hook = agent.format === 'stories' ? `Você já tentou resolver isso e continuou com o mesmo problema?` : `O detalhe de ${productName} que quase ninguém percebe de primeira.`;
  const script = agent.format === 'carousel' ? `Página 1: ${hook}\nPágina 2: apresente o contexto real do público.\nPágina 3: mostre o fato verificável ou benefício informado.\nPágina 4: responda uma objeção.\nPágina 5: convide a pessoa para ${brand.primaryCta}.` : `0–3s · Gancho: ${hook}\n3–8s · Mostre ${productName} em uso, com enquadramento próximo.\n8–18s · Explique o benefício usando somente fatos confirmados.\n18–25s · Responda a principal objeção.\n25–30s · CTA: ${brand.primaryCta}.`;
  const caption = `${hook}\n\n${product.description || 'Explique o problema que esta oferta ajuda a resolver e mostre o contexto real de uso.'}\n\n${brand.primaryCta}.`;
  return { id: crypto.randomUUID(), agentId: agent.id, productId: product.id, title: `${agent.name} · ${productName}`, format: agent.format, objective: agent.objective, hook, script, caption, cta: brand.primaryCta, visualPrompt: `Cena vertical 9:16, estética ${brand.tone}, produto ${productName} preservado em forma, proporção, cor e rótulo. Iluminação natural, textura realista, enquadramento de celular e sem texto inventado na embalagem.`, disclosureRequired: product.type === 'afiliado', aiLabelRecommended: false, warnings: product.verifiedFacts ? [] : ['Adicione fatos confirmados antes de publicar afirmações específicas.'], status: 'revisao', createdAt: new Date().toISOString() };
}

const iconForAgent = (id: string) => {
  if (id.includes('reel') || id.includes('visual')) return WandSparkles;
  if (id.includes('stories') || id.includes('carousel') || id.includes('copy')) return Layers3;
  if (id.includes('direct')) return MessageCircle;
  if (id.includes('auditor') || id.includes('affiliate')) return ShieldCheck;
  return Sparkles;
};

export default function Studio() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [brand, setBrand] = useState(initialBrand);
  const [product, setProduct] = useState(initialProduct);
  const [selectedAgent, setSelectedAgent] = useState<StudioAgent>(studioAgents[0]);
  const [piece, setPiece] = useState<GeneratedPiece | null>(null);
  const [filter, setFilter] = useState('Todos');
  const [saved, setSaved] = useState<GeneratedPiece[]>([]);
  const [saving, setSaving] = useState(false);
  const categories = ['Todos', ...Array.from(new Set(studioAgents.map((agent) => agent.category)))];
  const visibleAgents = useMemo(() => filter === 'Todos' ? studioAgents : studioAgents.filter((agent) => agent.category === filter), [filter]);

  const updateBrand = (key: keyof BrandProfile, value: string) => setBrand((current) => ({ ...current, [key]: value }));
  const updateProduct = (key: keyof ProductContext, value: string) => setProduct((current) => ({ ...current, [key]: value }));
  const generate = () => { const next = createPiece(selectedAgent, product, brand); setPiece(next); toast({ title: 'Peça gerada', description: `${selectedAgent.name} criou uma peça revisável.` }); };
  const savePiece = async () => {
    if (!piece) return;
    if (!user) { toast({ title: 'Entre na sua conta', description: 'É preciso estar autenticado para salvar na biblioteca.', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      await createPost({
        user_id: user.uid,
        content: `${piece.caption}\n\n---\nRoteiro (${formatLabels[piece.format]}):\n${piece.script}`,
        platforms: ['instagram'],
        image_url: null,
        status: 'rascunho',
        scheduled_for: null,
        published_at: null,
      });
      setSaved((current) => [piece, ...current]);
      toast({ title: 'Conteúdo salvo', description: 'A peça virou um rascunho na sua biblioteca.' });
    } catch (error) {
      toast({ title: 'Erro ao salvar', description: 'Não foi possível gravar a peça na biblioteca.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };
  const copy = async (text: string) => { await navigator.clipboard?.writeText(text); toast({ title: 'Copiado', description: 'Conteúdo copiado para a área de transferência.' }); };


  return <div className="studio-shell space-y-8">
    <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div><div className="eyebrow">Instagram Studio · espaço de criação</div><h1 className="studio-title">Transforme contexto em conteúdo.</h1><p className="studio-subtitle">Escolha um agente, informe o produto e receba uma peça pronta para revisão — com o contexto da sua marca preservado.</p></div>
      <div className="flex gap-3"><Button variant="outline" onClick={() => navigate('/library')}><LibraryBig className="mr-2 h-4 w-4" />Biblioteca <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">{saved.length}</span></Button><Button onClick={generate}><Sparkles className="mr-2 h-4 w-4" />Gerar peça</Button></div>
    </header>

    <div className="grid gap-6 xl:grid-cols-[330px_1fr_420px]">
      <aside className="studio-panel studio-panel-dark space-y-5">
        <div className="flex items-center gap-3"><div className="studio-icon"><Instagram className="h-5 w-5" /></div><div><p className="text-sm font-semibold">Contexto da marca</p><p className="text-xs text-muted-foreground">Reutilizado por todos os agentes</p></div></div>
        <div className="space-y-3"><label className="studio-label">Nome da marca</label><Input value={brand.name} onChange={(e) => updateBrand('name', e.target.value)} /></div>
        <div className="space-y-3"><label className="studio-label">Nicho</label><Input value={brand.niche} onChange={(e) => updateBrand('niche', e.target.value)} /></div>
        <div className="space-y-3"><label className="studio-label">Público</label><Textarea value={brand.audience} onChange={(e) => updateBrand('audience', e.target.value)} className="min-h-[72px]" /></div>
        <div className="space-y-3"><label className="studio-label">Tom de voz</label><Input value={brand.tone} onChange={(e) => updateBrand('tone', e.target.value)} /></div>
        <div className="space-y-3"><label className="studio-label">CTA principal</label><Input value={brand.primaryCta} onChange={(e) => updateBrand('primaryCta', e.target.value)} /></div>
        <div className="rounded-xl border border-border/60 bg-background/40 p-3 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="mb-2 h-4 w-4 text-emerald-400" />Fatos, hipóteses e alertas ficam separados para você revisar antes de publicar.</div>
      </aside>

      <main className="space-y-6">
        <section className="studio-panel space-y-5"><div className="flex items-center justify-between"><div><p className="studio-kicker">Produto ou serviço</p><h2 className="studio-section-title">Qual oferta vamos transformar?</h2></div><Badge variant="outline" className="border-primary/30 text-primary">Entrada simples</Badge></div>
          <div className="grid gap-4 md:grid-cols-[1fr_160px]"><div className="space-y-2"><label className="studio-label">Nome</label><Input value={product.name} onChange={(e) => updateProduct('name', e.target.value)} placeholder="Ex.: Mini ventilador portátil" /></div><div className="space-y-2"><label className="studio-label">Tipo</label><select className="studio-select" value={product.type} onChange={(e) => updateProduct('type', e.target.value as ProductContext['type'])}><option value="produto">Produto</option><option value="servico">Serviço</option><option value="afiliado">Afiliado</option></select></div></div>
          <div className="space-y-2"><label className="studio-label">Descrição e contexto</label><Textarea value={product.description} onChange={(e) => updateProduct('description', e.target.value)} placeholder="Descreva o que é, para quem serve e em que situação aparece." className="min-h-[92px]" /></div>
          <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><label className="studio-label">Fatos confirmados</label><Textarea value={product.verifiedFacts} onChange={(e) => updateProduct('verifiedFacts', e.target.value)} placeholder="Características, medidas, composição, provas..." /></div><div className="space-y-2"><label className="studio-label">Objeções do público</label><Textarea value={product.objections} onChange={(e) => updateProduct('objections', e.target.value)} placeholder="Preço, uso, tamanho, confiança..." /></div></div>
          <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => updateProduct('verifiedFacts', product.verifiedFacts ? '' : 'Preencha os fatos do produto antes de gerar claims específicos.')}>{product.verifiedFacts ? 'Limpar fatos' : 'Adicionar fatos'}</Button><Button className="md:hidden" onClick={generate}><Sparkles className="mr-2 h-4 w-4" />Gerar com agente</Button></div>
        </section>

        <section className="studio-panel"><div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p className="studio-kicker">Central de agentes</p><h2 className="studio-section-title">Escolha o tipo de resultado.</h2></div><div className="flex flex-wrap gap-2">{categories.map((category) => <button key={category} onClick={() => setFilter(category)} className={`studio-filter ${filter === category ? 'studio-filter-active' : ''}`}>{category}</button>)}</div></div><div className="grid gap-3 md:grid-cols-2">{visibleAgents.map((agent) => { const Icon = iconForAgent(agent.id); return <button key={agent.id} onClick={() => setSelectedAgent(agent)} className={`agent-option ${selectedAgent.id === agent.id ? 'agent-option-selected' : ''}`}><div className="agent-option-icon"><Icon className="h-5 w-5" /></div><div className="min-w-0 text-left"><div className="flex items-center gap-2"><p className="truncate font-semibold">{agent.name}</p>{selectedAgent.id === agent.id && <Check className="h-4 w-4 text-primary" />}</div><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{agent.description}</p><div className="mt-2 flex gap-2"><span className="text-[10px] uppercase tracking-wider text-primary">{formatLabels[agent.format]}</span><span className="text-[10px] uppercase tracking-wider text-muted-foreground">{objectiveLabels[agent.objective]}</span></div></div></button>; })}</div></section>
      </main>

      <section className="studio-panel studio-output"><div className="flex items-center justify-between"><div><p className="studio-kicker">Workspace</p><h2 className="studio-section-title">{piece ? 'Peça em revisão' : 'A resposta aparece aqui'}</h2></div><Badge className="bg-amber-400/15 text-amber-300 hover:bg-amber-400/15">{piece ? 'Em revisão' : 'Aguardando geração'}</Badge></div>{piece ? <Tabs defaultValue="script" className="mt-5"><TabsList className="grid w-full grid-cols-4 bg-muted/50"><TabsTrigger value="script">Roteiro</TabsTrigger><TabsTrigger value="caption">Copy</TabsTrigger><TabsTrigger value="visual">Visual</TabsTrigger><TabsTrigger value="audit">Auditoria</TabsTrigger></TabsList><TabsContent value="script" className="mt-5 space-y-4"><div><p className="output-label">Gancho</p><p className="output-hook">{piece.hook}</p></div><div><p className="output-label">Roteiro</p><pre className="output-pre">{piece.script}</pre></div><Button variant="outline" size="sm" onClick={() => copy(piece.script)}><Copy className="mr-2 h-4 w-4" />Copiar roteiro</Button></TabsContent><TabsContent value="caption" className="mt-5 space-y-4"><p className="output-label">Legenda sugerida</p><pre className="output-pre whitespace-pre-wrap">{piece.caption}</pre><Button variant="outline" size="sm" onClick={() => copy(piece.caption)}><Copy className="mr-2 h-4 w-4" />Copiar legenda</Button></TabsContent><TabsContent value="visual" className="mt-5 space-y-4"><p className="output-label">Prompt de mídia</p><pre className="output-pre whitespace-pre-wrap">{piece.visualPrompt}</pre><div className="output-placeholder"><Image className="h-5 w-5" />Prompt pronto para Canva, CapCut ou gerador visual</div></TabsContent><TabsContent value="audit" className="mt-5 space-y-4"><div className="space-y-3"><div className="audit-row"><ShieldCheck className="h-4 w-4 text-emerald-400" /><span>Formato compatível com Instagram: {formatLabels[piece.format]}</span></div><div className="audit-row"><Check className="h-4 w-4 text-emerald-400" /><span>CTA definido: {piece.cta}</span></div><div className="audit-row"><ShieldCheck className="h-4 w-4 text-amber-400" /><span>{piece.disclosureRequired ? 'Divulgação comercial obrigatória: revisar rótulo de parceria paga.' : 'Sem comissão indicada na ficha.'}</span></div>{piece.warnings.map((warning) => <div key={warning} className="audit-row audit-warning"><ShieldCheck className="h-4 w-4" /><span>{warning}</span></div>)}</div></TabsContent><div className="mt-6 flex gap-2"><Button onClick={savePiece} disabled={saving}><LibraryBig className="mr-2 h-4 w-4" />{saving ? 'Salvando...' : 'Salvar na biblioteca'}</Button><Button variant="outline" onClick={generate}><WandSparkles className="mr-2 h-4 w-4" />Regenerar</Button></div></Tabs> : <div className="flex min-h-[470px] flex-col items-center justify-center text-center"><div className="studio-empty-icon"><FileText className="h-7 w-7" /></div><h3 className="mt-5 font-serif text-xl">Pronto para criar?</h3><p className="mt-2 max-w-[260px] text-sm leading-relaxed text-muted-foreground">Cadastre o produto, escolha um agente e gere uma peça revisável em um clique.</p><Button className="mt-6" onClick={generate}><Plus className="mr-2 h-4 w-4" />Criar primeira peça</Button></div>}</section>
    </div>

    <footer className="flex flex-col gap-3 border-t border-border/60 pt-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between"><span><strong className="text-foreground">{brand.name}</strong> · {brand.niche}</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" />Conteúdo gerado para revisão humana antes da publicação</span></footer>
  </div>;
}
