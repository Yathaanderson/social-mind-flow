import React from 'react';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CalendarFiltersProps {
  filters: Record<string, boolean>;
  onFilterChange: (platform: string, checked: boolean) => void;
  onToday: () => void;
}

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
  { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-sky-500' },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: () => (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    color: 'text-zinc-300',
  },
];

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filters,
  onFilterChange,
  onToday,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {platforms.map((platform) => (
        <div key={platform.id} className="flex items-center gap-2">
          <Checkbox
            id={platform.id}
            checked={filters[platform.id] ?? true}
            onCheckedChange={(checked) => onFilterChange(platform.id, checked as boolean)}
          />
          <Label
            htmlFor={platform.id}
            className={`flex items-center gap-1 cursor-pointer ${platform.color}`}
          >
            <platform.icon className="h-4 w-4" />
            {platform.label}
          </Label>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onToday}>
        Hoje
      </Button>
    </div>
  );
};
