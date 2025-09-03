import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      created: 'Plus',
      updated: 'Edit',
      published: 'CheckCircle',
      archived: 'Archive',
      deleted: 'Trash2'
    };
    return iconMap?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      created: 'text-success',
      updated: 'text-primary',
      published: 'text-success',
      archived: 'text-warning',
      deleted: 'text-error'
    };
    return colorMap?.[type] || 'text-muted-foreground';
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays}d`;
    
    return date?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Actividad Reciente</h3>
        <p className="text-sm text-muted-foreground">Últimos cambios en el sistema</p>
      </div>
      <div className="p-4">
        {activities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div key={activity?.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity?.type)}`}>
                  <Icon name={getActivityIcon(activity?.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity?.medication}
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatTimeAgo(activity?.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {activity?.action} por {activity?.user}
                  </p>
                  
                  {activity?.changes && (
                    <div className="mt-1">
                      <span className="text-xs text-muted-foreground">
                        Cambios: {activity?.changes?.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;