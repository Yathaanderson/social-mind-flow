import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, TrendingUp, Clock, Plus, Instagram } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Post, Platform, PostStatus, DashboardMetrics, StatusStats } from '@/types';
import { getPosts, deletePost } from '@/integrations/firebase/firestore';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { PostsChart } from '@/components/dashboard/PostsChart';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { RecentPosts } from '@/components/dashboard/RecentPosts';
import { AnalyticsModal } from '@/components/modals/AnalyticsModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';
import { EditPostModal } from '@/components/modals/EditPostModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({ scheduledPosts: 0, publishedThisMonth: 0, averageEngagement: 0, nextPost: null });
  const [statusStats, setStatusStats] = useState<StatusStats[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const fetchPosts = async () => {
    if (!user) return;
    try {
      const data = await getPosts(user.uid, { limitCount: 10 });
      const typedData: Post[] = data.map(post => ({
        ...post,
        platforms: post.platforms as Platform[],
        status: post.status as PostStatus,
      }));
      setPosts(typedData);
      calculateMetrics(typedData);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateMetrics = (postsData: Post[]) => {
    const scheduled = postsData.filter(p => p.status === 'agendado').length;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const published = postsData.filter(p => p.status === 'publicado' && p.published_at && new Date(p.published_at) >= monthStart).length;
    const avgEngagement = postsData.length > 0 ? Math.round(postsData.reduce((acc, p) => acc + (p.engagement_count || 0), 0) / postsData.length) : 0;
    const nextScheduled = postsData.filter(p => p.status === 'agendado' && p.scheduled_for).sort((a, b) => new Date(a.scheduled_for!).getTime() - new Date(b.scheduled_for!).getTime())[0];
    setMetrics({ scheduledPosts: scheduled, publishedThisMonth: published, averageEngagement: avgEngagement, nextPost: nextScheduled?.scheduled_for ? format(new Date(nextScheduled.scheduled_for), "dd MMM, HH:mm", { locale: ptBR }) : null });

    const statuses: PostStatus[] = ['rascunho', 'agendado', 'publicado'];
    setStatusStats(statuses.map(s => ({ status: s, count: postsData.filter(post => post.status === s).length })));
  };

  useEffect(() => { fetchPosts(); }, [user]);

  const handleDelete = async () => {
    if (!selectedPost) return;
    try {
      await deletePost(selectedPost.id);
      toast({ title: 'Post excluído' });
      setDeleteOpen(false);
      fetchPosts();
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível excluir', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Instagram className="w-6 h-6 text-pink-500" />
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Posts Agendados" value={metrics.scheduledPosts} icon={Calendar} />
        <MetricCard title="Publicados Este Mês" value={metrics.publishedThisMonth} icon={CheckCircle} />
        <MetricCard title="Engajamento Médio" value={`${metrics.averageEngagement}%`} icon={TrendingUp} />
        <MetricCard title="Próximo Post" value={metrics.nextPost || '-'} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PostsChart postsData={posts.map(p => ({ created_at: p.created_at, status: p.status }))} />
        <StatusChart data={statusStats} />
      </div>

      <RecentPosts posts={posts} onEdit={(p) => { setSelectedPost(p); setEditOpen(true); }} onDelete={(p) => { setSelectedPost(p); setDeleteOpen(true); }} onAnalytics={(p) => { setSelectedPost(p); setAnalyticsOpen(true); }} />

      <Button onClick={() => navigate('/create')} className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90" size="icon">
        <Plus className="h-6 w-6" />
      </Button>

      <AnalyticsModal post={selectedPost} open={analyticsOpen} onOpenChange={setAnalyticsOpen} />
      <DeleteConfirmModal open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} />
      <EditPostModal post={selectedPost} open={editOpen} onOpenChange={setEditOpen} onSaved={fetchPosts} />
    </div>
  );
};

export default Dashboard;
