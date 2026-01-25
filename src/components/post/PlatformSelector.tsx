import React from 'react';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { Platform } from '@/types';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
}

const platforms: { id: Platform; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'text-pink-400' },
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, color: 'text-blue-500' },
  { id: 'twitter', label: 'Twitter', icon: <Twitter className="w-5 h-5" />, color: 'text-sky-400' },
  { 
    id: 'tiktok', 
    label: 'TikTok', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ), 
    color: 'text-foreground' 
  },
];

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selected, onChange }) => {
  const handleToggle = (platformId: Platform) => {
    if (selected.includes(platformId)) {
      onChange(selected.filter(p => p !== platformId));
    } else {
      onChange([...selected, platformId]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Selecionar Redes Sociais</label>
      <div className="grid grid-cols-2 gap-3">
        {platforms.map((platform) => (
          <label
            key={platform.id}
            className={cn(
              "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200",
              selected.includes(platform.id)
                ? "border-primary bg-primary/10"
                : "border-border hover:border-border/80 hover:bg-muted/50"
            )}
          >
            <Checkbox
              checked={selected.includes(platform.id)}
              onCheckedChange={() => handleToggle(platform.id)}
            />
            <span className={platform.color}>{platform.icon}</span>
            <span className="text-sm font-medium">{platform.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
