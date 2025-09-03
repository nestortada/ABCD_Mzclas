import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ClinicalSearchHeader from '../../components/ui/ClinicalSearchHeader';
import { useNavigation } from '../../components/ui/RoleBasedNavigation';
import MedicationHeader from './components/MedicationHeader';
import SafetyInformation from './components/SafetyInformation';
import DosageConcentration from './components/DosageConcentration';
import WarningsIncompatibilities from './components/WarningsIncompatibilities';
import ClinicalObservations from './components/ClinicalObservations';
import RelatedMedications from './components/RelatedMedications';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';



const MedicationDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useNavigation();
  const [medication, setMedication] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const medicationId = searchParams?.get('id') || '1';


  const relatedMedications = [
    {
      id: '2',
      name: 'Lidocaína',
      genericName: 'Clorhidrato de Lidocaína',
      category: 'Antiarrítmico Clase IB',
      relationshipType: 'Alternativa terapéutica',
      similarityScore: 75,
      keyDifferences: 'Menor duración de acción, menos efectos adversos sistémicos',
      isHighAlert: false
    },
    {
      id: '3',
      name: 'Propafenona',
      genericName: 'Clorhidrato de Propafenona',
      category: 'Antiarrítmico Clase IC',
      relationshipType: 'Misma indicación',
      similarityScore: 68,
      keyDifferences: 'Vía oral únicamente, contraindicada en cardiopatía estructural',
      isHighAlert: false
    },
    {
      id: '4',
      name: 'Sotalol',
      genericName: 'Clorhidrato de Sotalol',
      category: 'Antiarrítmico Clase III',
      relationshipType: 'Misma clase farmacológica',
      similarityScore: 82,
      keyDifferences: 'También tiene propiedades beta-bloqueantes',
      isHighAlert: true
    },
    {
      id: '5',
      name: 'Dronedarona',
      genericName: 'Dronedarona',
      category: 'Antiarrítmico Clase III',
      relationshipType: 'Análogo estructural',
      similarityScore: 90,
      keyDifferences: 'Menor toxicidad tiroidea y pulmonar, solo vía oral',
      isHighAlert: false
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    const docRef = doc(db, 'Sedoanalgesicos', medicationId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setMedication(data);

        // Verificar si está en favoritos
        const favorites = JSON.parse(localStorage.getItem('clinicalDict_favorites') || '[]');
        setIsFavorite(favorites.includes(docSnap.id));

        // Actualizar recientemente vistos
        const recentlyViewed = JSON.parse(localStorage.getItem('clinicalDict_recentlyViewed') || '[]');
        const updated = [docSnap.id, ...recentlyViewed.filter(id => id !== docSnap.id)].slice(0, 10);
        localStorage.setItem('clinicalDict_recentlyViewed', JSON.stringify(updated));
      } else {
        navigate('/medication-search');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
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
            <RelatedMedications relatedMedications={relatedMedications} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetails;