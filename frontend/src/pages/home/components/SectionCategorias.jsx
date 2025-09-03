import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const categories = [
  { id: 'sed', label: 'Sedoanalgésicos', icon: 'Pill', color: 'bg-blue-50', route: '/medication-search' },
  { id: 'dil', label: 'Diluciones', icon: 'Beaker', color: 'bg-purple-50', route: '/medication-search?filter=diluciones' },
  { id: 'est', label: 'Estabilidad & Luz', icon: 'Sun', color: 'bg-yellow-50', route: '/medication-search?filter=estabilidad' },
];

const SectionCategorias = () => {
  const navigate = useNavigate();
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Acceso por categorías</h2>
      <div className="grid grid-cols-3 gap-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => navigate(cat.route)}
            className={`${cat.color} rounded-xl p-4 flex flex-col items-center justify-center text-center clinical-shadow hover:shadow-md`}
          >
            <Icon name={cat.icon} size={24} className="text-primary mb-2" />
            <span className="text-sm font-medium leading-tight">{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default SectionCategorias;
