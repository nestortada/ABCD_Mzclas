import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MedicationModal = ({ medication, onClose }) => {
  useEffect(() => {
    if (!medication || !('speechSynthesis' in window)) return;

    const parts = [`Nombre del medicamento: ${medication.name}`];

    if (medication.dosage) {
      parts.push(
        `Dosis de seguridad: ${medication.dosage}${
          medication.dosageUnit ? ` ${medication.dosageUnit}` : ''
        }`
      );
    }

    if (medication.stability) {
      parts.push(`Estabilidad de la dilución: ${medication.stability}`);
    }

    if (medication.lightProtection) {
      parts.push(`Protección a la luz: ${medication.lightProtection}`);
    }

    const utterance = new SpeechSynthesisUtterance(parts.join('. '));
    utterance.lang = 'es-ES';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => window.speechSynthesis.cancel();
  }, [medication]);

  if (!medication) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-full overflow-y-auto relative transform transition-all animate-in fade-in zoom-in">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-t-2xl">
          <h3 className="text-xl font-semibold text-white text-center">
            {medication.name}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white"
          >
            <Icon name="X" size={18} />
          </Button>
        </div>
        <div className="p-6 space-y-3 text-slate-700 text-sm">
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
