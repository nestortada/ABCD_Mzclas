import React from 'react';
import Icon from '../../../components/AppIcon';

const shortcuts = [
  { id: 'midaz', label: 'Midazolam', icon: 'Moon' },
  { id: 'ket', label: 'Ketamina', icon: 'FlaskConical' },
  { id: 'prop', label: 'Propofol', icon: 'Droplet' },
  { id: 'fenta', label: 'Fentanilo', icon: 'Syringe' },
];

const SectionAtajos = () => {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Atajos por tarea</h2>
      <div className="flex flex-wrap gap-3">
        {shortcuts.map(sc => (
          <div key={sc.id} className="px-4 py-2 bg-blue-50 rounded-full flex items-center space-x-2">
            <Icon name={sc.icon} size={16} className="text-primary" />
            <span className="text-sm font-medium">{sc.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionAtajos;
