import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { ToneType } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { generatePostIdeas } from '@/lib/openai';
import { useToast } from '@/hooks/use-toast';

interface AIGeneratorProps {
  onSelectIdea: (idea: string) => void;
}

const tones: { value: ToneType; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Descontraído' },
  { value: 'sales', label: 'Vendedor' },
  { value: 'inspirational', label: 'Inspirador' },
];

export const AIGenerator: React.FC<AIGeneratorProps> = ({ onSelectIdea }) => {
  const [theme, setTheme] = useState('');
  const [tone, setTone] = useState<ToneType>('casual');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateIdeas = async () => {
    if (!theme.trim()) {
      toast({
        title: 'Tema necessário',
        description: 'Digite um tema para gerar ideias',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const ideas = await generatePostIdeas(theme, tone);
      setIdeas(ideas);
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast({
        title: 'Erro ao gerar ideias',
        description: error instanceof Error ? error.message : 'Tente novamente',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-secondary" />
        Gerar com IA
      </label>
      
      <div className="space-y-3">
        <Input
          placeholder="Digite o tema do post (ex: Marketing Digital, Dicas de Produtividade)"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-muted/50 border-border"
        />
        
        <div className="flex gap-3">
          <Select value={tone} onValueChange={(v) => setTone(v as ToneType)}>
            <SelectTrigger className="w-[180px] bg-muted/50">
              <SelectValue placeholder="Tom de voz" />
            </SelectTrigger>
            <SelectContent>
              {tones.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={generateIdeas} 
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Ideias
              </>
            )}
          </Button>
        </div>
      </div>

      {ideas.length > 0 && (
        <div className="space-y-3 mt-4">
          <p className="text-sm text-muted-foreground">Escolha uma ideia:</p>
          {ideas.map((idea, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <p className="text-sm mb-3 whitespace-pre-wrap">{idea}</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onSelectIdea(idea)}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Usar esta
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
