import React from 'react';
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
import { ptBR } from 'date-fns/locale';
import { Post } from '@/types';
import { CalendarPostCard } from './CalendarPostCard';
import { cn } from '@/lib/utils';

interface CalendarGridProps {
  currentDate: Date;
  posts: Post[];
  filters: Record<string, boolean>;
  onPostClick: (post: Post) => void;
  onDateClick: (date: Date) => void;
}

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  posts,
  filters,
  onPostClick,
  onDateClick,
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getPostsForDay = (day: Date) => {
    return posts.filter((post) => {
      const postDate = post.scheduled_for || post.published_at;
      if (!postDate) return false;

      const matchesDate = isSameDay(new Date(postDate), day);
      const matchesFilter = post.platforms.some((p) => filters[p] !== false);

      return matchesDate && matchesFilter;
    });
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Week days header */}
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

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayPosts = getPostsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={index}
              onClick={() => onDateClick(day)}
              className={cn(
                'min-h-[100px] p-2 border-b border-r border-border cursor-pointer transition-colors hover:bg-muted/30',
                !isCurrentMonth && 'opacity-40 bg-muted/10',
                isCurrentDay && 'bg-primary/10'
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
