import React from 'react';
import { Instagram } from 'lucide-react';
import { Platform } from '@/types';
import { cn } from '@/lib/utils';

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selected, onChange }) => {
  const isSelected = selected.includes('instagram');

  const handleToggle = () => {
    if (isSelected) {
      onChange([]);
    } else {
      onChange(['instagram']);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Rede Social</label>
      <label
        className={cn(
          "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200",
          isSelected
            ? "border-primary bg-primary/10"
            : "border-border hover:border-border/80 hover:bg-muted/50"
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <Instagram className="w-5 h-5 text-pink-400" />
        </div>
        <div>
          <span className="text-sm font-medium">Instagram</span>
          <p className="text-xs text-muted-foreground">Feed e Stories</p>
        </div>
      </label>
    </div>
  );
};
