import React from 'react';
import { Library as LibraryIcon } from 'lucide-react';

const Library: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <LibraryIcon className="w-6 h-6 text-primary" />
        Biblioteca
      </h1>
      <div className="glass-card rounded-xl p-12 text-center">
        <LibraryIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">Biblioteca de Posts</h2>
        <p className="text-muted-foreground">Pesquise, filtre e gerencie todos os seus posts em um só lugar.</p>
      </div>
    </div>
  );
};

export default Library;
