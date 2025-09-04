import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MedicationModal = ({ medication, onClose }) => {
  if (!medication) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto p-6 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <Icon name="X" size={18} />
        </Button>
        <h3 className="text-xl font-semibold mb-4 text-slate-800">
          {medication.name}
        </h3>
        <div className="space-y-2 text-slate-700 text-sm">
          {medication.presentation && (
            <div>
              <span className="font-medium">Presentación: </span>
              {medication.presentation}
            </div>
          )}
          {medication.dosage && (
            <div>
              <span className="font-medium">Dosis de seguridad: </span>
              {medication.dosage}
              {medication.dosageUnit && ` (${medication.dosageUnit})`}
            </div>
          )}
          {medication.administration && (
            <div>
              <span className="font-medium">Vía de administración: </span>
              {medication.administration}
            </div>
          )}
          {medication.administrationTime && (
            <div>
              <span className="font-medium">Tiempo de administración: </span>
              {medication.administrationTime}
            </div>
          )}
          {medication.concentration && (
            <div>
              <span className="font-medium">Concentración: </span>
              {medication.concentration}
            </div>
          )}
          {medication.dilution && (
            <div>
              <span className="font-medium">Dilución: </span>
              {medication.dilution}
            </div>
          )}
          {medication.stability && (
            <div>
              <span className="font-medium">Estabilidad de la dilución: </span>
              {medication.stability}
            </div>
          )}
          {medication.lightProtection && (
            <div>
              <span className="font-medium">Protección de la luz: </span>
              {medication.lightProtection}
            </div>
          )}
          {medication.incompatibilities && (
            <div>
              <span className="font-medium">Incompatibilidades: </span>
              {medication.incompatibilities}
            </div>
          )}
          {medication.observations && (
            <div>
              <span className="font-medium">Observaciones: </span>
              <p className="whitespace-pre-line mt-1">{medication.observations}</p>
            </div>
          )}
          {medication.warnings && (
            <div>
              <span className="font-medium">Advertencias: </span>
              {medication.warnings}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationModal;
