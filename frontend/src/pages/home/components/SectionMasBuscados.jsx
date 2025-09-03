import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const SectionMasBuscados = ({ items }) => {
  const navigate = useNavigate();
  if (items.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-semibold mb-2">Más buscados</h2>
        <p className="text-slate-500">Aún no hay búsquedas suficientes</p>
      </section>
    );
  }
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Más buscados</h2>
      <div className="flex flex-wrap gap-3">
        {items.map(m => (
          <button
            key={m.id}
            onClick={() => navigate(`/medication-details?id=${m.id}`)}
            className="px-4 py-2 bg-white rounded-full clinical-shadow hover:shadow-md flex items-center space-x-2"
          >
            <Icon name="TrendingUp" size={16} className="text-primary" />
            <span className="text-sm font-medium">{m.nombre}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default SectionMasBuscados;
