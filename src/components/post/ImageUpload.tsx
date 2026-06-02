import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Link as LinkIcon, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { AIImageGenerator } from './AIImageGenerator';
import { uploadImage } from '@/integrations/firebase/storage';

interface ImageUploadProps {
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, onImageChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleUploadFile = async (file: File) => {
    if (!user) {
      toast({ title: 'Erro', description: 'Você precisa estar logado', variant: 'destructive' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Erro', description: 'Apenas imagens são permitidas', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Erro', description: 'Imagem deve ter no máximo 5MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const downloadUrl = await uploadImage(user.uid, file);
      onImageChange(downloadUrl);
      toast({ title: 'Sucesso', description: 'Imagem enviada com sucesso!' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Erro', description: 'Não foi possível enviar a imagem', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const removeImage = () => {
    onImageChange(null);
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim());
      toast({ title: 'Sucesso', description: 'URL da imagem adicionada!' });
    }
  };

  const handleAIImageGenerated = (url: string) => {
    onImageChange(url);
  };

  if (imageUrl) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium">Imagem</label>
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Imagem</label>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-1.5">
            <LinkIcon className="h-3.5 w-3.5" />
            URL
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Gerar com IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              dragOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
              uploading && "pointer-events-none opacity-50"
            )}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Enviando...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-full bg-muted">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Clique ou arraste uma imagem</p>
                <p className="text-xs text-muted-foreground">PNG, JPG ou GIF até 5MB</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </TabsContent>

        <TabsContent value="url" className="mt-4 space-y-3">
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Cole a URL da imagem aqui"
              className="bg-muted/50"
            />
            <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
              Adicionar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Cole o link de uma imagem da web (ex: https://exemplo.com/imagem.jpg)
          </p>
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <AIImageGenerator onImageGenerated={handleAIImageGenerated} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
