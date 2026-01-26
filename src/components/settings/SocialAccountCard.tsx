import React from 'react';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
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

const platformConfig: Record<string, { icon: React.ReactNode; name: string; color: string }> = {
  instagram: {
    icon: <Instagram className="h-8 w-8" />,
    name: 'Instagram',
    color: 'text-pink-500',
  },
  linkedin: {
    icon: <Linkedin className="h-8 w-8" />,
    name: 'LinkedIn',
    color: 'text-blue-600',
  },
  twitter: {
    icon: <Twitter className="h-8 w-8" />,
    name: 'Twitter',
    color: 'text-sky-500',
  },
  tiktok: {
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    name: 'TikTok',
    color: 'text-zinc-300',
  },
};

export const SocialAccountCard: React.FC<SocialAccountCardProps> = ({
  account,
  onToggleConnection,
  loading,
}) => {
  const config = platformConfig[account.platform] || {
    icon: null,
    name: account.platform,
    color: 'text-muted-foreground',
  };

  return (
    <div className="glass-card rounded-xl p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={config.color}>{config.icon}</div>
        <div>
          <h3 className="font-semibold">{config.name}</h3>
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
