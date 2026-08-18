import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  DocumentSnapshot,
  QueryConstraint,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './client';
import { timestampToDate, dateToTimestamp } from './types';

const POSTS_COLLECTION = 'posts';
const PROFILES_COLLECTION = 'profiles';
const SOCIAL_ACCOUNTS_COLLECTION = 'social_accounts';
const USER_SETTINGS_COLLECTION = 'user_settings';

// --- Posts ---

// Observação: as consultas usam apenas `where('user_id')` e ordenam no cliente.
// Isso evita a necessidade de índices compostos no Firestore.

function sortByCreatedDesc<T extends { created_at: string }>(items: T[]) {
  return [...items].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

async function fetchUserPosts(userId: string) {
  const q = query(collection(db, POSTS_COLLECTION), where('user_id', '==', userId));
  const snap = await getDocs(q);
  return sortByCreatedDesc(snap.docs.map((d) => convertPostDoc(d)));
}

export async function getPosts(userId: string, opts?: { limitCount?: number }) {
  const posts = await fetchUserPosts(userId);
  return opts?.limitCount ? posts.slice(0, opts.limitCount) : posts;
}

export async function getPostsWithFilter(
  userId: string,
  opts: {
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const pageSize = opts.pageSize || 10;
  const page = opts.page || 1;

  let allPosts = await fetchUserPosts(userId);

  if (opts.status && opts.status !== 'all') {
    allPosts = allPosts.filter((p) => p.status === opts.status);
  }

  if (opts.search && opts.search.trim().length >= 2) {
    const term = opts.search.trim().toLowerCase();
    allPosts = allPosts.filter((p) => p.content.toLowerCase().includes(term));
  }

  const totalCount = allPosts.length;
  const start = (page - 1) * pageSize;
  const paginatedPosts = allPosts.slice(start, start + pageSize);

  return { posts: paginatedPosts, totalCount };
}

export async function getScheduledPosts(userId: string) {
  const posts = await fetchUserPosts(userId);
  return posts
    .filter((p) => p.scheduled_for !== null || p.published_at !== null)
    .sort((a, b) => ((a.scheduled_for || a.published_at || '') > (b.scheduled_for || b.published_at || '') ? 1 : -1));
}



export async function createPost(data: {
  user_id: string;
  content: string;
  platforms: string[];
  image_url: string | null;
  status: string;
  scheduled_for: string | null;
  published_at: string | null;
}) {
  const docData = {
    ...data,
    scheduled_for: dateToTimestamp(data.scheduled_for),
    published_at: dateToTimestamp(data.published_at),
    engagement_count: 0,
    views_count: 0,
    clicks_count: 0,
    shares_count: 0,
    comments_count: 0,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  };
  const ref = await addDoc(collection(db, POSTS_COLLECTION), docData);
  return ref.id;
}

export async function updatePost(postId: string, data: Record<string, unknown>) {
  const updateData: Record<string, unknown> = { ...data, updated_at: Timestamp.now() };
  if ('scheduled_for' in updateData && typeof updateData.scheduled_for === 'string') {
    updateData.scheduled_for = dateToTimestamp(updateData.scheduled_for as string | null);
  }
  if ('published_at' in updateData && typeof updateData.published_at === 'string') {
    updateData.published_at = dateToTimestamp(updateData.published_at as string | null);
  }
  await updateDoc(doc(db, POSTS_COLLECTION, postId), updateData);
}

export async function deletePost(postId: string) {
  await deleteDoc(doc(db, POSTS_COLLECTION, postId));
}

function convertPostDoc(d: DocumentSnapshot) {
  const data = d.data()!;
  return {
    id: d.id,
    user_id: data.user_id,
    content: data.content,
    platforms: data.platforms || [],
    image_url: data.image_url || null,
    scheduled_for: timestampToDate(data.scheduled_for),
    published_at: timestampToDate(data.published_at),
    status: data.status || 'rascunho',
    engagement_count: data.engagement_count || 0,
    views_count: data.views_count || 0,
    clicks_count: data.clicks_count || 0,
    shares_count: data.shares_count || 0,
    comments_count: data.comments_count || 0,
    created_at: timestampToDate(data.created_at) || new Date().toISOString(),
    updated_at: timestampToDate(data.updated_at) || new Date().toISOString(),
  };
}

// --- Profiles ---

export async function getProfile(userId: string) {
  const q = query(collection(db, PROFILES_COLLECTION), where('user_id', '==', userId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data();
  return {
    id: d.id,
    user_id: data.user_id,
    full_name: data.full_name || null,
    avatar_url: data.avatar_url || null,
    email: data.email || null,
    created_at: timestampToDate(data.created_at),
    updated_at: timestampToDate(data.updated_at),
  };
}

export async function upsertProfile(userId: string, data: { full_name?: string; avatar_url?: string; email?: string }) {
  const existing = await getProfile(userId);
  if (existing) {
    await updateDoc(doc(db, PROFILES_COLLECTION, existing.id), {
      ...data,
      updated_at: Timestamp.now(),
    });
  } else {
    await addDoc(collection(db, PROFILES_COLLECTION), {
      user_id: userId,
      ...data,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });
  }
}

// --- Social Accounts ---

export async function getSocialAccount(userId: string, platform: string) {
  const q = query(
    collection(db, SOCIAL_ACCOUNTS_COLLECTION),
    where('user_id', '==', userId),
    where('platform', '==', platform)
  );
  const snap = await getDocs(q);
  if (snap.empty) return { doc: null, data: null };
  const d = snap.docs[0];
  const data = d.data();
  return {
    doc: { id: d.id },
    data: {
      id: d.id,
      user_id: data.user_id,
      platform: data.platform,
      username: data.username || null,
      is_connected: data.is_connected ?? false,
      access_token: data.access_token || null,
      ig_user_id: data.ig_user_id || null,
      created_at: timestampToDate(data.created_at),
      updated_at: timestampToDate(data.updated_at),
    },
  };
}

export async function createSocialAccount(data: { user_id: string; platform: string }) {
  const ref = await addDoc(collection(db, SOCIAL_ACCOUNTS_COLLECTION), {
    ...data,
    username: null,
    is_connected: false,
    access_token: null,
    ig_user_id: null,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  });
  return ref.id;
}

export async function updateSocialAccount(docId: string, data: Record<string, unknown>) {
  await updateDoc(doc(db, SOCIAL_ACCOUNTS_COLLECTION, docId), {
    ...data,
    updated_at: Timestamp.now(),
  });
}

// --- User Settings ---

export async function getUserSettings(userId: string) {
  const q = query(collection(db, USER_SETTINGS_COLLECTION), where('user_id', '==', userId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data();
  return {
    id: d.id,
    user_id: data.user_id,
    notification_enabled: data.notification_enabled ?? true,
    comment_notification_enabled: data.comment_notification_enabled ?? true,
    best_posting_time: data.best_posting_time || '10:00',
    notification_email: data.notification_email || null,
    created_at: timestampToDate(data.created_at),
    updated_at: timestampToDate(data.updated_at),
  };
}

export async function updateUserSettings(docId: string, data: Record<string, unknown>) {
  await updateDoc(doc(db, USER_SETTINGS_COLLECTION, docId), {
    ...data,
    updated_at: Timestamp.now(),
  });
}

export async function createUserSettings(data: {
  user_id: string;
  notification_enabled?: boolean;
  comment_notification_enabled?: boolean;
  best_posting_time?: string;
  notification_email?: string;
}) {
  const ref = await addDoc(collection(db, USER_SETTINGS_COLLECTION), {
    notification_enabled: data.notification_enabled ?? true,
    comment_notification_enabled: data.comment_notification_enabled ?? true,
    best_posting_time: data.best_posting_time || '10:00',
    notification_email: data.notification_email || null,
    user_id: data.user_id,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  });
  return ref.id;
}
