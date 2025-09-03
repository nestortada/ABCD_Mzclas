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



const MedicationDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useNavigation();
  const [medication, setMedication] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const medicationId = searchParams?.get('id') || '1';

  // Mock medication data
  const mockMedications = {
    '1': {
      id: '1',
      name: 'Amiodarona',
      genericName: 'Clorhidrato de Amiodarona',
      category: 'Antiarrítmico Clase III',
      lastUpdated: '15 Dic 2024',
      isHighAlert: true,
      safeDosage: '5-10 mg/kg en 24 horas (máximo 1200 mg/día)',
      administrationRoute: 'Intravenosa, Oral',
      pharmaceuticalForm: 'Ampolla 150mg/3ml, Comprimidos 200mg',
      administrationTime: '15-30 minutos para infusión IV',
      concentration: '50 mg/ml',
      concentrationUnit: 'mg/ml en ampolla',
      dosageUnits: 'mg/kg/día',
      specialInstructions: 'Administrar en vía central preferentemente. Monitorear función tiroidea y hepática.',
      dilutionInstructions: [
        'Diluir en Dextrosa 5% únicamente (no usar solución salina)',
        'Concentración final: 1-6 mg/ml para infusión continua',
        'Usar filtro de 0.22 micrones durante la administración',
        'No mezclar con otros medicamentos en la misma línea'
      ],
      dilutionStability: 'Estable 24 horas a temperatura ambiente una vez diluida',
      lightProtection: 'Proteger de la luz durante almacenamiento y administración',
      criticalWarnings: [
        'Puede causar toxicidad pulmonar grave (fibrosis pulmonar)',
        'Riesgo de hepatotoxicidad severa',
        'Interacciones graves con warfarina y digoxina',
        'Puede prolongar significativamente el intervalo QT'
      ],
      incompatibilities: [
        {
          drug: 'Heparina Sódica',
          reason: 'Precipitación inmediata en solución'
        },
        {
          drug: 'Furosemida',
          reason: 'Incompatibilidad física en Y'
        },
        {
          drug: 'Insulina',
          reason: 'Adsorción en contenedores plásticos'
        },
        {
          drug: 'Bicarbonato de Sodio',
          reason: 'Precipitación por cambio de pH'
        }
      ],
      adverseReactions: [
        {
          type: 'Toxicidad Pulmonar',
          description: 'Fibrosis pulmonar, neumonitis intersticial',
          severity: 'Alta'
        },
        {
          type: 'Hepatotoxicidad',
          description: 'Elevación de transaminasas, hepatitis',
          severity: 'Alta'
        },
        {
          type: 'Disfunción Tiroidea',
          description: 'Hiper o hipotiroidismo',
          severity: 'Media'
        },
        {
          type: 'Fotosensibilidad',
          description: 'Pigmentación cutánea azul-grisácea',
          severity: 'Baja'
        }
      ],
      contraindications: [
        'Hipersensibilidad conocida a amiodarona o yodo',
        'Bradicardia sinusal severa o bloqueo AV de alto grado',
        'Síndrome del seno enfermo',
        'Embarazo y lactancia',
        'Disfunción tiroidea no controlada'
      ],
      clinicalObservations: [
        {
          title: 'Monitoreo Cardíaco Continuo',
          category: 'Monitoreo',
          priority: 'Alta',
          description: 'Requiere monitoreo electrocardiográfico continuo durante la administración intravenosa. Vigilar especialmente el intervalo QT y la aparición de nuevas arritmias.',
          recommendations: [
            'ECG basal antes del inicio del tratamiento',
            'Monitoreo continuo durante infusión IV',
            'ECG de control cada 24 horas durante tratamiento',
            'Suspender si QTc > 500 ms'
          ],
          monitoringParameters: [
            'Frecuencia cardíaca',
            'Ritmo cardíaco',
            'Intervalo QT/QTc',
            'Presión arterial'
          ],
          lastUpdated: '10 Dic 2024',
          source: 'Guías ESC 2024'
        },
        {
          title: 'Función Hepática y Tiroidea',
          category: 'Laboratorio',
          priority: 'Alta',
          description: 'La amiodarona puede causar hepatotoxicidad y alteraciones tiroideas significativas. Es esencial el monitoreo regular de la función hepática y tiroidea.',
          recommendations: [
            'Función hepática basal y cada 6 meses',
            'Función tiroidea (TSH, T3, T4) basal y cada 6 meses',
            'Suspender si ALT/AST > 3 veces el límite superior normal',
            'Evaluar función tiroidea ante síntomas sugestivos'
          ],
          monitoringParameters: [
            'ALT, AST, Bilirrubina',
            'TSH, T3 libre, T4 libre',
            'Fosfatasa alcalina'
          ],
          lastUpdated: '08 Dic 2024',
          source: 'Consenso SECARDIOLOGÍA'
        },
        {
          title: 'Evaluación Pulmonar',
          category: 'Seguimiento',
          priority: 'Media',
          description: 'La toxicidad pulmonar es una complicación grave pero poco frecuente. Requiere evaluación clínica y radiológica periódica.',
          recommendations: [
            'Radiografía de tórax basal',
            'Evaluación clínica de síntomas respiratorios',
            'Considerar TAC torácico si hay sospecha de toxicidad',
            'Pruebas de función pulmonar en tratamientos prolongados'
          ],
          monitoringParameters: [
            'Disnea, tos seca',
            'Radiografía de tórax',
            'Saturación de oxígeno'
          ],
          lastUpdated: '05 Dic 2024',
          source: 'Guías ATS/ERS'
        }
      ]
    }
  };

  const mockRelatedMedications = [
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

    // Simulate loading medication data
    setIsLoading(true);
    setTimeout(() => {
      const medicationData = mockMedications?.[medicationId];
      if (medicationData) {
        setMedication(medicationData);
        
        // Check if medication is in favorites
        const favorites = JSON.parse(localStorage.getItem('clinicalDict_favorites') || '[]');
        setIsFavorite(favorites?.includes(medicationId));
        
        // Add to recently viewed
        const recentlyViewed = JSON.parse(localStorage.getItem('clinicalDict_recentlyViewed') || '[]');
        const updated = [medicationId, ...recentlyViewed?.filter(id => id !== medicationId)]?.slice(0, 10);
        localStorage.setItem('clinicalDict_recentlyViewed', JSON.stringify(updated));
      }
      setIsLoading(false);
    }, 800);
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
            <RelatedMedications relatedMedications={mockRelatedMedications} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetails;