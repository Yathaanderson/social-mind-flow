import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Instagram, ExternalLink, Unplug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getSocialAccount,
  createSocialAccount,
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
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || '';

  useEffect(() => {
    if (user) {
      fetchAccount();
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state === 'instagram_connect' && user) {
      handleOAuthCallback(code);
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

  const handleConnect = () => {
    if (!FACEBOOK_APP_ID) {
      toast({
        title: 'Configuração pendente',
        description: 'O App do Facebook ainda não foi configurado. Configure o VITE_FACEBOOK_APP_ID no .env',
        variant: 'destructive',
      });
      return;
    }

    setConnecting(true);

    const redirectUri = `${window.location.origin}/settings`;
    const scopes = 'instagram_basic,instagram_content_publish,pages_show_list';
    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=instagram_connect&response_type=code`;

    window.location.href = authUrl;
  };

  const handleOAuthCallback = async (code: string) => {
    setConnecting(true);

    try {
      // Nota: a edge function do Supabase foi removida na migração para Firebase.
      // Para OAuth com Instagram, considere usar Firebase Cloud Functions
      // ou um backend próprio para trocar o code pelo access_token.
      // Por enquanto, exibimos erro.
      throw new Error('OAuth callback precisa ser reimplementado com Firebase Cloud Functions ou backend próprio.');

    } catch (error) {
      toast({
        title: 'Erro ao conectar',
        description: error instanceof Error ? error.message : 'Não foi possível conectar o Instagram.',
        variant: 'destructive',
      });
    } finally {
      setConnecting(false);
      window.history.replaceState({}, document.title, window.location.pathname);
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

  const createInstagramAccount = async () => {
    if (!user) return;
    setConnecting(true);
    try {
      const newId = await createSocialAccount({
        user_id: user.uid,
        platform: 'instagram',
      });
      setAccount({
        id: newId,
        platform: 'instagram',
        username: null,
        is_connected: false,
        access_token: null,
        ig_user_id: null,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a conta do Instagram.',
        variant: 'destructive',
      });
    } finally {
      setConnecting(false);
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
          Conecte sua conta comercial do Instagram para publicar posts automaticamente.
        </p>
      </div>

      {!account ? (
        <div className="text-center py-8 glass-card rounded-xl">
          <Instagram className="w-12 h-12 mx-auto mb-4 text-pink-500/50" />
          <p className="text-muted-foreground mb-4">Nenhuma conta do Instagram cadastrada.</p>
          <Button onClick={createInstagramAccount} disabled={connecting}>
            <Instagram className="w-4 h-4 mr-2" />
            Adicionar Instagram
          </Button>
        </div>
      ) : account.is_connected ? (
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  {account.username ? `@${account.username}` : 'Instagram'}
                  <Badge className="bg-green-500/20 text-green-400">Conectado</Badge>
                </h4>
                <p className="text-sm text-muted-foreground">Pronto para publicar</p>
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
                <Badge variant="secondary">Desconectado</Badge>
              </h4>
              <p className="text-sm text-muted-foreground">Conecte para publicar posts</p>
            </div>
          </div>

          <Button
            onClick={handleConnect}
            disabled={connecting || !FACEBOOK_APP_ID}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
          >
            {connecting ? (
              'Conectando...'
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Conectar Instagram
              </>
            )}
          </Button>

          {!FACEBOOK_APP_ID && (
            <p className="text-xs text-muted-foreground text-center">
              Configure VITE_FACEBOOK_APP_ID no arquivo .env para habilitar a conexão.
            </p>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Para conectar, você precisa:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Uma conta comercial do Instagram</li>
              <li>Um Facebook Page vinculado ao Instagram</li>
              <li>Um App do Facebook com permissão de publicação</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
