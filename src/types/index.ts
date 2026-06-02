export type Platform = 'instagram';

export type PostStatus = 'rascunho' | 'agendado' | 'publicado';

export type ToneType = 'formal' | 'casual' | 'sales' | 'inspirational';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  platforms: Platform[];
  image_url: string | null;
  scheduled_for: string | null;
  published_at: string | null;
  status: PostStatus;
  engagement_count: number;
  views_count: number;
  clicks_count: number;
  shares_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  notification_enabled: boolean;
  comment_notification_enabled: boolean;
  best_posting_time: string;
  notification_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: Platform;
  username: string | null;
  is_connected: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  scheduledPosts: number;
  publishedThisMonth: number;
  averageEngagement: number;
  nextPost: string | null;
}

export interface PlatformStats {
  platform: Platform;
  count: number;
}

export interface StatusStats {
  status: PostStatus;
  count: number;
}
