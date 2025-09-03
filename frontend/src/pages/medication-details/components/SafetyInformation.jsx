import React from 'react';
import Icon from '../../../components/AppIcon';

const SafetyInformation = ({ medication }) => {
  const safetyItems = [
    {
      title: 'Dosis de Seguridad',
      value: medication?.safetyDose,
      icon: 'Calculator',
      type: 'primary'
    },
    {
      title: 'Vía de Administración',
      value: medication?.administrationRoute,
      icon: 'Syringe',
      type: 'secondary'
    },
    {
      title: 'Presentación',
      value: medication?.presentation,
      icon: 'Pill',
      type: 'secondary'
    },
    {
      title: 'Tiempo de Administración',
      value: medication?.administrationTime,
      icon: 'Clock',
      type: 'secondary'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Shield" size={24} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Información de Seguridad</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safetyItems?.map((item, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${
              item?.type === 'primary' ?'bg-primary/5 border-primary/20' :'bg-muted/50 border-border'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                item?.type === 'primary' ?'bg-primary/10' :'bg-muted'
              }`}>
                <Icon 
                  name={item?.icon} 
                  size={18} 
                  className={item?.type === 'primary' ? 'text-primary' : 'text-muted-foreground'} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium mb-1 ${
                  item?.type === 'primary' ? 'text-primary' : 'text-foreground'
                }`}>
                  {item?.title}
                </h3>
                <p className="text-sm text-muted-foreground break-words">{item?.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {medication?.specialInstructions && (
        <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-warning mt-0.5" />
            <div>
              <h4 className="font-medium text-warning mb-2">Instrucciones Especiales</h4>
              <p className="text-sm text-foreground">{medication?.specialInstructions}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyInformation;