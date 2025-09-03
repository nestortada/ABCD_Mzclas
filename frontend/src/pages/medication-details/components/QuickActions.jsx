import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ medication, onAddToFavorites, onPrintInfo }) => {
  const navigate = useNavigate();

  const quickActionItems = [
    {
      id: 'protocols',
      label: 'Ver Protocolos',
      description: 'Protocolos relacionados',
      icon: 'FileText',
      action: () => navigate(`/protocols?medication=${medication?.id}`),
      color: 'primary'
    },
    {
      id: 'interactions',
      label: 'Interacciones',
      description: 'Verificar interacciones',
      icon: 'AlertTriangle',
      action: () => navigate(`/interactions?medication=${medication?.id}`),
      color: 'warning'
    },
    {
      id: 'calculator',
      label: 'Calculadora',
      description: 'Calcular dosis',
      icon: 'Calculator',
      action: () => navigate(`/dosage-calculator?medication=${medication?.id}`),
      color: 'accent'
    },
    {
      id: 'print',
      label: 'Imprimir',
      description: 'Información completa',
      icon: 'Printer',
      action: onPrintInfo,
      color: 'secondary'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
          <Icon name="Zap" size={24} className="text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Acciones Rápidas</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActionItems?.map((item) => (
          <Button
            key={item?.id}
            variant="outline"
            onClick={item?.action}
            className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-muted/50"
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              item?.color === 'primary' ? 'bg-primary/10' :
              item?.color === 'warning' ? 'bg-warning/10' :
              item?.color === 'accent'? 'bg-accent/10' : 'bg-secondary/10'
            }`}>
              <Icon 
                name={item?.icon} 
                size={20} 
                className={
                  item?.color === 'primary' ? 'text-primary' :
                  item?.color === 'warning' ? 'text-warning' :
                  item?.color === 'accent'? 'text-accent' : 'text-secondary'
                } 
              />
            </div>
            <div className="text-center">
              <div className="font-medium text-sm text-foreground">{item?.label}</div>
              <div className="text-xs text-muted-foreground">{item?.description}</div>
            </div>
          </Button>
        ))}
      </div>
      {/* Emergency Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <h3 className="font-medium text-foreground mb-3 flex items-center">
          <Icon name="AlertCircle" size={18} className="mr-2 text-error" />
          Acciones de Emergencia
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/emergency-protocols')}
            className="justify-start h-12 border-error/20 hover:bg-error/5"
          >
            <Icon name="Phone" size={18} className="mr-3 text-error" />
            <div className="text-left">
              <div className="font-medium text-error">Centro de Toxicología</div>
              <div className="text-xs text-muted-foreground">Consulta inmediata</div>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/antidotes')}
            className="justify-start h-12 border-warning/20 hover:bg-warning/5"
          >
            <Icon name="Shield" size={18} className="mr-3 text-warning" />
            <div className="text-left">
              <div className="font-medium text-warning">Antídotos</div>
              <div className="text-xs text-muted-foreground">Información de antídotos</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;