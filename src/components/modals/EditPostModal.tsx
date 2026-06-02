import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Post, Platform, PostStatus } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { PlatformSelector } from '@/components/post/PlatformSelector';
import { ImageUpload } from '@/components/post/ImageUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updatePost } from '@/integrations/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface EditPostModalProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  post,
  open,
  onOpenChange,
  onSaved
}) => {
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<PostStatus>('rascunho');
  const [scheduledFor, setScheduledFor] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (post) {
      setContent(post.content);
      setPlatforms(post.platforms);
      setImageUrl(post.image_url);
      setStatus(post.status);
      setScheduledFor(post.scheduled_for ? format(new Date(post.scheduled_for), "yyyy-MM-dd'T'HH:mm") : '');
    }
  }, [post]);

  const handleSave = async () => {
    if (!post) return;

    if (!content.trim()) {
      toast({
        title: 'Erro',
        description: 'O conteúdo não pode estar vazio',
        variant: 'destructive'
      });
      return;
    }

    if (platforms.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione pelo menos uma rede social',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const updateData: Record<string, unknown> = {
        content,
        platforms,
        image_url: imageUrl,
        status,
        scheduled_for: status === 'agendado' && scheduledFor ? new Date(scheduledFor).toISOString() : null,
        published_at: status === 'publicado' ? new Date().toISOString() : post.published_at,
      };

      await updatePost(post.id, updateData);

      toast({
        title: 'Sucesso',
        description: 'Post atualizado com sucesso!'
      });

      onSaved();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o post',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle>Editar Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Conteúdo</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva seu post aqui..."
              className="min-h-[150px] bg-muted/50 border-border resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length} / 2200 caracteres
            </p>
          </div>

          <PlatformSelector selected={platforms} onChange={setPlatforms} />

          <ImageUpload imageUrl={imageUrl} onImageChange={setImageUrl} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={(v) => setStatus(v as PostStatus)}>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="publicado">Publicado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {status === 'agendado' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Agendar para</label>
                <Input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="bg-muted/50 border-border"
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
