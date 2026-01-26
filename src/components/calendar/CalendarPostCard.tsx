import React from 'react';
import { Post } from '@/types';

interface CalendarPostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

const platformColors: Record<string, string> = {
  instagram: 'bg-pink-500',
  linkedin: 'bg-blue-600',
  twitter: 'bg-sky-500',
  tiktok: 'bg-zinc-700',
};

export const CalendarPostCard: React.FC<CalendarPostCardProps> = ({ post, onClick }) => {
  const mainPlatform = post.platforms[0] || 'instagram';
  const bgColor = platformColors[mainPlatform] || 'bg-primary';

  return (
    <button
      onClick={() => onClick(post)}
      className={`w-full text-left p-1.5 rounded text-xs text-white truncate ${bgColor} hover:opacity-80 transition-opacity`}
    >
      {post.content.substring(0, 20)}
      {post.content.length > 20 && '...'}
    </button>
  );
};
