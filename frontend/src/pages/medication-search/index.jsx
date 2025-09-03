import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import ClinicalSearchHeader from '../../components/ui/ClinicalSearchHeader';
import CategoryShortcuts from './components/CategoryShortcuts';
import VoiceSearchButton from './components/VoiceSearchButton';
import SearchResults from './components/SearchResults';
import FilterSidebar from './components/FilterSidebar';
import RecentSearches from './components/RecentSearches';

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
  const [medications, setMedications] = useState([]); // Lista desde Firebase

  // Escucha cambios en la colección Sedoanalgesicos
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'Sedoanalgesicos'), (snapshot) => {
      const meds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMedications(meds);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
  }, [searchQuery, selectedCategory, filters, medications]);

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
    
    let results = medications;
    
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

  const handleVoiceSearch = () => {
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
        {medications.length === 0 && !isLoading && !searchQuery && !selectedCategory ? (
          <div className="w-full max-w-2xl mx-auto text-center py-12">
            <p className="text-lg font-medium text-slate-600">No hay medicamentos en la base de datos</p>
          </div>
        ) : (
          <>
            {/* Category Shortcuts */}
            {!searchQuery && !selectedCategory && !showRecentSearches && (
              <CategoryShortcuts
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
              />
            )}

            {/* Recent Searches / Quick Access - Only show when not searching */}
            {!searchQuery && !selectedCategory && !showRecentSearches && (
              <RecentSearches onSearchSelect={handleSearchSelect} />
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
                    hasMedications={medications.length > 0}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Voice Search Button */}
        <VoiceSearchButton
          isActive={isVoiceActive}
          onActivate={handleVoiceSearch}
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