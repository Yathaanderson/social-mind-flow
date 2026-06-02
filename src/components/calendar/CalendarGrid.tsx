import React, { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { Post } from '@/types';
import { CalendarPostCard } from './CalendarPostCard';
import { cn } from '@/lib/utils';

interface CalendarGridProps {
  currentDate: Date;
  posts: Post[];
  onPostClick: (post: Post) => void;
  onDateClick: (date: Date) => void;
  onPostDrop?: (postId: string, newDate: Date) => void;
}

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  posts,
  onPostClick,
  onDateClick,
  onPostDrop,
}) => {
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getPostsForDay = (day: Date) => {
    return posts.filter((post) => {
      const postDate = post.scheduled_for || post.published_at;
      if (!postDate) return false;
      return isSameDay(new Date(postDate), day);
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, day: Date) => {
    e.preventDefault();
    setDragOverDate(format(day, 'yyyy-MM-dd'));
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverDate(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: Date) => {
    e.preventDefault();
    setDragOverDate(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.postId && onPostDrop) {
        const originalDate = data.originalDate ? new Date(data.originalDate) : new Date();
        const newDate = new Date(day);
        newDate.setHours(originalDate.getHours(), originalDate.getMinutes(), 0, 0);
        onPostDrop(data.postId, newDate);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="grid grid-cols-7 bg-muted/50">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-muted-foreground border-b border-border"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayPosts = getPostsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const dayKey = format(day, 'yyyy-MM-dd');
          const isDragOver = dragOverDate === dayKey;

          return (
            <div
              key={index}
              onClick={() => onDateClick(day)}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, day)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, day)}
              className={cn(
                'min-h-[100px] p-2 border-b border-r border-border cursor-pointer transition-all duration-200',
                !isCurrentMonth && 'opacity-40 bg-muted/10',
                isCurrentDay && 'bg-primary/10',
                isDragOver && 'bg-primary/20 border-dashed border-primary scale-[1.02] ring-2 ring-primary/30'
              )}
            >
              <div
                className={cn(
                  'text-sm font-medium mb-1',
                  isCurrentDay && 'text-primary'
                )}
              >
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayPosts.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <CalendarPostCard
                      post={post}
                      onClick={onPostClick}
                    />
                  </div>
                ))}
                {dayPosts.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayPosts.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
