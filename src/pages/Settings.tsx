import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-primary" />
        Configurações
      </h1>
      <div className="glass-card rounded-xl p-12 text-center">
        <SettingsIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">Configurações</h2>
        <p className="text-muted-foreground">Gerencie suas redes sociais conectadas, preferências e conta.</p>
      </div>
    </div>
  );
};

export default Settings;
