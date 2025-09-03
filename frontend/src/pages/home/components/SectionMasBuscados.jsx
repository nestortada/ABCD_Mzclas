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
      <h2 className="text-lg font-semibold mb-2">Más buscados</h2>
      <div className="flex flex-wrap gap-2">
        {items.map(m => (
          <button key={m.id} onClick={() => navigate(`/medication-details?id=${m.id}`)} className="px-3 py-1.5 bg-slate-100 rounded-full flex items-center space-x-1">
            <Icon name="TrendingUp" size={14} />
            <span className="text-sm">{m.nombre}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default SectionMasBuscados;
