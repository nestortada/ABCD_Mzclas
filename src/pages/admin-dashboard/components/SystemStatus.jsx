import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatus = ({ systemHealth }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy': return 'Operativo';
      case 'warning': return 'Advertencia';
      case 'error': return 'Error';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Estado del Sistema</h3>
          <div className={`flex items-center space-x-2 ${getStatusColor(systemHealth?.overall)}`}>
            <Icon name={getStatusIcon(systemHealth?.overall)} size={16} />
            <span className="text-sm font-medium">
              {getStatusText(systemHealth?.overall)}
            </span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {systemHealth?.services?.map((service) => (
            <div key={service?.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  service?.status === 'healthy' ? 'bg-success' :
                  service?.status === 'warning' ? 'bg-warning' : 'bg-error'
                }`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{service?.name}</p>
                  <p className="text-xs text-muted-foreground">{service?.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${getStatusColor(service?.status)}`}>
                  {getStatusText(service?.status)}
                </p>
                {service?.responseTime && (
                  <p className="text-xs text-muted-foreground">
                    {service?.responseTime}ms
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Última verificación:</span>
            <span className="text-foreground font-medium">
              {new Date(systemHealth.lastCheck)?.toLocaleString('es-ES')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;