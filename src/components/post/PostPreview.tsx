import React, { useState } from 'react';
import { Instagram, Linkedin, Twitter, AlertCircle } from 'lucide-react';
import { Platform } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface PostPreviewProps {
  content: string;
  imageUrl?: string | null;
  selectedPlatforms: Platform[];
}

const platformLimits: Record<Platform, number> = {
  instagram: 2200,
  linkedin: 3000,
  twitter: 280,
  tiktok: 2200
};

export const PostPreview: React.FC<PostPreviewProps> = ({ 
  content, 
  imageUrl, 
  selectedPlatforms 
}) => {
  const [activeTab, setActiveTab] = useState<Platform>(selectedPlatforms[0] || 'instagram');

  const renderInstagramPreview = () => (
    <div className="bg-black rounded-lg overflow-hidden">
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
  );

  const renderLinkedInPreview = () => (
    <div className="bg-white text-black rounded-lg overflow-hidden">
      <div className="p-4 flex items-center gap-3 border-b border-gray-200">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800" />
        <div>
          <p className="font-semibold text-sm">Seu Nome</p>
          <p className="text-xs text-gray-500">Sua função • 1h</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm whitespace-pre-wrap text-gray-800">{content || 'Seu texto aparecerá aqui...'}</p>
      </div>
      {imageUrl && (
        <img src={imageUrl} alt="Preview" className="w-full object-cover" />
      )}
    </div>
  );

  const renderTwitterPreview = () => {
    const isOverLimit = content.length > 280;
    return (
      <div className="bg-black rounded-lg overflow-hidden">
        <div className="p-4 flex gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Você</span>
              <span className="text-gray-500 text-sm">@seuuser · agora</span>
            </div>
            <p className={cn(
              "text-sm mt-2 whitespace-pre-wrap",
              isOverLimit && "text-destructive"
            )}>
              {content || 'Seu texto aparecerá aqui...'}
            </p>
            {isOverLimit && (
              <div className="flex items-center gap-2 mt-2 text-destructive text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>Excede o limite de 280 caracteres ({content.length}/280)</span>
              </div>
            )}
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="w-full rounded-xl mt-3 object-cover" />
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTikTokPreview = () => (
    <div className="bg-black rounded-lg overflow-hidden aspect-[9/16] max-h-[400px] relative">
      {imageUrl ? (
        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">Adicione um vídeo ou imagem</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-sm font-medium">@seuuser</p>
        <p className="text-sm mt-1 whitespace-pre-wrap">{content.slice(0, 100) || 'Seu texto...'}</p>
      </div>
    </div>
  );

  const tabIcons: Record<Platform, React.ReactNode> = {
    instagram: <Instagram className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    tiktok: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    )
  };

  if (selectedPlatforms.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Selecione uma rede social para ver o preview
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Preview</h3>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Platform)}>
        <TabsList className="w-full justify-start bg-muted/50">
          {selectedPlatforms.map((platform) => (
            <TabsTrigger 
              key={platform} 
              value={platform}
              className="capitalize flex items-center gap-2"
            >
              {tabIcons[platform]}
              {platform}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-4">
          <TabsContent value="instagram">{renderInstagramPreview()}</TabsContent>
          <TabsContent value="linkedin">{renderLinkedInPreview()}</TabsContent>
          <TabsContent value="twitter">{renderTwitterPreview()}</TabsContent>
          <TabsContent value="tiktok">{renderTikTokPreview()}</TabsContent>
        </div>
      </Tabs>
      <div className="mt-4 text-xs text-muted-foreground">
        {content.length} / {platformLimits[activeTab]} caracteres
      </div>
    </div>
  );
};
