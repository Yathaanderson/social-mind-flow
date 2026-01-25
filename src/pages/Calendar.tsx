import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarIcon className="w-6 h-6 text-primary" />
        Calendário
      </h1>
      <div className="glass-card rounded-xl p-12 text-center">
        <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">Calendário de Posts</h2>
        <p className="text-muted-foreground">Visualize e gerencie seus posts agendados em formato de calendário.</p>
      </div>
    </div>
  );
};

export default CalendarPage;
