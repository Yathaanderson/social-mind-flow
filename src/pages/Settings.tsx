import React from 'react';
import { Settings as SettingsIcon, Instagram } from 'lucide-react';
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
        <Tabs defaultValue="instagram" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="instagram" className="flex items-center gap-1.5">
              <Instagram className="w-4 h-4 text-pink-500" />
              Instagram
            </TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
          </TabsList>

          <TabsContent value="instagram">
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
