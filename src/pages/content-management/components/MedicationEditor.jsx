import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const MedicationEditor = ({ medication, isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    category: 'analgesics',
    status: 'draft',
    dosage: {
      adult: { min: '', max: '', unit: 'mg' },
      pediatric: { min: '', max: '', unit: 'mg' }
    },
    administration: {
      route: 'oral',
      form: 'tablet',
      frequency: '',
      duration: ''
    },
    concentration: '',
    dilution: {
      instructions: '',
      stability: '',
      lightProtection: false
    },
    incompatibilities: [],
    warnings: [],
    clinicalObservations: ''
  });

  const [errors, setErrors] = useState({});
  const [newIncompatibility, setNewIncompatibility] = useState('');
  const [newWarning, setNewWarning] = useState('');

  useEffect(() => {
    if (medication) {
      setFormData(medication);
    } else {
      // Reset form for new medication
      setFormData({
        name: '',
        genericName: '',
        category: 'analgesics',
        status: 'draft',
        dosage: {
          adult: { min: '', max: '', unit: 'mg' },
          pediatric: { min: '', max: '', unit: 'mg' }
        },
        administration: {
          route: 'oral',
          form: 'tablet',
          frequency: '',
          duration: ''
        },
        concentration: '',
        dilution: {
          instructions: '',
          stability: '',
          lightProtection: false
        },
        incompatibilities: [],
        warnings: [],
        clinicalObservations: ''
      });
    }
    setErrors({});
  }, [medication, isOpen]);

  const categories = [
    { value: 'analgesics', label: 'Analgésicos' },
    { value: 'antibiotics', label: 'Antibióticos' },
    { value: 'cardiovascular', label: 'Cardiovascular' },
    { value: 'respiratory', label: 'Respiratorio' },
    { value: 'endocrine', label: 'Endocrino' },
    { value: 'neurological', label: 'Neurológico' }
  ];

  const routes = [
    { value: 'oral', label: 'Oral' },
    { value: 'iv', label: 'Intravenoso' },
    { value: 'im', label: 'Intramuscular' },
    { value: 'sc', label: 'Subcutáneo' },
    { value: 'topical', label: 'Tópico' },
    { value: 'inhalation', label: 'Inhalación' }
  ];

  const forms = [
    { value: 'tablet', label: 'Comprimido' },
    { value: 'capsule', label: 'Cápsula' },
    { value: 'injection', label: 'Inyección' },
    { value: 'syrup', label: 'Jarabe' },
    { value: 'cream', label: 'Crema' },
    { value: 'drops', label: 'Gotas' }
  ];

  const units = [
    { value: 'mg', label: 'mg' },
    { value: 'g', label: 'g' },
    { value: 'ml', label: 'ml' },
    { value: 'mcg', label: 'mcg' },
    { value: 'units', label: 'unidades' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    
    if (name?.includes('.')) {
      const [parent, child, grandchild] = name?.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev?.[parent],
          [child]: grandchild ? {
            ...prev?.[parent]?.[child],
            [grandchild]: type === 'checkbox' ? checked : value
          } : (type === 'checkbox' ? checked : value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addIncompatibility = () => {
    if (newIncompatibility?.trim()) {
      setFormData(prev => ({
        ...prev,
        incompatibilities: [...prev?.incompatibilities, newIncompatibility?.trim()]
      }));
      setNewIncompatibility('');
    }
  };

  const removeIncompatibility = (index) => {
    setFormData(prev => ({
      ...prev,
      incompatibilities: prev?.incompatibilities?.filter((_, i) => i !== index)
    }));
  };

  const addWarning = () => {
    if (newWarning?.trim()) {
      setFormData(prev => ({
        ...prev,
        warnings: [...prev?.warnings, newWarning?.trim()]
      }));
      setNewWarning('');
    }
  };

  const removeWarning = (index) => {
    setFormData(prev => ({
      ...prev,
      warnings: prev?.warnings?.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData?.category) {
      newErrors.category = 'La categoría es requerida';
    }

    if (formData?.dosage?.adult?.min && formData?.dosage?.adult?.max) {
      if (parseFloat(formData?.dosage?.adult?.min) >= parseFloat(formData?.dosage?.adult?.max)) {
        newErrors['dosage.adult'] = 'La dosis mínima debe ser menor que la máxima';
      }
    }

    if (formData?.dosage?.pediatric?.min && formData?.dosage?.pediatric?.max) {
      if (parseFloat(formData?.dosage?.pediatric?.min) >= parseFloat(formData?.dosage?.pediatric?.max)) {
        newErrors['dosage.pediatric'] = 'La dosis mínima debe ser menor que la máxima';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const medicationData = {
        ...formData,
        lastModified: new Date()?.toISOString(),
        id: medication?.id || `med_${Date.now()}`
      };
      
      onSave(medicationData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-card rounded-lg border border-border clinical-shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {medication ? 'Editar Medicamento' : 'Nuevo Medicamento'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Complete la información del medicamento
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isLoading}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre Comercial"
                  name="name"
                  value={formData?.name}
                  onChange={handleInputChange}
                  error={errors?.name}
                  required
                  disabled={isLoading}
                />
                
                <Input
                  label="Nombre Genérico"
                  name="genericName"
                  value={formData?.genericName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Categoría *
                  </label>
                  <select
                    name="category"
                    value={formData?.category}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    {categories?.map(cat => (
                      <option key={cat?.value} value={cat?.value}>{cat?.label}</option>
                    ))}
                  </select>
                  {errors?.category && (
                    <p className="mt-1 text-sm text-error">{errors?.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Estado
                  </label>
                  <select
                    name="status"
                    value={formData?.status}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="draft">Borrador</option>
                    <option value="pending">Pendiente</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dosage Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Dosificación</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium text-foreground mb-3">Adultos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Dosis Mínima"
                      name="dosage.adult.min"
                      type="number"
                      value={formData?.dosage?.adult?.min}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <Input
                      label="Dosis Máxima"
                      name="dosage.adult.max"
                      type="number"
                      value={formData?.dosage?.adult?.max}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Unidad
                      </label>
                      <select
                        name="dosage.adult.unit"
                        value={formData?.dosage?.adult?.unit}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      >
                        {units?.map(unit => (
                          <option key={unit?.value} value={unit?.value}>{unit?.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {errors?.['dosage.adult'] && (
                    <p className="mt-1 text-sm text-error">{errors?.['dosage.adult']}</p>
                  )}
                </div>

                <div>
                  <h4 className="text-md font-medium text-foreground mb-3">Pediátricos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Dosis Mínima"
                      name="dosage.pediatric.min"
                      type="number"
                      value={formData?.dosage?.pediatric?.min}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <Input
                      label="Dosis Máxima"
                      name="dosage.pediatric.max"
                      type="number"
                      value={formData?.dosage?.pediatric?.max}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Unidad
                      </label>
                      <select
                        name="dosage.pediatric.unit"
                        value={formData?.dosage?.pediatric?.unit}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      >
                        {units?.map(unit => (
                          <option key={unit?.value} value={unit?.value}>{unit?.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {errors?.['dosage.pediatric'] && (
                    <p className="mt-1 text-sm text-error">{errors?.['dosage.pediatric']}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Administration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Administración</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Vía de Administración
                  </label>
                  <select
                    name="administration.route"
                    value={formData?.administration?.route}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    {routes?.map(route => (
                      <option key={route?.value} value={route?.value}>{route?.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Forma Farmacéutica
                  </label>
                  <select
                    name="administration.form"
                    value={formData?.administration?.form}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    {forms?.map(form => (
                      <option key={form?.value} value={form?.value}>{form?.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Frecuencia"
                  name="administration.frequency"
                  value={formData?.administration?.frequency}
                  onChange={handleInputChange}
                  placeholder="ej: cada 8 horas"
                  disabled={isLoading}
                />
                
                <Input
                  label="Duración"
                  name="administration.duration"
                  value={formData?.administration?.duration}
                  onChange={handleInputChange}
                  placeholder="ej: 7 días"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Dilution */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Dilución y Concentración</h3>
              
              <Input
                label="Concentración"
                name="concentration"
                value={formData?.concentration}
                onChange={handleInputChange}
                placeholder="ej: 10 mg/ml"
                disabled={isLoading}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Instrucciones de Dilución
                  </label>
                  <textarea
                    name="dilution.instructions"
                    value={formData?.dilution?.instructions}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
                    placeholder="Instrucciones detalladas de dilución..."
                  />
                </div>

                <Input
                  label="Estabilidad"
                  name="dilution.stability"
                  value={formData?.dilution?.stability}
                  onChange={handleInputChange}
                  placeholder="ej: 24 horas a temperatura ambiente"
                  disabled={isLoading}
                />
              </div>

              <Checkbox
                label="Requiere protección de la luz"
                name="dilution.lightProtection"
                checked={formData?.dilution?.lightProtection}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            {/* Incompatibilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Incompatibilidades</h3>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Agregar incompatibilidad..."
                  value={newIncompatibility}
                  onChange={(e) => setNewIncompatibility(e?.target?.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addIncompatibility}
                  disabled={isLoading || !newIncompatibility?.trim()}
                  iconName="Plus"
                >
                  Agregar
                </Button>
              </div>

              {formData?.incompatibilities?.length > 0 && (
                <div className="space-y-2">
                  {formData?.incompatibilities?.map((incompatibility, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-error/10 border border-error/20 rounded-md">
                      <span className="text-sm text-foreground">{incompatibility}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIncompatibility(index)}
                        disabled={isLoading}
                        className="h-6 w-6 text-error hover:text-error"
                      >
                        <Icon name="X" size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Warnings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Advertencias</h3>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Agregar advertencia..."
                  value={newWarning}
                  onChange={(e) => setNewWarning(e?.target?.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addWarning}
                  disabled={isLoading || !newWarning?.trim()}
                  iconName="Plus"
                >
                  Agregar
                </Button>
              </div>

              {formData?.warnings?.length > 0 && (
                <div className="space-y-2">
                  {formData?.warnings?.map((warning, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-md">
                      <span className="text-sm text-foreground">{warning}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeWarning(index)}
                        disabled={isLoading}
                        className="h-6 w-6 text-warning hover:text-warning"
                      >
                        <Icon name="X" size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clinical Observations */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Observaciones Clínicas</h3>
              
              <div>
                <textarea
                  name="clinicalObservations"
                  value={formData?.clinicalObservations}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
                  placeholder="Observaciones adicionales, efectos secundarios, contraindicaciones..."
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            onClick={handleSubmit}
          >
            {medication ? 'Actualizar' : 'Crear'} Medicamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicationEditor;