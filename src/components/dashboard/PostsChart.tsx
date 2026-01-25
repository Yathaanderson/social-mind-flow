import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PlatformStats } from '@/types';

const platformColors: Record<string, string> = {
  instagram: '#EC4899',
  linkedin: '#0A66C2',
  twitter: '#1DA1F2',
  tiktok: '#000000'
};

const platformLabels: Record<string, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  tiktok: 'TikTok'
};

interface PostsChartProps {
  data: PlatformStats[];
}

export const PostsChart: React.FC<PostsChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: platformLabels[item.platform] || item.platform,
    count: item.count,
    platform: item.platform
  }));

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-6">Posts por Rede Social</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" stroke="#64748b" fontSize={12} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={12}
              width={80}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222 47% 10%)', 
                border: '1px solid hsl(222 30% 18%)',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={platformColors[entry.platform] || '#3B82F6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
