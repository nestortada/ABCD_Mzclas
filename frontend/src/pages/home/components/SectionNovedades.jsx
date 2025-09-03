import React from 'react';
import { useNavigate } from 'react-router-dom';

const SectionNovedades = ({ items }) => {
  const navigate = useNavigate();
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Novedades</h2>
        {items.length > 0 && (
          <span className="text-xs bg-primary text-white rounded-full px-2 py-0.5">{items.length}</span>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-slate-500">Sin novedades por ahora</p>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {items.map(m => (
            <div key={m.id} className="min-w-[160px] p-4 border rounded-lg flex-shrink-0" onClick={() => navigate(`/medication-details?id=${m.id}`)}>
              <h3 className="font-medium mb-2">{m.nombre}</h3>
              <div className="flex flex-wrap gap-1 text-xs">
                <span className="px-2 py-0.5 bg-slate-100 rounded-full">{m.via}</span>
                {m.fotosensible && <span className="px-2 py-0.5 bg-slate-100 rounded-full">Fotosensible</span>}
                {m.estabilidadHoras && <span className="px-2 py-0.5 bg-slate-100 rounded-full">{m.estabilidadHoras} h</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SectionNovedades;
