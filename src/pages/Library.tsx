import React, { useState, useEffect, useCallback } from 'react';
import { Library as LibraryIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Post, Platform, PostStatus } from '@/types';
import { toast } from '@/hooks/use-toast';
import { LibraryFilters } from '@/components/library/LibraryFilters';
import { LibraryTable } from '@/components/library/LibraryTable';
import { EditPostModal } from '@/components/modals/EditPostModal';
import { AnalyticsModal } from '@/components/modals/AnalyticsModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';

const POSTS_PER_PAGE = 10;

const Library: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [editPost, setEditPost] = useState<Post | null>(null);
  const [analyticsPost, setAnalyticsPost] = useState<Post | null>(null);
  const [deletePost, setDeletePost] = useState<Post | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (search) {
        const sanitizedSearch = search.trim().slice(0, 100);
        if (sanitizedSearch.length >= 2) {
          query = query.ilike('content', `%${sanitizedSearch}%`);
        }
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (platformFilter !== 'all') {
        query = query.contains('platforms', [platformFilter]);
      }

      const from = (currentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      // Cast platforms and status to proper types
      const typedPosts: Post[] = (data || []).map((post) => ({
        ...post,
        platforms: post.platforms as Platform[],
        status: post.status as PostStatus,
      }));

      setPosts(typedPosts);
      setTotalCount(count || 0);
    } catch (error) {
      toast({
        title: 'Erro ao carregar posts',
        description: 'Não foi possível carregar a biblioteca de posts.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, search, statusFilter, platformFilter, currentPage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, platformFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPlatformFilter('all');
    setCurrentPage(1);
  };

  const handleDuplicate = async (post: Post) => {
    try {
      const { error } = await supabase.from('posts').insert({
        user_id: user?.id,
        content: post.content,
        platforms: post.platforms,
        image_url: post.image_url,
        status: 'rascunho',
      });

      if (error) throw error;

      toast({
        title: 'Post duplicado',
        description: 'O post foi duplicado como rascunho.',
      });

      fetchPosts();
    } catch (error) {
      toast({
        title: 'Erro ao duplicar',
        description: 'Não foi possível duplicar o post.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deletePost) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', deletePost.id);

      if (error) throw error;

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

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <LibraryIcon className="w-6 h-6 text-primary" />
        Biblioteca
      </h1>

      <div className="glass-card rounded-xl p-6 space-y-6">
        <LibraryFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          platformFilter={platformFilter}
          onPlatformChange={setPlatformFilter}
          onClearFilters={handleClearFilters}
        />

        <LibraryTable
          posts={posts}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onEdit={setEditPost}
          onDuplicate={handleDuplicate}
          onAnalytics={setAnalyticsPost}
          onDelete={setDeletePost}
        />
      </div>

      <EditPostModal
        post={editPost}
        open={!!editPost}
        onOpenChange={(open) => !open && setEditPost(null)}
        onSaved={fetchPosts}
      />

      <AnalyticsModal
        post={analyticsPost}
        open={!!analyticsPost}
        onOpenChange={(open) => !open && setAnalyticsPost(null)}
      />

      <DeleteConfirmModal
        open={!!deletePost}
        onOpenChange={(open) => !open && setDeletePost(null)}
        onConfirm={handleDelete}
        title="Excluir post"
        description="Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default Library;
