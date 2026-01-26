import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface UserSettings {
  notification_enabled: boolean;
  comment_notification_enabled: boolean;
  best_posting_time: string;
  notification_email: string;
}

const postingTimes = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

export const PreferencesTab: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    notification_enabled: true,
    comment_notification_enabled: true,
    best_posting_time: '10:00',
    notification_email: '',
  });

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          notification_enabled: data.notification_enabled ?? true,
          comment_notification_enabled: data.comment_notification_enabled ?? true,
          best_posting_time: data.best_posting_time ?? '10:00',
          notification_email: data.notification_email ?? user?.email ?? '',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao carregar configurações',
        description: 'Não foi possível carregar suas preferências.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({
          notification_enabled: settings.notification_enabled,
          comment_notification_enabled: settings.comment_notification_enabled,
          best_posting_time: settings.best_posting_time,
          notification_email: settings.notification_email,
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: 'Preferências salvas',
        description: 'Suas configurações foram atualizadas com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar suas preferências.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Preferências de Notificação</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure como deseja receber notificações.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 glass-card rounded-lg">
          <div>
            <Label htmlFor="notification_enabled" className="font-medium">
              Notificar quando post for publicado
            </Label>
            <p className="text-sm text-muted-foreground">
              Receba uma notificação quando seu post agendado for publicado.
            </p>
          </div>
          <Switch
            id="notification_enabled"
            checked={settings.notification_enabled}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, notification_enabled: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 glass-card rounded-lg">
          <div>
            <Label htmlFor="comment_notification" className="font-medium">
              Notificar comentários
            </Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações quando seus posts receberem comentários.
            </p>
          </div>
          <Switch
            id="comment_notification"
            checked={settings.comment_notification_enabled}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, comment_notification_enabled: checked }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="best_time">Melhor horário para postar</Label>
          <Select
            value={settings.best_posting_time}
            onValueChange={(value) =>
              setSettings((prev) => ({ ...prev, best_posting_time: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um horário" />
            </SelectTrigger>
            <SelectContent>
              {postingTimes.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notification_email">Email para notificações</Label>
          <Input
            id="notification_email"
            type="email"
            value={settings.notification_email}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, notification_email: e.target.value }))
            }
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Salvar preferências
      </Button>
    </div>
  );
};
