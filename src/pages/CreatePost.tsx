import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Calendar, Rocket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Platform } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PlatformSelector } from '@/components/post/PlatformSelector';
import { PostPreview } from '@/components/post/PostPreview';
import { AIGenerator } from '@/components/post/AIGenerator';
import { ImageUpload } from '@/components/post/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scheduledFor, setScheduledFor] = useState('');
  const [publishNow, setPublishNow] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (content.length < 10) { toast({ title: 'Conteúdo muito curto', description: 'Escreva pelo menos 10 caracteres', variant: 'destructive' }); return false; }
    if (platforms.length === 0) { toast({ title: 'Selecione uma rede', description: 'Escolha pelo menos uma rede social', variant: 'destructive' }); return false; }
    if (!publishNow && scheduledFor && new Date(scheduledFor) < new Date()) { toast({ title: 'Data inválida', description: 'Não é possível agendar para o passado', variant: 'destructive' }); return false; }
    return true;
  };

  const savePost = async (status: 'rascunho' | 'agendado' | 'publicado') => {
    if (!validate() || !user) return;
    setLoading(true);
    try {
      const postData = { user_id: user.id, content, platforms, image_url: imageUrl, status, scheduled_for: status === 'agendado' && scheduledFor ? new Date(scheduledFor).toISOString() : null, published_at: status === 'publicado' ? new Date().toISOString() : null };
      const { error } = await supabase.from('posts').insert(postData);
      if (error) throw error;
      toast({ title: 'Sucesso!', description: status === 'rascunho' ? 'Rascunho salvo' : status === 'agendado' ? 'Post agendado' : 'Post publicado' });
      navigate('/dashboard');
    } catch (error) { toast({ title: 'Erro', description: 'Não foi possível salvar', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Criar Novo Post</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Conteúdo do Post</label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escreva seu post aqui..." className="min-h-[200px] bg-muted/50 border-border resize-none" maxLength={2200} />
              <p className="text-xs text-muted-foreground text-right">{content.length} / 2200</p>
            </div>
            <PlatformSelector selected={platforms} onChange={setPlatforms} />
            <ImageUpload imageUrl={imageUrl} onImageChange={setImageUrl} />
          </div>
          <div className="glass-card rounded-xl p-6">
            <AIGenerator onSelectIdea={(idea) => setContent(idea)} />
          </div>
          <div className="glass-card rounded-xl p-6 space-y-4">
            <label className="text-sm font-medium">Agendamento</label>
            <div className="flex items-center gap-3">
              <Checkbox id="publishNow" checked={publishNow} onCheckedChange={(c) => setPublishNow(!!c)} />
              <label htmlFor="publishNow" className="text-sm">Publicar agora</label>
            </div>
            {!publishNow && <Input type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} className="bg-muted/50" />}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => savePost('rascunho')} disabled={loading}><Save className="w-4 h-4 mr-2" />Salvar Rascunho</Button>
              {!publishNow && <Button onClick={() => savePost('agendado')} disabled={loading} className="bg-primary"><Calendar className="w-4 h-4 mr-2" />Agendar</Button>}
              {publishNow && <Button onClick={() => savePost('publicado')} disabled={loading} className="bg-success hover:bg-success/90"><Rocket className="w-4 h-4 mr-2" />Publicar</Button>}
              {loading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
            </div>
          </div>
        </div>
        <PostPreview content={content} imageUrl={imageUrl} selectedPlatforms={platforms} />
      </div>
    </div>
  );
};

export default CreatePost;
