import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Post, Platform, PostStatus } from '@/types';
import { toast } from '@/hooks/use-toast';
import { getScheduledPosts, updatePost, deletePost as deletePostFn } from '@/integrations/firebase/firestore';
import { Button } from '@/components/ui/button';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { CalendarFilters } from '@/components/calendar/CalendarFilters';
import { PostDetailModal } from '@/components/calendar/PostDetailModal';
import { EditPostModal } from '@/components/modals/EditPostModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';

const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [deletePost, setDeletePost] = useState<Post | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getScheduledPosts(user.uid);
      const typedPosts: Post[] = data.map((post) => ({
        ...post,
        platforms: post.platforms as Platform[],
        status: post.status as PostStatus,
      }));

      setPosts(typedPosts);
    } catch (error) {
      toast({
        title: 'Erro ao carregar posts',
        description: 'Não foi possível carregar os posts do calendário.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleDateClick = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm");
    navigate(`/create?date=${formattedDate}`);
  };

  const handlePostDrop = async (postId: string, newDate: Date) => {
    if (!user || isRescheduling) return;

    setIsRescheduling(true);
    try {
      await updatePost(postId, {
        scheduled_for: newDate.toISOString(),
        status: 'agendado',
      });

      toast({
        title: 'Post reagendado',
        description: `Post movido para ${format(newDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
      });

      fetchPosts();
    } catch (error) {
      toast({
        title: 'Erro ao reagendar',
        description: 'Não foi possível reagendar o post. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleEdit = (post: Post) => {
    setSelectedPost(null);
    setEditPost(post);
  };

  const handleDelete = (post: Post) => {
    setSelectedPost(null);
    setDeletePost(post);
  };

  const handleDeleteConfirm = async () => {
    if (!deletePost) return;

    try {
      await deletePostFn(deletePost.id);

      toast({
        title: 'Post excluído',
        description: 'O post foi excluído com sucesso.',
      });

      setDeletePost(null);
      fetchPosts();
    } catch (error) {
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o post.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-primary" />
          Calendário
        </h1>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[150px] text-center font-medium capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4">
        <CalendarFilters onToday={handleToday} />
      </div>

      {loading ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p className="text-muted-foreground">Carregando calendário...</p>
        </div>
      ) : (
        <CalendarGrid
          currentDate={currentDate}
          posts={posts}
          onPostClick={handlePostClick}
          onDateClick={handleDateClick}
          onPostDrop={handlePostDrop}
        />
      )}

      <PostDetailModal
        post={selectedPost}
        open={!!selectedPost}
        onOpenChange={(open) => !open && setSelectedPost(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditPostModal
        post={editPost}
        open={!!editPost}
        onOpenChange={(open) => !open && setEditPost(null)}
        onSaved={fetchPosts}
      />

      <DeleteConfirmModal
        open={!!deletePost}
        onOpenChange={(open) => !open && setDeletePost(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir post"
        description="Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default CalendarPage;
