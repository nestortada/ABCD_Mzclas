import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentSearches = ({ onSearchSelect }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedSearches = localStorage.getItem('clinicalDict_recentSearches');
    const savedFavorites = localStorage.getItem('clinicalDict_favorites');
    
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('clinicalDict_recentSearches');
  };

  const removeSearch = (searchToRemove) => {
    const updated = recentSearches?.filter(search => search !== searchToRemove);
    setRecentSearches(updated);
    localStorage.setItem('clinicalDict_recentSearches', JSON.stringify(updated));
  };

  const quickAccessItems = [
    { id: 'emergency', label: 'Medicamentos de emergencia', icon: 'Zap', color: 'text-red-600' },
    { id: 'pediatric', label: 'Dosis pediátricas', icon: 'Baby', color: 'text-blue-600' },
    { id: 'high-alert', label: 'Medicamentos de alto riesgo', icon: 'AlertTriangle', color: 'text-orange-600' },
    { id: 'interactions', label: 'Interacciones frecuentes', icon: 'Link', color: 'text-purple-600' }
  ];

  if (recentSearches?.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-slate-200 p-6 clinical-shadow">
          <h3 className="font-semibold text-slate-800 mb-4">Acceso rápido</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickAccessItems?.map((item) => (
              <Button
                key={item?.id}
                variant="outline"
                onClick={() => onSearchSelect(item?.label)}
                className="justify-start h-12 text-left"
              >
                <Icon name={item?.icon} size={20} className={`mr-3 ${item?.color}`} />
                <span className="text-slate-700">{item?.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Recent Searches */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 clinical-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Búsquedas recientes</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearRecentSearches}
            className="text-slate-500 hover:text-slate-700"
          >
            <Icon name="Trash2" size={16} className="mr-2" />
            Limpiar
          </Button>
        </div>
        
        <div className="space-y-2">
          {recentSearches?.map((search, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-md group"
            >
              <button
                onClick={() => onSearchSelect(search)}
                className="flex items-center space-x-3 flex-1 text-left"
              >
                <Icon name="Clock" size={16} className="text-slate-400" />
                <span className="text-slate-700 group-hover:text-primary">{search}</span>
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSearch(search)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="X" size={14} className="text-slate-400" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Access */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 clinical-shadow">
        <h3 className="font-semibold text-slate-800 mb-4">Acceso rápido</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickAccessItems?.map((item) => (
            <Button
              key={item?.id}
              variant="outline"
              onClick={() => onSearchSelect(item?.label)}
              className="justify-start h-12 text-left"
            >
              <Icon name={item?.icon} size={20} className={`mr-3 ${item?.color}`} />
              <span className="text-slate-700">{item?.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentSearches;