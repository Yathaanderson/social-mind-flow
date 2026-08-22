import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, LogOut, User, KeyRound } from 'lucide-react';
import { getProfile, upsertProfile } from '@/integrations/firebase/firestore';

interface Profile {
  full_name: string;
  email: string;
  avatar_url: string | null;
}

export const AccountTab: React.FC = () => {
  const { user, signOut, changePassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    email: '',
    avatar_url: null,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const data = await getProfile(user?.uid || '');
      if (data) {
        setProfile({
          full_name: data.full_name ?? '',
          email: data.email ?? user?.email ?? '',
          avatar_url: data.avatar_url,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao carregar perfil',
        description: 'Não foi possível carregar suas informações.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await upsertProfile(user?.uid || '', {
        full_name: profile.full_name,
        avatar_url: profile.avatar_url || undefined,
        email: profile.email || undefined,
      });

      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram salvas com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível atualizar seu perfil.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A nova senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Senhas diferentes',
        description: 'A confirmação não confere com a nova senha.',
        variant: 'destructive',
      });
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast({
        title: 'Senha atualizada',
        description: 'Sua senha foi alterada com sucesso.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const code = (error as { code?: string })?.code || '';
      let description = 'Não foi possível alterar sua senha.';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        description = 'A senha atual informada está incorreta.';
      } else if (code === 'auth/weak-password') {
        description = 'A nova senha é muito fraca. Use pelo menos 6 caracteres.';
      } else if (code === 'auth/too-many-requests') {
        description = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
      }
      toast({ title: 'Erro ao alterar senha', description, variant: 'destructive' });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const userInitials = profile.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'US';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Informações da Conta</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Gerencie suas informações pessoais.
        </p>
      </div>

      <div className="flex items-center gap-4 p-4 glass-card rounded-lg">
        <Avatar className="h-20 w-20 ring-2 ring-primary/20">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/20 text-primary text-xl">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-lg">{profile.full_name || 'Usuário'}</h4>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Nome completo</Label>
          <Input
            id="full_name"
            value={profile.full_name}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, full_name: e.target.value }))
            }
            placeholder="Seu nome completo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar_url">URL do Avatar</Label>
          <Input
            id="avatar_url"
            value={profile.avatar_url || ''}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, avatar_url: e.target.value }))
            }
            placeholder="https://exemplo.com/avatar.jpg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={profile.email}
            disabled
            className="opacity-50"
          />
          <p className="text-xs text-muted-foreground">
            O email não pode ser alterado.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <User className="mr-2 h-4 w-4" />
          Salvar alterações
        </Button>
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair da conta
        </Button>
      </div>

      <div className="border-t border-muted pt-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Alterar senha</h3>
          <p className="text-sm text-muted-foreground">
            Confirme sua senha atual para definir uma nova senha de acesso.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="current_password">Senha atual</Label>
          <Input
            id="current_password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new_password">Nova senha</Label>
          <Input
            id="new_password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password">Confirmar nova senha</Label>
          <Input
            id="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a nova senha"
          />
        </div>

        <Button
          onClick={handleChangePassword}
          disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
        >
          {changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <KeyRound className="mr-2 h-4 w-4" />
          Atualizar senha
        </Button>
      </div>
    </div>
  );
};
