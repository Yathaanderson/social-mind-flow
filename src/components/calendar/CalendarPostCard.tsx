import React from 'react';
import { Post } from '@/types';
import { cn } from '@/lib/utils';

interface CalendarPostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

const statusColors: Record<string, string> = {
  rascunho: 'bg-gray-500',
  agendado: 'bg-pink-500',
  publicado: 'bg-green-500',
};

export const CalendarPostCard: React.FC<CalendarPostCardProps> = ({ post, onClick }) => {
  const bgColor = statusColors[post.status] || 'bg-pink-500';
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

    (e.target as HTMLElement).classList.add('opacity-50', 'scale-95');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLButtonElement>) => {
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
