import React, { useState } from 'react';
import { Sparkles, Loader2, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AIImageGeneratorProps {
  onImageGenerated: (url: string) => void;
}

const styles = [
  { value: 'minimalist', label: 'Minimalista', description: 'Clean e moderno' },
  { value: 'colorful', label: 'Colorido', description: 'Vibrante e chamativo' },
  { value: 'professional', label: 'Profissional', description: 'Corporativo e formal' },
  { value: 'artistic', label: 'Artístico', description: 'Criativo e abstrato' },
];

export const AIImageGenerator: React.FC<AIImageGeneratorProps> = ({ onImageGenerated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({ title: 'Erro', description: 'Digite uma descrição para a imagem', variant: 'destructive' });
      return;
    }

    setGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-post-image', {
        body: { prompt: prompt.trim(), style: style || undefined }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        toast({ title: 'Erro', description: data.error, variant: 'destructive' });
        return;
      }

      if (data.imageBase64) {
        setGeneratedImage(data.imageBase64);
        toast({ title: 'Sucesso', description: 'Imagem gerada com sucesso!' });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({ 
        title: 'Erro', 
        description: 'Não foi possível gerar a imagem. Tente novamente.', 
        variant: 'destructive' 
      });
    } finally {
      setGenerating(false);
    }
  };

  const useGeneratedImage = async () => {
    if (!generatedImage || !user) return;

    setUploading(true);

    try {
      // Convert base64 to blob
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      
      // Create file from blob
      const fileName = `ai-${Date.now()}.png`;
      const filePath = `${user.id}/${fileName}`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      onImageGenerated(publicUrl);
      toast({ title: 'Sucesso', description: 'Imagem adicionada ao post!' });
      
      // Reset state
      setGeneratedImage(null);
      setPrompt('');
      setStyle('');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({ 
        title: 'Erro', 
        description: 'Não foi possível salvar a imagem. Tente novamente.', 
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
    }
  };

  const regenerateImage = () => {
    setGeneratedImage(null);
    generateImage();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Textarea
          placeholder="Descreva a imagem que deseja gerar... Ex: Uma paisagem de montanhas ao pôr do sol com cores vibrantes"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px] bg-muted/50 resize-none"
          disabled={generating || uploading}
        />

        <Select value={style} onValueChange={setStyle} disabled={generating || uploading}>
          <SelectTrigger className="bg-muted/50">
            <SelectValue placeholder="Estilo visual (opcional)" />
          </SelectTrigger>
          <SelectContent>
            {styles.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                <span className="font-medium">{s.label}</span>
                <span className="text-muted-foreground ml-2">- {s.description}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!generatedImage && (
          <Button 
            onClick={generateImage} 
            disabled={generating || !prompt.trim()}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Gerando imagem...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Imagem com IA
              </>
            )}
          </Button>
        )}
      </div>

      {generatedImage && (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img 
              src={generatedImage} 
              alt="Imagem gerada por IA" 
              className="w-full h-48 object-cover"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={useGeneratedImage} 
              disabled={uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Usar esta imagem
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={regenerateImage}
              disabled={generating || uploading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Gerar outra
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Powered by Lovable AI • As imagens são geradas usando inteligência artificial
      </p>
    </div>
  );
};
