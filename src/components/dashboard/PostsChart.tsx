import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PostsPerDayData {
  day: string;
  count: number;
}

interface PostsChartProps {
  postsData: { created_at: string; status: string }[];
}

export const PostsChart: React.FC<PostsChartProps> = ({ postsData }) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayKey = format(date, 'yyyy-MM-dd');
    const dayLabel = format(date, 'dd/MM', { locale: ptBR });
    const count = postsData.filter(p => format(new Date(p.created_at), 'yyyy-MM-dd') === dayKey).length;
    return { day: dayLabel, count };
  });

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-6">Posts nos Últimos 7 Dias</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={last7Days}>
            <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222 47% 10%)',
                border: '1px solid hsl(222 30% 18%)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar dataKey="count" fill="#EC4899" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
