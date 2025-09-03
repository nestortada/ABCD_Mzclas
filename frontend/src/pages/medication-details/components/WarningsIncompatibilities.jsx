import React from 'react';
import Icon from '../../../components/AppIcon';

const WarningsIncompatibilities = ({ medication }) => {
  if (!medication?.incompatibilities || medication?.incompatibilities.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-error/10 rounded-lg">
          <Icon name="AlertTriangle" size={24} className="text-error" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Incompatibilidades</h2>
      </div>
      <ul className="space-y-2">
        {medication?.incompatibilities?.map((item, index) => (
          <li key={index} className="flex items-start space-x-2">
            <Icon name="X" size={16} className="text-error mt-1" />
            <span className="text-sm text-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WarningsIncompatibilities;
