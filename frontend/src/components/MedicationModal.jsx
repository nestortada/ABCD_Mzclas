import React, { useEffect } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';

const MedicationModal = ({ medication, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen && medication) {
      // Crear un nuevo objeto de síntesis de voz
      const speech = new SpeechSynthesisUtterance();
      speech.text = `Dosis de seguridad para ${medication.Medicamento}: ${medication['Dosis de seguridad']}`;
      speech.lang = 'es-ES';
      speech.rate = 0.9; // Velocidad de habla un poco más lenta para mejor comprensión
      
      // Reproducir el texto
      window.speechSynthesis.speak(speech);
    }
    
    return () => {
      // Detener cualquier síntesis de voz al cerrar el modal
      window.speechSynthesis.cancel();
    };
  }, [isOpen, medication]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-4xl w-full shadow-xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-200">
            <div>
              <h3 className="text-2xl font-semibold text-slate-800">
                {medication?.Medicamento}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {medication?.Presentacion}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-500"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Dosage and Administration */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Dosis de seguridad</h4>
                <p className="text-slate-600">{medication?.['Dosis de seguridad']}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Vía de administración</h4>
                <p className="text-slate-600">{medication?.['Via / Forma de administracion']}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Tiempo de administración</h4>
                <p className="text-slate-600">{medication?.['Tiempo de administracion']}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Concentración</h4>
                <p className="text-slate-600">{medication?.Concentracion}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Dilución</h4>
                <p className="text-slate-600">{medication?.Dilucion}</p>
              </div>

              {medication?.Incompatibilidades && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2">Incompatibilidades</h4>
                  <p className="text-slate-600">{medication?.Incompatibilidades}</p>
                </div>
              )}

              {medication?.Observaciones && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2">Observaciones</h4>
                  <p className="text-slate-600">{medication?.Observaciones}</p>
                </div>
              )}

              {medication?.['Estabilidad de la dilucion'] && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2">Estabilidad de la dilución</h4>
                  <p className="text-slate-600">{medication?.['Estabilidad de la dilucion']}</p>
                </div>
              )}

              {medication?.['Proteccion de la luz'] && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2">Protección de la luz</h4>
                  <p className="text-slate-600">{medication?.['Proteccion de la luz']}</p>
                </div>
              )}

              {medication?.Advertencias && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2">Advertencias</h4>
                  <p className="text-slate-600">{medication?.Advertencias}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationModal;
