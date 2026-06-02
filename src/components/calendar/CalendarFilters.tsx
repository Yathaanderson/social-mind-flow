import React from 'react';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarFiltersProps {
  onToday: () => void;
}

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  onToday,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 text-pink-400">
        <Instagram className="h-4 w-4" />
        <span className="text-sm font-medium">Instagram</span>
      </div>
      <Button variant="outline" size="sm" onClick={onToday}>
        Hoje
      </Button>
    </div>
  );
};
