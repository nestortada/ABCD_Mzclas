import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchResults = ({ results, searchQuery, isLoading, hasMedications }) => {
  const navigate = useNavigate();

  const handleMedicationClick = (medication) => {
    navigate(`/medication-details?id=${medication?.id}`);
  };

  const addToFavorites = (medicationId, e) => {
    e?.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('clinicalDict_favorites') || '[]');
    const updated = favorites?.includes(medicationId) 
      ? favorites?.filter(id => id !== medicationId)
      : [...favorites, medicationId];
    localStorage.setItem('clinicalDict_favorites', JSON.stringify(updated));
  };

  const isFavorite = (medicationId) => {
    const favorites = JSON.parse(localStorage.getItem('clinicalDict_favorites') || '[]');
    return favorites?.includes(medicationId);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)]?.map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-slate-200 p-6 clinical-shadow animate-pulse">
              <div className="h-4 bg-slate-200 rounded mb-3"></div>
              <div className="h-3 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 rounded mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-slate-200 rounded w-20"></div>
                <div className="h-8 bg-slate-200 rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!searchQuery) {
    if (!hasMedications) {
      return (
        <div className="w-full max-w-2xl mx-auto text-center py-12">
          <Icon name="FileX" size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No hay medicamentos en la base de datos</h3>
        </div>
      );
    }
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-12">
        <Icon name="Search" size={48} className="text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-600 mb-2">Busca información médica</h3>
        <p className="text-slate-500">Utiliza la barra de búsqueda para comenzar</p>
      </div>
    );
  }

  if (results?.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-12">
        <Icon name="FileX" size={48} className="text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-600 mb-2">
          {hasMedications ? 'No se encontraron resultados' : 'No hay medicamentos en la base de datos'}
        </h3>
        {hasMedications && (
          <>
            <p className="text-slate-500 mb-4">
              {`No hay resultados para "${searchQuery}"`}
            </p>
            <Button variant="outline" onClick={() => window.location?.reload()}>
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Limpiar búsqueda
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Resultados de búsqueda
          </h3>
          <p className="text-sm text-slate-600">
            {results?.length} medicamento{results?.length !== 1 ? 's' : ''} encontrado{results?.length !== 1 ? 's' : ''}
            {searchQuery && ` para "${searchQuery}"`}
          </p>
        </div>
        
        <div className="flex items-center space-x-2"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results?.map((medication) => (
          <div
            key={medication?.id}
            onClick={() => handleMedicationClick(medication)}
            className="bg-white rounded-lg border border-slate-200 p-6 clinical-shadow hover:clinical-shadow-lg transition-all duration-200 cursor-pointer hover:border-primary/30 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 group-hover:text-primary transition-colors">
                  {medication?.name}
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  {medication?.presentation}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => addToFavorites(medication?.id, e)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon 
                  name={isFavorite(medication?.id) ? "Heart" : "Heart"} 
                  size={18} 
                  className={isFavorite(medication?.id) ? 'text-red-500 fill-current' : 'text-slate-400'}
                />
              </Button>
            </div>

            {/* Basic Info */}
            <div className="space-y-2 mb-4">
              <div className="text-sm">
                <span className="text-slate-600">Dosis de seguridad:</span>
                <span className="font-medium text-slate-800"> {medication?.safetyDose}</span>
              </div>
              <div className="text-sm">
                <span className="text-slate-600">Vía:</span>
                <span className="font-medium text-slate-800"> {medication?.administrationRoute}</span>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Icon name="ChevronRight" size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;