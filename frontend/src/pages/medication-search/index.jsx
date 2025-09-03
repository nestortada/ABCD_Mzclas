import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ClinicalSearchHeader from '../../components/ui/ClinicalSearchHeader';
import VoiceSearchButton from './components/VoiceSearchButton';
import SearchResults from './components/SearchResults';
import RecentSearches from './components/RecentSearches';
import medicationsData from '../../../FARMACOTECA_REORGANIZADA.json';

const MedicationSearch = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [medications, setMedications] = useState([]);

  // Cargar datos locales de sedoanalgésicos
  useEffect(() => {
    // Transform the data to match the expected format
    const transformedData = medicationsData.Sheet1.map((med, index) => ({
      id: index + 1,
      name: med.Medicamento,
      presentation: med.Presentacion,
      dosage: med["Dosis de seguridad"],
      administration: med["Via / Forma de administracion"],
      concentration: med.Concentracion,
      dilution: med.Dilucion,
      incompatibilities: med.Incompatibilidades,
      observations: med.Observaciones
    }));
    setMedications(transformedData);
  }, []);

  useEffect(() => {
    setIsVoiceSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

    if (location?.state?.query) {
      setSearchQuery(location?.state?.query);
      performSearch(location?.state?.query);
    }
  }, [location?.state]);

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
      setShowRecentSearches(false);
    } else {
      setSearchResults([]);
      setShowRecentSearches(false);
    }
  }, [searchQuery, medications]);


  const performSearch = async (query = '') => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const q = query.toLowerCase();
      
      if (!q) {
        setSearchResults([]);
        return;
      }
      
      const results = medications.filter(med =>
        med.name.toLowerCase().includes(q) ||
        med.presentation.toLowerCase().includes(q) ||
        med.dosage.toLowerCase().includes(q) ||
        med.administration.toLowerCase().includes(q) ||
        med.concentration.toLowerCase().includes(q) ||
        med.dilution.toLowerCase().includes(q) ||
        med.observations.toLowerCase().includes(q)
      );
      
      // Update search results
      setSearchResults(results);
      
      // Save to recent searches
      if (query.trim()) {
        const recentSearches = JSON.parse(localStorage.getItem('clinicalDict_recentSearches') || '[]');
        const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        localStorage.setItem('clinicalDict_recentSearches', JSON.stringify(updatedSearches));
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query?.trim()) {
      setShowRecentSearches(false);
    }
  };

  const handleSearchFocus = () => {
    if (!searchQuery?.trim()) {
      setShowRecentSearches(true);
    }
  };


  const handleVoiceSearch = () => {
    if (!isVoiceSupported) {
      return;
    }

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

    recognition.start();
  };

  const handleHome = () => {
    setSearchQuery('');
    setShowRecentSearches(false);
  };

  const handleSearchSelect = (searchTerm) => {
    setSearchQuery(searchTerm);
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
        {medications.length === 0 && !isLoading && !searchQuery ? (
          <div className="w-full max-w-2xl mx-auto text-center py-12">
            <p className="text-lg font-medium text-slate-600">No hay medicamentos en la base de datos</p>
          </div>
        ) : (
          <>
            {/* Recent Searches / Quick Access - Only show when not searching */}
            {!searchQuery && !showRecentSearches && (
              <RecentSearches onSearchSelect={handleSearchSelect} />
            )}

            {/* Search Results */}
            {searchQuery && (
              <div className="flex gap-6">
                <div className="flex-1">
                  <SearchResults
                    results={searchResults}
                    searchQuery={searchQuery}
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
    </div>
  );
};

export default MedicationSearch;