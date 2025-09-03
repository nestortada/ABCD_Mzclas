import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ClinicalSearchHeader from '../../components/ui/ClinicalSearchHeader';
import { useNavigation } from '../../components/ui/RoleBasedNavigation';
import MedicationHeader from './components/MedicationHeader';
import SafetyInformation from './components/SafetyInformation';
import DosageConcentration from './components/DosageConcentration';
import WarningsIncompatibilities from './components/WarningsIncompatibilities';
import ClinicalObservations from './components/ClinicalObservations';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import medicationsData from '../../data/sedoanalgesicos.json';



const MedicationDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useNavigation();
  const [medication, setMedication] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const medicationId = searchParams?.get('id') || '1';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const data = medicationsData.find(m => m.id === medicationId);
    if (data) {
      setMedication(data);

      const favorites = JSON.parse(localStorage.getItem('clinicalDict_favorites') || '[]');
      setIsFavorite(favorites.includes(medicationId));

      const recentlyViewed = JSON.parse(localStorage.getItem('clinicalDict_recentlyViewed') || '[]');
      const updated = [medicationId, ...recentlyViewed.filter(id => id !== medicationId)].slice(0, 10);
      localStorage.setItem('clinicalDict_recentlyViewed', JSON.stringify(updated));
    } else {
      navigate('/medication-search');
    }
    setIsLoading(false);
  }, [medicationId, isAuthenticated, navigate]);

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('clinicalDict_favorites') || '[]');
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites?.filter(id => id !== medicationId);
    } else {
      updatedFavorites = [...favorites, medicationId];
    }
    
    localStorage.setItem('clinicalDict_favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    // Analytics or additional sharing logic
    console.log('Medication shared:', medication?.name);
  };

  const handlePrintInfo = () => {
    window.print();
  };

  const handleVoiceSearch = (transcript) => {
    setSearchQuery(transcript);
    navigate('/medication-search', { state: { query: transcript } });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ClinicalSearchHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onVoiceSearch={handleVoiceSearch}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <div className="w-6 h-6 bg-primary rounded-full"></div>
            </div>
            <p className="text-muted-foreground">Cargando información del medicamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="min-h-screen bg-background">
        <ClinicalSearchHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onVoiceSearch={handleVoiceSearch}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="AlertCircle" size={24} className="text-error" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Medicamento no encontrado</h2>
            <p className="text-muted-foreground">No se pudo encontrar la información del medicamento solicitado.</p>
            <Button onClick={() => navigate('/medication-search')}>
              Volver a Búsqueda
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ClinicalSearchHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onVoiceSearch={handleVoiceSearch}
      />

      <div className="max-w-7xl mx-auto">
        <MedicationHeader
          medication={medication}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
          onShare={handleShare}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <SafetyInformation medication={medication} />
            <DosageConcentration medication={medication} />
            <WarningsIncompatibilities medication={medication} />
            <ClinicalObservations medication={medication} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions
              medication={medication}
              onAddToFavorites={handleToggleFavorite}
              onPrintInfo={handlePrintInfo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetails;