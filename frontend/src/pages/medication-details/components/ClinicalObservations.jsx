import React from 'react';
import Icon from '../../../components/AppIcon';

const ClinicalObservations = ({ medication }) => {
  if (!medication?.observations) {
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
      <div className="prose prose-sm max-w-none whitespace-pre-line">
        {medication?.observations}
      </div>
    </div>
  );
};

export default ClinicalObservations;
