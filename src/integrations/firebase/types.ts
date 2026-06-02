import { DocumentData, Timestamp } from 'firebase/firestore';

export interface PostDocument {
  id: string;
  user_id: string;
  content: string;
  platforms: string[];
  image_url: string | null;
  scheduled_for: Timestamp | null;
  published_at: Timestamp | null;
  status: string;
  engagement_count: number | null;
  views_count: number | null;
  clicks_count: number | null;
  shares_count: number | null;
  comments_count: number | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ProfileDocument {
  id?: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface SocialAccountDocument {
  id?: string;
  user_id: string;
  platform: string;
  username: string | null;
  is_connected: boolean | null;
  access_token?: string | null;
  ig_user_id?: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface UserSettingsDocument {
  id?: string;
  user_id: string;
  notification_enabled: boolean | null;
  comment_notification_enabled: boolean | null;
  best_posting_time: string | null;
  notification_email: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export function timestampToDate(t: Timestamp | null | undefined): string | null {
  if (!t) return null;
  return t.toDate().toISOString();
}

export function dateToTimestamp(dateStr: string | null): Timestamp | null {
  if (!dateStr) return null;
  return Timestamp.fromDate(new Date(dateStr));
}
