import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const emptyMedication = {
  id: '',
  name: '',
  presentation: '',
  safetyDose: '',
  administrationRoute: '',
  administrationTime: '',
  concentration: '',
  dilution: '',
  dosageUnit: '',
  incompatibilities: '',
  dilutionStability: '',
  lightProtection: '',
  observations: ''
};

const SedoEditor = ({ isOpen, medication, onSave, onClose }) => {
  const [formData, setFormData] = useState(emptyMedication);

  useEffect(() => {
    if (medication) {
      setFormData({ ...medication, incompatibilities: medication.incompatibilities.join(', ') });
    } else {
      setFormData(emptyMedication);
    }
  }, [medication]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      id: medication?.id || formData.name.toLowerCase().replace(/\s+/g, '-'),
      incompatibilities: formData.incompatibilities.split(',').map(i => i.trim()).filter(Boolean)
    };
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">{medication ? 'Editar' : 'Nuevo'} medicamento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Presentación" name="presentation" value={formData.presentation} onChange={handleChange} />
          <Input label="Dosis de seguridad" name="safetyDose" value={formData.safetyDose} onChange={handleChange} />
          <Input label="Vía / Forma de administración" name="administrationRoute" value={formData.administrationRoute} onChange={handleChange} />
          <Input label="Tiempo de administración" name="administrationTime" value={formData.administrationTime} onChange={handleChange} />
          <Input label="Concentración" name="concentration" value={formData.concentration} onChange={handleChange} />
          <Input label="Dilución" name="dilution" value={formData.dilution} onChange={handleChange} />
          <Input label="Unidad de dosificación" name="dosageUnit" value={formData.dosageUnit} onChange={handleChange} />
          <Input label="Incompatibilidades (separadas por coma)" name="incompatibilities" value={formData.incompatibilities} onChange={handleChange} />
          <Input label="Estabilidad de la dilución" name="dilutionStability" value={formData.dilutionStability} onChange={handleChange} />
          <Input label="Protección de la luz" name="lightProtection" value={formData.lightProtection} onChange={handleChange} />
          <div>
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea name="observations" value={formData.observations} onChange={handleChange} rows={4} className="w-full border border-border rounded-md p-2" />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SedoEditor;
