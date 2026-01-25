import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit2, Trash2, BarChart3 } from 'lucide-react';
import { Post, Platform } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const platformColors: Record<Platform, string> = {
  instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  linkedin: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
  twitter: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  tiktok: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30'
};

const statusColors: Record<string, string> = {
  rascunho: 'bg-muted text-muted-foreground',
  agendado: 'bg-primary/20 text-primary',
  publicado: 'bg-success/20 text-success'
};

const statusLabels: Record<string, string> = {
  rascunho: 'Rascunho',
  agendado: 'Agendado',
  publicado: 'Publicado'
};

interface RecentPostsProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onAnalytics: (post: Post) => void;
}

export const RecentPosts: React.FC<RecentPostsProps> = ({ 
  posts, 
  onEdit, 
  onDelete, 
  onAnalytics 
}) => {
  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-6">Últimos Posts</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead>Conteúdo</TableHead>
              <TableHead>Redes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhum post encontrado. Crie seu primeiro post!
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} className="border-border/50 hover:bg-muted/30">
                  <TableCell className="max-w-[200px]">
                    <p className="truncate">{post.content.slice(0, 50)}...</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {post.platforms.map((platform) => (
                        <Badge 
                          key={platform} 
                          variant="outline" 
                          className={cn("text-xs capitalize", platformColors[platform])}
                        >
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize", statusColors[post.status])}>
                      {statusLabels[post.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.scheduled_for 
                      ? format(new Date(post.scheduled_for), "dd MMM, HH:mm", { locale: ptBR })
                      : post.published_at 
                        ? format(new Date(post.published_at), "dd MMM, HH:mm", { locale: ptBR })
                        : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={() => onEdit(post)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={() => onAnalytics(post)}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDelete(post)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
