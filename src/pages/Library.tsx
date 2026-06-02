import React, { useState, useEffect, useCallback } from 'react';
import { Library as LibraryIcon, Instagram } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Post, Platform, PostStatus } from '@/types';
import { toast } from '@/hooks/use-toast';
import { getPostsWithFilter, createPost, deletePost } from '@/integrations/firebase/firestore';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [editPost, setEditPost] = useState<Post | null>(null);
  const [analyticsPost, setAnalyticsPost] = useState<Post | null>(null);
  const [deletePost, setDeletePost] = useState<Post | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await getPostsWithFilter(user.uid, {
        search: search.trim().slice(0, 100),
        status: statusFilter,
        page: currentPage,
        pageSize: POSTS_PER_PAGE,
      });

      const typedPosts: Post[] = result.posts.map((post) => ({
        ...post,
        platforms: post.platforms as Platform[],
        status: post.status as PostStatus,
      }));

      setPosts(typedPosts);
      setTotalCount(result.totalCount);
    } catch (error) {
      toast({
        title: 'Erro ao carregar posts',
        description: 'Não foi possível carregar a biblioteca de posts.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, search, statusFilter, currentPage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const handleDuplicate = async (post: Post) => {
    try {
      await createPost({
        user_id: user?.uid || '',
        content: post.content,
        platforms: post.platforms,
        image_url: post.image_url,
        status: 'rascunho',
        scheduled_for: null,
        published_at: null,
      });

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
      await deletePost(deletePost.id);

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
        <Instagram className="w-6 h-6 text-pink-500" />
        Biblioteca
      </h1>

      <div className="glass-card rounded-xl p-6 space-y-6">
        <LibraryFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
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
