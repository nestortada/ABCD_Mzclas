import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MedicationModal = ({ medication, onClose }) => {
  useEffect(() => {
    if (medication && typeof window !== 'undefined') {
      const synth = window.speechSynthesis;
      if (synth) {
        const parts = [];
        if (medication.dosage) parts.push(`Dosis de seguridad: ${medication.dosage}`);
        if (medication.dilution) parts.push(`Dilución: ${medication.dilution}`);
        if (medication.lightProtection) parts.push(`Protección a la luz: ${medication.lightProtection}`);
        const utterance = new SpeechSynthesisUtterance(parts.join('. '));
        utterance.lang = 'es-ES';
        synth.cancel();
        synth.speak(utterance);
        return () => synth.cancel();
      }
    }
  }, [medication]);

  if (!medication) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 p-6 flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-white">
            {medication.name}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <Icon name="X" size={18} />
          </Button>
        </div>
        <div className="p-6 space-y-6 text-slate-700 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {medication.presentation && (
              <div>
                <h4 className="font-medium text-slate-600">Presentación</h4>
                <p className="text-slate-800">{medication.presentation}</p>
              </div>
            )}
            {medication.dosage && (
              <div>
                <h4 className="font-medium text-slate-600">Dosis de seguridad</h4>
                <p className="text-slate-800">
                  {medication.dosage}
                  {medication.dosageUnit && ` (${medication.dosageUnit})`}
                </p>
              </div>
            )}
            {medication.administration && (
              <div>
                <h4 className="font-medium text-slate-600">Vía de administración</h4>
                <p className="text-slate-800">{medication.administration}</p>
              </div>
            )}
            {medication.administrationTime && (
              <div>
                <h4 className="font-medium text-slate-600">Tiempo de administración</h4>
                <p className="text-slate-800">{medication.administrationTime}</p>
              </div>
            )}
            {medication.concentration && (
              <div>
                <h4 className="font-medium text-slate-600">Concentración</h4>
                <p className="text-slate-800">{medication.concentration}</p>
              </div>
            )}
            {medication.dilution && (
              <div>
                <h4 className="font-medium text-slate-600">Dilución</h4>
                <p className="text-slate-800">{medication.dilution}</p>
              </div>
            )}
            {medication.stability && (
              <div>
                <h4 className="font-medium text-slate-600">Estabilidad de la dilución</h4>
                <p className="text-slate-800">{medication.stability}</p>
              </div>
            )}
            {medication.lightProtection && (
              <div>
                <h4 className="font-medium text-slate-600">Protección de la luz</h4>
                <p className="text-slate-800">{medication.lightProtection}</p>
              </div>
            )}
            {medication.incompatibilities && (
              <div className="sm:col-span-2">
                <h4 className="font-medium text-slate-600">Incompatibilidades</h4>
                <p className="text-slate-800">{medication.incompatibilities}</p>
              </div>
            )}
            {medication.warnings && (
              <div className="sm:col-span-2">
                <h4 className="font-medium text-slate-600">Advertencias</h4>
                <p className="text-slate-800">{medication.warnings}</p>
              </div>
            )}
          </div>
          {medication.observations && (
            <div>
              <h4 className="font-medium text-slate-600">Observaciones</h4>
              <p className="whitespace-pre-line mt-1 text-slate-800">{medication.observations}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationModal;
