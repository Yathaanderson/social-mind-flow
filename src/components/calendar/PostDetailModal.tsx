import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Post } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Edit, Trash2, X, Calendar } from 'lucide-react';

interface PostDetailModalProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

const platformColors: Record<string, string> = {
  instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  linkedin: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  twitter: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  tiktok: 'bg-zinc-800 text-zinc-300 border-zinc-600',
};

const statusColors: Record<string, string> = {
  rascunho: 'bg-muted text-muted-foreground',
  agendado: 'bg-primary/20 text-primary',
  publicado: 'bg-green-500/20 text-green-400',
};

const statusLabels: Record<string, string> = {
  rascunho: 'Rascunho',
  agendado: 'Agendado',
  publicado: 'Publicado',
};

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}) => {
  if (!post) return null;

  const scheduledDate = post.scheduled_for
    ? format(new Date(post.scheduled_for), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
    : null;

  const publishedDate = post.published_at
    ? format(new Date(post.published_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Detalhes do Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            <Badge className={statusColors[post.status]}>
              {statusLabels[post.status]}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Platforms */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Redes sociais:</p>
            <div className="flex flex-wrap gap-2">
              {post.platforms.map((platform) => (
                <Badge
                  key={platform}
                  variant="outline"
                  className={`capitalize ${platformColors[platform]}`}
                >
                  {platform}
                </Badge>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2 text-sm">
            {scheduledDate && (
              <p>
                <span className="text-muted-foreground">Agendado para:</span>{' '}
                {scheduledDate}
              </p>
            )}
            {publishedDate && (
              <p>
                <span className="text-muted-foreground">Publicado em:</span>{' '}
                {publishedDate}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="mr-2 h-4 w-4" />
              Fechar
            </Button>
            <Button variant="outline" onClick={() => onEdit(post)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button variant="destructive" onClick={() => onDelete(post)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Deletar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
