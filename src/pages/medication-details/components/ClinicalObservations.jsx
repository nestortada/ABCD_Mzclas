import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ClinicalObservations = ({ medication }) => {
  const [expandedObservation, setExpandedObservation] = useState(null);

  const toggleObservation = (index) => {
    setExpandedObservation(expandedObservation === index ? null : index);
  };

  if (!medication?.clinicalObservations || medication?.clinicalObservations?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-lg">
          <Icon name="FileText" size={24} className="text-secondary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Observaciones Clínicas</h2>
      </div>
      <div className="space-y-4">
        {medication?.clinicalObservations?.map((observation, index) => (
          <div key={index} className="border border-border rounded-lg">
            <Button
              variant="ghost"
              onClick={() => toggleObservation(index)}
              className="w-full justify-between p-4 h-auto"
            >
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                  observation?.priority === 'Alta' ?'bg-error/10' 
                    : observation?.priority === 'Media' ?'bg-warning/10' :'bg-muted'
                }`}>
                  <Icon 
                    name={observation?.priority === 'Alta' ? "AlertTriangle" : observation?.priority === 'Media' ? "Info" : "FileText"} 
                    size={16} 
                    className={
                      observation?.priority === 'Alta' ?'text-error' 
                        : observation?.priority === 'Media' ?'text-warning' :'text-muted-foreground'
                    } 
                  />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-medium text-foreground">{observation?.title}</h3>
                  <p className="text-sm text-muted-foreground">{observation?.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    observation?.priority === 'Alta' ?'bg-error/10 text-error' 
                      : observation?.priority === 'Media' ?'bg-warning/10 text-warning' :'bg-muted text-muted-foreground'
                  }`}>
                    {observation?.priority}
                  </span>
                </div>
              </div>
              <Icon 
                name={expandedObservation === index ? "ChevronUp" : "ChevronDown"} 
                size={20} 
                className="text-muted-foreground" 
              />
            </Button>
            
            {expandedObservation === index && (
              <div className="px-4 pb-4 border-t border-border">
                <div className="mt-4 space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground">{observation?.description}</p>
                  </div>

                  {observation?.recommendations && observation?.recommendations?.length > 0 && (
                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                      <h4 className="font-medium text-accent mb-3 flex items-center">
                        <Icon name="Lightbulb" size={16} className="mr-2" />
                        Recomendaciones
                      </h4>
                      <div className="space-y-2">
                        {observation?.recommendations?.map((recommendation, recIndex) => (
                          <div key={recIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                            <p className="text-sm text-foreground">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {observation?.monitoringParameters && observation?.monitoringParameters?.length > 0 && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <h4 className="font-medium text-primary mb-3 flex items-center">
                        <Icon name="Activity" size={16} className="mr-2" />
                        Parámetros de Monitoreo
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {observation?.monitoringParameters?.map((parameter, paramIndex) => (
                          <div key={paramIndex} className="flex items-center space-x-2">
                            <Icon name="CheckCircle2" size={14} className="text-primary" />
                            <span className="text-sm text-foreground">{parameter}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {observation?.lastUpdated && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                      <span>Última actualización: {observation?.lastUpdated}</span>
                      {observation?.source && (
                        <span>Fuente: {observation?.source}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClinicalObservations;