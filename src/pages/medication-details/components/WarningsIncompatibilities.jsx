import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WarningsIncompatibilities = ({ medication }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-error/10 rounded-lg">
          <Icon name="AlertTriangle" size={24} className="text-error" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Advertencias e Incompatibilidades</h2>
      </div>
      <div className="space-y-4">
        {/* Critical Warnings */}
        {medication?.criticalWarnings && medication?.criticalWarnings?.length > 0 && (
          <div className="bg-error/10 border-2 border-error/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertOctagon" size={24} className="text-error mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-error mb-3">Advertencias Críticas</h3>
                <div className="space-y-2">
                  {medication?.criticalWarnings?.map((warning, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-error rounded-full mt-2"></div>
                      <p className="text-sm text-foreground">{warning}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drug Incompatibilities */}
        {medication?.incompatibilities && medication?.incompatibilities?.length > 0 && (
          <div className="border border-error/20 rounded-lg">
            <Button
              variant="ghost"
              onClick={() => toggleSection('incompatibilities')}
              className="w-full justify-between p-4 h-auto"
            >
              <div className="flex items-center space-x-3">
                <Icon name="X" size={20} className="text-error" />
                <span className="font-medium text-foreground">Incompatibilidades Medicamentosas</span>
                <span className="bg-error/10 text-error text-xs px-2 py-1 rounded-full">
                  {medication?.incompatibilities?.length}
                </span>
              </div>
              <Icon 
                name={expandedSection === 'incompatibilities' ? "ChevronUp" : "ChevronDown"} 
                size={20} 
                className="text-muted-foreground" 
              />
            </Button>
            
            {expandedSection === 'incompatibilities' && (
              <div className="px-4 pb-4 border-t border-error/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {medication?.incompatibilities?.map((incompatibility, index) => (
                    <div key={index} className="p-3 bg-error/5 border border-error/10 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                        <div>
                          <h4 className="font-medium text-error text-sm">{incompatibility?.drug}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{incompatibility?.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Adverse Reactions */}
        {medication?.adverseReactions && medication?.adverseReactions?.length > 0 && (
          <div className="border border-warning/20 rounded-lg">
            <Button
              variant="ghost"
              onClick={() => toggleSection('reactions')}
              className="w-full justify-between p-4 h-auto"
            >
              <div className="flex items-center space-x-3">
                <Icon name="Heart" size={20} className="text-warning" />
                <span className="font-medium text-foreground">Reacciones Adversas</span>
                <span className="bg-warning/10 text-warning text-xs px-2 py-1 rounded-full">
                  {medication?.adverseReactions?.length}
                </span>
              </div>
              <Icon 
                name={expandedSection === 'reactions' ? "ChevronUp" : "ChevronDown"} 
                size={20} 
                className="text-muted-foreground" 
              />
            </Button>
            
            {expandedSection === 'reactions' && (
              <div className="px-4 pb-4 border-t border-warning/20">
                <div className="space-y-3 mt-4">
                  {medication?.adverseReactions?.map((reaction, index) => (
                    <div key={index} className="p-3 bg-warning/5 border border-warning/10 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-warning text-sm">{reaction?.type}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{reaction?.description}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          reaction?.severity === 'Alta' ?'bg-error/10 text-error' 
                            : reaction?.severity === 'Media' ?'bg-warning/10 text-warning' :'bg-muted text-muted-foreground'
                        }`}>
                          {reaction?.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contraindications */}
        {medication?.contraindications && medication?.contraindications?.length > 0 && (
          <div className="border border-error/20 rounded-lg">
            <Button
              variant="ghost"
              onClick={() => toggleSection('contraindications')}
              className="w-full justify-between p-4 h-auto"
            >
              <div className="flex items-center space-x-3">
                <Icon name="Ban" size={20} className="text-error" />
                <span className="font-medium text-foreground">Contraindicaciones</span>
              </div>
              <Icon 
                name={expandedSection === 'contraindications' ? "ChevronUp" : "ChevronDown"} 
                size={20} 
                className="text-muted-foreground" 
              />
            </Button>
            
            {expandedSection === 'contraindications' && (
              <div className="px-4 pb-4 border-t border-error/20">
                <div className="space-y-2 mt-4">
                  {medication?.contraindications?.map((contraindication, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-error rounded-full mt-2"></div>
                      <p className="text-sm text-foreground">{contraindication}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WarningsIncompatibilities;