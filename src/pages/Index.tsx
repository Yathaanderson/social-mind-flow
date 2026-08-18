import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Library, Image as ImageIcon, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Sparkles,
    title: 'Legendas geradas por IA',
    description:
      'Descreva o tema e receba variações de texto prontas para publicar, no tom da sua marca.',
  },
  {
    icon: ImageIcon,
    title: 'Imagens sob medida',
    description:
      'Crie artes quadradas para o feed a partir de uma descrição, sem precisar de banco de imagens.',
  },
  {
    icon: Calendar,
    title: 'Agenda visual',
    description:
      'Programe publicações em um calendário mensal e reorganize a rotina arrastando os cards.',
  },
  {
    icon: Library,
    title: 'Biblioteca organizada',
    description:
      'Todo conteúdo criado fica salvo, filtrável por status e pronto para ser reaproveitado.',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Smartphone className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold gradient-text">Instagram Studio</span>
          </div>
          <Button asChild variant="outline">
            <Link to="/auth">Entrar</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Crie, agende e organize seus posts de Instagram com{' '}
            <span className="gradient-text">inteligência artificial</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            O Instagram Studio gera legendas e imagens com IA, monta seu calendário de publicações e
            guarda tudo em uma biblioteca única — do briefing ao post pronto.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/auth">Começar gratuitamente</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">Acessar o painel</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            Tudo o que você precisa para manter o feed ativo
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article key={feature.title} className="glass-card rounded-xl p-6">
                <feature.icon className="mb-4 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-24 text-center">
          <h2 className="text-2xl font-semibold">Comece a produzir hoje</h2>
          <p className="mt-4 text-muted-foreground">
            Crie sua conta em segundos e publique a primeira peça ainda hoje.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link to="/auth">Criar minha conta</Link>
          </Button>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        Instagram Studio — Social Mind Flow
      </footer>
    </div>
  );
};

export default Index;
