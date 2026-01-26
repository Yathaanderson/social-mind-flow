import React from 'react';
import { Post } from '@/types';
import { cn } from '@/lib/utils';

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
  
  const isDraggable = post.status !== 'publicado';

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    if (!isDraggable) {
      e.preventDefault();
      return;
    }
    
    e.dataTransfer.setData('application/json', JSON.stringify({
      postId: post.id,
      originalDate: post.scheduled_for || post.published_at,
    }));
    e.dataTransfer.effectAllowed = 'move';
    
    // Add dragging class for visual feedback
    (e.target as HTMLElement).classList.add('opacity-50', 'scale-95');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLButtonElement>) => {
    // Remove dragging visual feedback
    (e.target as HTMLElement).classList.remove('opacity-50', 'scale-95');
  };

  return (
    <button
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onClick(post)}
      className={cn(
        'w-full text-left p-1.5 rounded text-xs text-white truncate transition-all',
        bgColor,
        isDraggable 
          ? 'cursor-grab hover:opacity-80 active:cursor-grabbing' 
          : 'cursor-not-allowed opacity-70'
      )}
      title={isDraggable ? 'Arraste para reagendar' : 'Post publicado não pode ser movido'}
    >
      {post.content.substring(0, 20)}
      {post.content.length > 20 && '...'}
    </button>
  );
};
