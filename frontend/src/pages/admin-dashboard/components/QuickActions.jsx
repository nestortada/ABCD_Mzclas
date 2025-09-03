import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'add-medication',
      title: 'Agregar Medicamento',
      description: 'Añadir nueva entrada al diccionario',
      icon: 'Plus',
      variant: 'default',
      action: () => navigate('/content-management?action=add')
    },
    {
      id: 'bulk-import',
      title: 'Importación Masiva',
      description: 'Cargar múltiples medicamentos',
      icon: 'Upload',
      variant: 'outline',
      action: () => navigate('/content-management?action=import')
    },
    {
      id: 'review-pending',
      title: 'Revisar Pendientes',
      description: 'Contenido esperando aprobación',
      icon: 'Clock',
      variant: 'outline',
      action: () => navigate('/content-management?filter=pending')
    },
    {
      id: 'export-data',
      title: 'Exportar Datos',
      description: 'Descargar base de datos',
      icon: 'Download',
      variant: 'outline',
      action: () => navigate('/content-management?action=export')
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Acciones Rápidas</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Gestión directa del contenido clínico
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions?.map((action) => (
            <Button
              key={action?.id}
              variant={action?.variant}
              onClick={action?.action}
              className="h-auto p-4 justify-start text-left"
            >
              <div className="flex items-start space-x-3 w-full">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={action?.icon} size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground">{action?.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action?.description}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;