import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ClinicalSearchHeader from '../../components/ui/ClinicalSearchHeader';
import CategoryShortcuts from './components/CategoryShortcuts';
import VoiceSearchButton from './components/VoiceSearchButton';
import SearchResults from './components/SearchResults';
import FilterSidebar from './components/FilterSidebar';
import Button from '../../components/ui/Button';

const MedicationSearch = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  // Mock medication data
  const mockMedications = [
    {
      id: 1,
      name: "Paracetamol",
      genericName: "Acetaminofén",
      dosage: "500-1000 mg cada 6-8h",
      route: "Oral/IV",
      category: "analgesic",
      categoryLabel: "Analgésico",
      warnings: ["No exceder 4g/día", "Precaución en hepatopatía"],
      form: "tablet",
      concentration: "500mg/comprimido",
      dilution: "No requiere dilución para vía oral",
      incompatibilities: ["Warfarina en dosis altas"],
      lightProtection: false,
      stability: "24 meses a temperatura ambiente",
      keywords: ["paracetamol", "acetaminofén", "dolor", "fiebre", "analgésico", "administrar", "paciente"]
    },
    {
      id: 2,
      name: "Amoxicilina",
      genericName: "Amoxicilina",
      dosage: "250-500 mg cada 8h",
      route: "Oral",
      category: "antibiotic",
      categoryLabel: "Antibiótico",
      warnings: ["Alergia a penicilinas", "Ajustar en insuficiencia renal"],
      form: "capsule",
      concentration: "500mg/cápsula",
      dilution: "Suspensión: 125mg/5ml",
      incompatibilities: ["Tetraciclinas", "Cloranfenicol"],
      lightProtection: false,
      stability: "36 meses en envase original",
      keywords: ["amoxicilina", "antibiótico", "infección", "bacteria", "penicilina"]
    },
    {
      id: 3,
      name: "Omeprazol",
      genericName: "Omeprazol",
      dosage: "20-40 mg una vez al día",
      route: "Oral/IV",
      category: "gastrointestinal",
      categoryLabel: "Gastrointestinal",
      warnings: ["Riesgo de fractura ósea en uso prolongado"],
      form: "capsule",
      concentration: "20mg/cápsula",
      dilution: "IV: Diluir en 100ml SSF",
      incompatibilities: ["Atazanavir", "Clopidogrel"],
      lightProtection: true,
      stability: "24 meses protegido de la luz",
      keywords: ["omeprazol", "estómago", "acidez", "reflujo", "gastritis"]
    },
    {
      id: 4,
      name: "Atorvastatina",
      genericName: "Atorvastatina cálcica",
      dosage: "10-80 mg una vez al día",
      route: "Oral",
      category: "cardiovascular",
      categoryLabel: "Cardiovascular",
      warnings: ["Monitorear enzimas hepáticas", "Riesgo de miopatía"],
      form: "tablet",
      concentration: "20mg/comprimido",
      dilution: "No aplicable",
      incompatibilities: ["Ciclosporina", "Gemfibrozil"],
      lightProtection: false,
      stability: "24 meses a temperatura ambiente",
      keywords: ["atorvastatina", "colesterol", "cardiovascular", "corazón"]
    },
    {
      id: 5,
      name: "Salbutamol",
      genericName: "Salbutamol sulfato",
      dosage: "100-200 mcg cada 4-6h",
      route: "Inhalación",
      category: "respiratory",
      categoryLabel: "Respiratorio",
      warnings: ["Precaución en cardiopatía", "Puede causar temblor"],
      form: "inhalation",
      concentration: "100mcg/pulsación",
      dilution: "Nebulización: 2.5-5mg en 2-3ml SSF",
      incompatibilities: ["Beta-bloqueadores no selectivos"],
      lightProtection: false,
      stability: "24 meses protegido del calor",
      keywords: ["salbutamol", "asma", "respiratorio", "broncodilatador", "inhalador"]
    },
    {
      id: 6,
      name: "Metformina",
      genericName: "Metformina clorhidrato",
      dosage: "500-1000 mg cada 12h",
      route: "Oral",
      category: "endocrine",
      categoryLabel: "Endocrino",
      warnings: ["Contraindicado en insuficiencia renal", "Riesgo de acidosis láctica"],
      form: "tablet",
      concentration: "850mg/comprimido",
      dilution: "No aplicable",
      incompatibilities: ["Contrastes yodados", "Alcohol"],
      lightProtection: false,
      stability: "36 meses en envase original",
      keywords: ["metformina", "diabetes", "glucosa", "endocrino"]
    }
  ];

  useEffect(() => {
    // Check for voice search support
    setIsVoiceSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    
    // Handle initial search from navigation state
    if (location?.state?.query) {
      setSearchQuery(location?.state?.query);
      performSearch(location?.state?.query);
    }
  }, [location?.state]);

  useEffect(() => {
    if (searchQuery || selectedCategory) {
      performSearch(searchQuery, selectedCategory);
      setShowRecentSearches(false);
    } else {
      setSearchResults([]);
      setShowRecentSearches(false);
    }
  }, [searchQuery, selectedCategory, filters]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 100;
      const y = (e.clientY / window.innerHeight - 0.5) * 100;
      document.documentElement.style.setProperty('--px', x);
      document.documentElement.style.setProperty('--py', y);
    };

    const handleScroll = () => {
      document.documentElement.style.setProperty('--scroll', window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const extractKeywordsFromText = (text) => {
    // Remove common words and extract potential medication keywords
    const commonWords = ['necesito', 'para', 'administrar', 'a', 'mi', 'paciente', 'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'que', 'con', 'por', 'en', 'es', 'y', 'o', 'pero', 'se', 'le', 'me', 'te', 'nos'];
    const words = text?.toLowerCase()?.split(/\s+/)?.filter(word => 
      word?.length > 2 && !commonWords?.includes(word)
    );
    return words;
  };

  const performSearch = async (query = '', category = '') => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let results = mockMedications;
    
    // Enhanced search for voice input with keyword matching
    if (query) {
      const searchKeywords = extractKeywordsFromText(query);
      
      results = results?.filter(med => {
        // Exact name matches (highest priority)
        if (med?.name?.toLowerCase()?.includes(query?.toLowerCase()) ||
            med?.genericName?.toLowerCase()?.includes(query?.toLowerCase()) ||
            med?.categoryLabel?.toLowerCase()?.includes(query?.toLowerCase())) {
          return true;
        }
        
        // Keyword-based matching for voice search
        if (searchKeywords?.length > 0) {
          return searchKeywords?.some(keyword => 
            med?.keywords?.some(medKeyword => 
              medKeyword?.includes(keyword) || keyword?.includes(medKeyword)
            ) ||
            med?.name?.toLowerCase()?.includes(keyword) ||
            med?.genericName?.toLowerCase()?.includes(keyword)
          );
        }
        
        return false;
      });
    }
    
    // Filter by category
    if (category) {
      const categoryMap = {
        'medications': results,
        'protocols': results?.filter(med => med?.category === 'cardiovascular'),
        'dilutions': results?.filter(med => med?.dilution !== 'No aplicable'),
        'incompatibilities': results?.filter(med => med?.incompatibilities?.length > 0)
      };
      results = categoryMap?.[category] || results;
    }
    
    // Apply additional filters
    Object.entries(filters)?.forEach(([filterType, filterValues]) => {
      if (filterValues && filterValues?.length > 0) {
        results = results?.filter(med => {
          switch (filterType) {
            case 'category':
              return filterValues?.includes(med?.category);
            case 'route':
              return filterValues?.some(route => med?.route?.toLowerCase()?.includes(route));
            case 'form':
              return filterValues?.includes(med?.form);
            case 'warnings':
              if (filterValues?.includes('high-alert')) {
                return med?.warnings?.length > 1;
              }
              return true;
            default:
              return true;
          }
        });
      }
    });
    
    setSearchResults(results);
    setIsLoading(false);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setSelectedCategory('');
    if (query?.trim()) {
      setShowRecentSearches(false);
    }
  };

    const handleSearchFocus = () => {
      if (!searchQuery?.trim()) {
        setShowRecentSearches(true);
      }
    };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setShowRecentSearches(false);
  };

  const onStartVoice = () => {
    if (!isVoiceSupported) {
      alert('La búsqueda por voz no está disponible en este navegador');
      return;
    }

    setIsVoiceActive(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';

    recognition.onstart = () => {
      setIsVoiceActive(true);
    };

    recognition.onresult = (event) => {
      const transcript = event?.results?.[0]?.[0]?.transcript;
      setSearchQuery(transcript);
      setSelectedCategory('');
      setShowRecentSearches(false);

      // Save to recent searches
      const recentSearches = JSON.parse(localStorage.getItem('clinicalDict_recentSearches') || '[]');
      const updated = [transcript, ...recentSearches?.filter(s => s !== transcript)]?.slice(0, 5);
      localStorage.setItem('clinicalDict_recentSearches', JSON.stringify(updated));
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event?.error);
      setIsVoiceActive(false);
    };

    recognition.onend = () => {
      setIsVoiceActive(false);
    };

    recognition?.start();
  };

  const handleHome = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setShowRecentSearches(false);
  };

  const handleSearchSelect = (searchTerm) => {
    setSearchQuery(searchTerm);
    setSelectedCategory('');
    setShowRecentSearches(false);
  };

  return (
      <div className="min-h-screen hex-bg">
        <ClinicalSearchHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchFocus={handleSearchFocus}
          showRecentSearches={showRecentSearches}
          onRecentSearchSelect={handleSearchSelect}
          onCloseRecentSearches={() => setShowRecentSearches(false)}
          onHome={handleHome}
        />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {!searchQuery && !selectedCategory && !showRecentSearches && (
          <section className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-white">ClinicalDictionary — Sedoanalgésicos</h1>
            <p className="text-white/80">Guía rápida de sedoanalgésicos</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => {}}>Buscar medicamentos</Button>
              <Button variant="outline" onClick={() => {}}>Abrir calculadoras</Button>
            </div>
          </section>
        )}

        {/* Category Shortcuts */}
        {!searchQuery && !selectedCategory && !showRecentSearches && (
          <CategoryShortcuts
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        )}

        {/* Search Results */}
        {(searchQuery || selectedCategory) && (
          <div className="flex gap-6">
            <div className="flex-1">
              <SearchResults
                results={searchResults}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </main>

      {/* Voice Search Button */}
        <VoiceSearchButton
          isActive={isVoiceActive}
        onStartVoice={onStartVoice}
        isSupported={isVoiceSupported}
      />

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
};

export default MedicationSearch;