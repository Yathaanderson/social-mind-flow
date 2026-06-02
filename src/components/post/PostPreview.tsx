import React from 'react';
import { Platform } from '@/types';

interface PostPreviewProps {
  content: string;
  imageUrl?: string | null;
  selectedPlatforms: Platform[];
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  content,
  imageUrl,
}) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Preview do Instagram</h3>

      <div className="bg-black rounded-lg overflow-hidden max-w-sm mx-auto">
        <div className="p-3 flex items-center gap-3 border-b border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500" />
          <span className="text-sm font-medium">Seu Perfil</span>
        </div>
        {imageUrl ? (
          <img src={imageUrl} alt="Preview" className="w-full aspect-square object-cover" />
        ) : (
          <div className="w-full aspect-square bg-zinc-900 flex items-center justify-center text-muted-foreground">
            Adicione uma imagem
          </div>
        )}
        <div className="p-3">
          <p className="text-sm whitespace-pre-wrap">{content || 'Seu texto aparecerá aqui...'}</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        {content.length} / 2200 caracteres
      </div>
    </div>
  );
};
