import React from 'react';
import Icon from '../../../components/AppIcon';

const ContentStats = ({ stats }) => {
  const statCards = [
    {
      id: 'total',
      label: 'Total Medicamentos',
      value: stats?.total,
      icon: 'Pill',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'published',
      label: 'Publicados',
      value: stats?.published,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'draft',
      label: 'Borradores',
      value: stats?.draft,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      id: 'pending',
      label: 'Pendientes',
      value: stats?.pending,
      icon: 'AlertCircle',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards?.map((stat) => (
        <div key={stat?.id} className="bg-card p-6 rounded-lg border border-border clinical-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat?.label}</p>
              <p className="text-2xl font-semibold text-foreground">{stat?.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentStats;