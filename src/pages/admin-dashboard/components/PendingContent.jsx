import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PendingContent = ({ pendingItems }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Clock';
      case 'low': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleReviewItem = (itemId) => {
    navigate(`/content-management?review=${itemId}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Contenido Pendiente</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {pendingItems?.length} elementos
            </span>
            <Icon name="Clock" size={16} className="text-warning" />
          </div>
        </div>
      </div>
      <div className="p-6">
        {pendingItems?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <p className="text-muted-foreground">
              No hay contenido pendiente de revisión
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {pendingItems?.map((item) => (
              <div key={item?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getPriorityColor(item?.priority)}`}>
                    <Icon name={getPriorityIcon(item?.priority)} size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {item?.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item?.type} • Creado por {item?.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item?.createdAt)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReviewItem(item?.id)}
                >
                  <Icon name="Eye" size={14} className="mr-2" />
                  Revisar
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {pendingItems?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => navigate('/content-management?filter=pending')}
              className="w-full"
            >
              Ver Todos los Pendientes
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingContent;