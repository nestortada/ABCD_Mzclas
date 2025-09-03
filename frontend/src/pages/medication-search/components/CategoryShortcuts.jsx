import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoryShortcuts = ({ onCategorySelect, selectedCategory }) => {
    const categories = [
      {
        id: 'sedoanalgesics',
        label: 'Sedoanalgésicos',
        icon: 'Syringe',
        description: 'Medicamentos para sedación y analgesia',
        color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
      },
      {
        id: 'protocols',
        label: 'Protocolos',
        icon: 'FileText',
        description: 'Guías de administración',
        color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
      },
      {
        id: 'dilutions',
        label: 'Diluciones',
        icon: 'Beaker',
        description: 'Preparación y dilución',
        color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
      },
      {
        id: 'monitoring',
        label: 'Monitorización',
        icon: 'Activity',
        description: 'Escalas y vigilancia',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
      }
    ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 text-center">
        Acceso rápido por categorías
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories?.map((category) => (
          <Button
            key={category?.id}
            variant="outline"
            onClick={() => onCategorySelect(category?.id)}
            className={`h-24 flex-col space-y-2 border-2 transition-all duration-200 ${
              selectedCategory === category?.id 
                ? 'border-primary bg-primary/5 text-primary' 
                : category?.color
            }`}
          >
            <Icon name={category?.icon} size={28} />
            <div className="text-center">
              <div className="font-medium text-sm">{category?.label}</div>
              <div className="text-xs opacity-75 hidden sm:block">{category?.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryShortcuts;