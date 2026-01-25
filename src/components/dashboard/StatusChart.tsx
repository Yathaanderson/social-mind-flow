import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { StatusStats } from '@/types';

const statusColors: Record<string, string> = {
  rascunho: '#64748b',
  agendado: '#3B82F6',
  publicado: '#10B981'
};

const statusLabels: Record<string, string> = {
  rascunho: 'Rascunho',
  agendado: 'Agendado',
  publicado: 'Publicado'
};

interface StatusChartProps {
  data: StatusStats[];
}

export const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: statusLabels[item.status] || item.status,
    value: item.count,
    status: item.status
  }));

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-6">Distribuição de Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={statusColors[entry.status] || '#3B82F6'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222 47% 10%)', 
                border: '1px solid hsl(222 30% 18%)',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Legend 
              verticalAlign="bottom" 
              iconType="circle"
              formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
