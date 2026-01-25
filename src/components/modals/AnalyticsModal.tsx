import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye, MousePointer, Share2, MessageCircle, TrendingUp } from 'lucide-react';
import { Post } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsModalProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Simulated engagement data
const generateEngagementData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: format(new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 'dd/MM'),
    engagement: Math.floor(Math.random() * 100) + 20
  }));
};

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ post, open, onOpenChange }) => {
  if (!post) return null;

  const engagementData = generateEngagementData();

  const metrics = [
    { label: 'Visualizações', value: post.views_count || 0, icon: Eye, color: 'text-blue-400' },
    { label: 'Cliques', value: post.clicks_count || 0, icon: MousePointer, color: 'text-green-400' },
    { label: 'Compartilhamentos', value: post.shares_count || 0, icon: Share2, color: 'text-purple-400' },
    { label: 'Comentários', value: post.comments_count || 0, icon: MessageCircle, color: 'text-pink-400' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Analytics do Post
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Post Content */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-sm whitespace-pre-wrap">{post.content}</p>
            <div className="flex gap-2 mt-3">
              {post.platforms.map((platform) => (
                <Badge key={platform} variant="outline" className="capitalize">
                  {platform}
                </Badge>
              ))}
            </div>
            {post.published_at && (
              <p className="text-xs text-muted-foreground mt-2">
                Publicado em {format(new Date(post.published_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
              </p>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Engagement Chart */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <h4 className="text-sm font-medium mb-4">Engajamento (últimos 7 dias)</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(222 47% 10%)', 
                      border: '1px solid hsl(222 30% 18%)',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
