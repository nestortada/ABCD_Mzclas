import React from 'react';
import Icon from '../../../components/AppIcon';

const DosageConcentration = ({ medication }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
          <Icon name="Beaker" size={24} className="text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Concentración y Dilución</h2>
      </div>
      <div className="space-y-6">
        {/* Concentration Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Droplets" size={18} className="text-accent" />
              <h3 className="font-medium text-foreground">Concentración</h3>
            </div>
            <p className="text-lg font-semibold text-accent">{medication?.concentration}</p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Scale" size={18} className="text-accent" />
              <h3 className="font-medium text-foreground">Unidad de Dosificación</h3>
            </div>
            <p className="text-lg font-semibold text-accent">{medication?.dosageUnit}</p>
          </div>
        </div>

        {/* Dilution Instructions */}
        {medication?.dilution && (
          <div className="space-y-4">
            <h3 className="font-medium text-foreground flex items-center">
              <Icon name="FlaskConical" size={18} className="mr-2 text-accent" />
              Dilución
            </h3>

            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <p className="text-sm text-foreground whitespace-pre-line">{medication?.dilution}</p>
            </div>
          </div>
        )}

        {/* Stability Information */}
        {medication?.dilutionStability && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Timer" size={18} className="text-success" />
                <h4 className="font-medium text-success">Estabilidad de Dilución</h4>
              </div>
              <p className="text-sm text-foreground">{medication?.dilutionStability}</p>
            </div>

            {medication?.lightProtection && medication?.lightProtection !== 'No Aplica' && (
              <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Sun" size={18} className="text-warning" />
                  <h4 className="font-medium text-warning">Protección de Luz</h4>
                </div>
                <p className="text-sm text-foreground">{medication?.lightProtection}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DosageConcentration;