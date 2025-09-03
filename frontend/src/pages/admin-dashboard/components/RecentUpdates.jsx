import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentUpdates = ({ recentUpdates }) => {
  const navigate = useNavigate();

  const getUpdateTypeIcon = (type) => {
    switch (type) {
      case 'medication': return 'Pill';
      case 'protocol': return 'FileText';
      case 'incompatibility': return 'AlertTriangle';
      case 'dosage': return 'Calculator';
      default: return 'Edit';
    }
  };

  const getUpdateTypeColor = (type) => {
    switch (type) {
      case 'medication': return 'text-primary';
      case 'protocol': return 'text-accent';
      case 'incompatibility': return 'text-error';
      case 'dosage': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewUpdate = (updateId) => {
    navigate(`/medication-details/${updateId}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Actualizaciones Recientes</h3>
          <Icon name="RefreshCw" size={16} className="text-muted-foreground" />
        </div>
      </div>
      <div className="p-6">
        {recentUpdates?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No hay actualizaciones recientes
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentUpdates?.map((update) => (
              <div key={update?.id} className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-lg transition-colors">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getUpdateTypeColor(update?.type)}`}>
                    <Icon name={getUpdateTypeIcon(update?.type)} size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {update?.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {update?.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Por {update?.updatedBy}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(update?.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewUpdate(update?.medicationId)}
                >
                  <Icon name="ExternalLink" size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {recentUpdates?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => navigate('/content-management?filter=recent')}
              className="w-full"
            >
              Ver Todas las Actualizaciones
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentUpdates;