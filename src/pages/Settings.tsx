import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialAccountsTab } from '@/components/settings/SocialAccountsTab';
import { PreferencesTab } from '@/components/settings/PreferencesTab';
import { AccountTab } from '@/components/settings/AccountTab';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-primary" />
        Configurações
      </h1>

      <div className="glass-card rounded-xl p-6">
        <Tabs defaultValue="social" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
          </TabsList>

          <TabsContent value="social">
            <SocialAccountsTab />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesTab />
          </TabsContent>

          <TabsContent value="account">
            <AccountTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
