import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Instagram, ShieldCheck, Unplug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getSocialAccount,
  updateSocialAccount,
} from '@/integrations/firebase/firestore';

interface SocialAccount {
  id: string;
  platform: string;
  username: string | null;
  is_connected: boolean;
  access_token: string | null;
  ig_user_id: string | null;
}

export const SocialAccountsTab: React.FC = () => {
  const { user } = useAuth();
  const [account, setAccount] = useState<SocialAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAccount();
    }
  }, [user]);

  const fetchAccount = async () => {
    try {
      const result = await getSocialAccount(user?.uid || '', 'instagram');
      if (result.data) {
        setAccount({
          id: result.data.id,
          platform: result.data.platform,
          username: result.data.username,
          is_connected: result.data.is_connected,
          access_token: result.data.access_token || null,
          ig_user_id: result.data.ig_user_id || null,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao carregar conta',
        description: 'Não foi possível carregar sua conta do Instagram.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!account) return;
    setDisconnecting(true);

    try {
      await updateSocialAccount(account.id, {
        is_connected: false,
        username: null,
        access_token: null,
        ig_user_id: null,
      });

      setAccount({ ...account, is_connected: false, username: null, access_token: null, ig_user_id: null });

      toast({
        title: 'Instagram desconectado',
        description: 'Sua conta do Instagram foi desconectada.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao desconectar',
        description: 'Não foi possível desconectar o Instagram.',
        variant: 'destructive',
      });
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Instagram className="w-5 h-5 text-pink-500" />
          Instagram
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Crie, revise, organize e agende seu conteúdo mesmo sem conectar uma conta.
        </p>
      </div>

      {account?.is_connected ? (
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  {account.username ? `@${account.username}` : 'Instagram'}
                   <Badge variant="secondary">Conta registrada</Badge>
                </h4>
                 <p className="text-sm text-muted-foreground">A publicação automática ainda não está disponível.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDisconnect}
              disabled={disconnecting}
            >
              <Unplug className="w-4 h-4 mr-2" />
              {disconnecting ? 'Desconectando...' : 'Desconectar Instagram'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Instagram className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                Instagram
                 <Badge variant="secondary">Em preparação</Badge>
              </h4>
               <p className="text-sm text-muted-foreground">A conexão e a publicação automática serão habilitadas em uma etapa futura.</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />Sem conexão, você pode gerar peças, salvar rascunhos, editar conteúdos e organizar o calendário.</p>
            <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-warning" />Para conectar no futuro, será necessária uma conta profissional do Instagram vinculada a uma Página do Facebook.</p>
            <div className="border-t border-border pt-3">
              <p className="font-medium text-foreground">Permissões necessárias na etapa de conexão</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Ver a conta profissional e as Páginas vinculadas.</li>
                <li>Criar e publicar conteúdo com sua autorização.</li>
                <li>Manter a conexão protegida enquanto estiver ativa.</li>
            </ul>
            </div>
            <p className="border-t border-border pt-3">No momento, o sistema está em modo de preparação. Nenhum conteúdo será publicado automaticamente.</p>
            <p><strong className="text-foreground">Próximo passo:</strong> concluir primeiro as melhorias de uso e segurança. Depois, a conexão será ativada e testada com você.</p>
          </div>
        </div>
      )}
    </div>
  );
};
