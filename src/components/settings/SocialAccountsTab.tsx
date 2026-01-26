import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { SocialAccountCard } from './SocialAccountCard';
import { Skeleton } from '@/components/ui/skeleton';

interface SocialAccount {
  id: string;
  platform: string;
  username: string | null;
  is_connected: boolean;
}

export const SocialAccountsTab: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', user?.id)
        .order('platform');

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      toast({
        title: 'Erro ao carregar contas',
        description: 'Não foi possível carregar suas redes sociais.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleConnection = async (account: SocialAccount) => {
    setUpdating(account.id);
    try {
      const newStatus = !account.is_connected;
      const newUsername = newStatus ? `user_${account.platform}` : null;

      const { error } = await supabase
        .from('social_accounts')
        .update({
          is_connected: newStatus,
          username: newUsername,
        })
        .eq('id', account.id);

      if (error) throw error;

      setAccounts((prev) =>
        prev.map((a) =>
          a.id === account.id
            ? { ...a, is_connected: newStatus, username: newUsername }
            : a
        )
      );

      toast({
        title: newStatus ? 'Conta conectada' : 'Conta desconectada',
        description: `${account.platform} foi ${newStatus ? 'conectado' : 'desconectado'} com sucesso.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o status da conta.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Redes Sociais Conectadas</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Gerencie suas contas de redes sociais conectadas.
        </p>
      </div>
      {accounts.map((account) => (
        <SocialAccountCard
          key={account.id}
          account={account}
          onToggleConnection={handleToggleConnection}
          loading={updating === account.id}
        />
      ))}
      {accounts.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Nenhuma rede social cadastrada.
        </p>
      )}
    </div>
  );
};
