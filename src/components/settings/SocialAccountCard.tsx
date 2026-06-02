import React from 'react';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SocialAccount {
  id: string;
  platform: string;
  username: string | null;
  is_connected: boolean;
}

interface SocialAccountCardProps {
  account: SocialAccount;
  onToggleConnection: (account: SocialAccount) => void;
  loading: boolean;
}

export const SocialAccountCard: React.FC<SocialAccountCardProps> = ({
  account,
  onToggleConnection,
  loading,
}) => {
  return (
    <div className="glass-card rounded-xl p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-pink-500">
          <Instagram className="h-8 w-8" />
        </div>
        <div>
          <h3 className="font-semibold">Instagram</h3>
          {account.is_connected && account.username ? (
            <p className="text-sm text-muted-foreground">@{account.username}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Não conectado</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge
          variant={account.is_connected ? 'default' : 'secondary'}
          className={account.is_connected ? 'bg-green-500/20 text-green-400' : ''}
        >
          {account.is_connected ? 'Conectado' : 'Desconectado'}
        </Badge>
        <Button
          variant={account.is_connected ? 'destructive' : 'default'}
          size="sm"
          onClick={() => onToggleConnection(account)}
          disabled={loading}
        >
          {account.is_connected ? 'Desconectar' : 'Conectar'}
        </Button>
      </div>
    </div>
  );
};
