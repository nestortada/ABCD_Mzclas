import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const filterCategories = [
    {
      id: 'category',
      label: 'Categoría',
      options: [
        { value: 'analgesic', label: 'Analgésicos' },
        { value: 'antibiotic', label: 'Antibióticos' },
        { value: 'cardiovascular', label: 'Cardiovasculares' },
        { value: 'respiratory', label: 'Respiratorios' },
        { value: 'gastrointestinal', label: 'Gastrointestinales' },
        { value: 'neurological', label: 'Neurológicos' }
      ]
    },
    {
      id: 'route',
      label: 'Vía de administración',
      options: [
        { value: 'oral', label: 'Oral' },
        { value: 'iv', label: 'Intravenosa' },
        { value: 'im', label: 'Intramuscular' },
        { value: 'topical', label: 'Tópica' },
        { value: 'inhalation', label: 'Inhalación' }
      ]
    },
    {
      id: 'form',
      label: 'Forma farmacéutica',
      options: [
        { value: 'tablet', label: 'Comprimidos' },
        { value: 'capsule', label: 'Cápsulas' },
        { value: 'injection', label: 'Inyecciones' },
        { value: 'syrup', label: 'Jarabes' },
        { value: 'cream', label: 'Cremas' }
      ]
    },
    {
      id: 'warnings',
      label: 'Advertencias',
      options: [
        { value: 'high-alert', label: 'Medicamentos de alto riesgo' },
        { value: 'pregnancy', label: 'Precaución en embarazo' },
        { value: 'pediatric', label: 'Precaución pediátrica' },
        { value: 'renal', label: 'Ajuste renal' },
        { value: 'hepatic', label: 'Ajuste hepático' }
      ]
    }
  ];

  const handleFilterChange = (categoryId, optionValue, checked) => {
    setLocalFilters(prev => ({
      ...prev,
      [categoryId]: checked 
        ? [...(prev?.[categoryId] || []), optionValue]
        : (prev?.[categoryId] || [])?.filter(v => v !== optionValue)
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(localFilters)?.reduce((count, filterArray) => 
      count + (filterArray?.length || 0), 0
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className="lg:hidden fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      {/* Sidebar */}
      <div className="fixed lg:sticky top-0 right-0 lg:right-auto h-full lg:h-auto w-80 bg-white border-l lg:border-l-0 lg:border-r border-slate-200 z-50 lg:z-auto clinical-shadow-lg lg:clinical-shadow overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">
            Filtros
            {getActiveFiltersCount() > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={18} />
          </Button>
        </div>

        {/* Filter Categories */}
        <div className="p-4 space-y-6">
          {filterCategories?.map((category) => (
            <div key={category?.id}>
              <h4 className="font-medium text-slate-700 mb-3">{category?.label}</h4>
              <div className="space-y-2">
                {category?.options?.map((option) => (
                  <Checkbox
                    key={option?.value}
                    label={option?.label}
                    checked={(localFilters?.[category?.id] || [])?.includes(option?.value)}
                    onChange={(e) => handleFilterChange(category?.id, option?.value, e?.target?.checked)}
                    className="text-sm"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 space-y-2">
          <Button 
            onClick={applyFilters}
            fullWidth
            className="h-10"
          >
            Aplicar filtros
          </Button>
          <Button 
            variant="outline" 
            onClick={clearFilters}
            fullWidth
            className="h-10"
          >
            Limpiar filtros
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;