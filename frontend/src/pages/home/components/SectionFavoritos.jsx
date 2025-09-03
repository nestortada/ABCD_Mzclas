import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const SectionFavoritos = ({ items, onToggle }) => {
  const navigate = useNavigate();
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">Mis favoritos</h2>
      {items.length === 0 ? (
        <p className="text-slate-500">Aún no tienes favoritos · Marca ★ en cualquier fármaco</p>
      ) : (
        <ul>
          {items.map(m => (
            <li key={m.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <button onClick={() => navigate(`/medication-details?id=${m.id}`)} className="text-left">
                <p className="font-medium">{m.nombre}</p>
                <p className="text-sm text-slate-500">{m.unidad} · {m.via}</p>
              </button>
              <button onClick={() => onToggle(m.id)} aria-label="Quitar de favoritos" className="text-warning">
                <Icon name="Star" size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SectionFavoritos;
