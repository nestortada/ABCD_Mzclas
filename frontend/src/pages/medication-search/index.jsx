import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ClinicalSearchHeader from '../../components/ui/ClinicalSearchHeader';
import VoiceSearchButton from './components/VoiceSearchButton';
import SearchResults from './components/SearchResults';
import RecentSearches from './components/RecentSearches';
import medicationsData from '../../../FARMACOTECA_REORGANIZADA.json';

// Diccionario de términos médicos y sus variantes
const medicalTerms = {
  // Nombres de medicamentos y sus variantes comunes
  'fentanilo': ['fentalino', 'fentanil', 'fentanyl', 'fentalina'],
  'dexmedetomidina': ['dexmetedomidina', 'dexmed', 'precedex'],
  'midazolam': ['midazolan', 'dormicum'],
  'morfina': ['morfin', 'morfi'],
  'ketamina': ['ketamin', 'ketalar'],
  // Términos de presentación
  'ampolla': ['amp', 'amp', 'ampolla'],
  'bolsa': ['bolsa', 'bag'],
  // Unidades de medida
  'mcg': ['mcg', 'µg', 'microgramos', 'microgramo'],
  'mg': ['mg', 'miligramos', 'miligramo'],
  'ml': ['ml', 'mililitros', 'mililitro'],
  // Vías de administración
  'intravenosa': ['iv', 'intravenosa', 'intravenoso', 'endovenosa'],
  'central': ['central', 'cvc', 'cateter central'],
  'periferico': ['periferico', 'periferica', 'vvp'],
};

// Función para calcular la distancia de Levenshtein (similitud entre palabras)
const levenshteinDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

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
    // Usar los datos directamente del JSON
    setMedications(medicationsData.Sheet1);
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


  const extractKeywords = (text) => {
    // Lista de palabras a ignorar
    const stopWords = new Set([
      'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
      'de', 'del', 'y', 'o', 'para', 'por', 'con', 'sin',
      'sobre', 'entre', 'detrás', 'después', 'antes',
      'durante', 'hacia', 'hasta', 'desde', 'como',
      'pero', 'sino', 'porque', 'pues', 'que', 'si',
      'bien', 'mal', 'así', 'mientras', 'tras',
      'yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas',
      'me', 'te', 'se', 'nos', 'os', 'mi', 'tu', 'su',
      'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
      'necesito', 'quiero', 'busco', 'cantidad', 'dar',
      'porfavor', 'por', 'favor', 'gracias', 'necesito', 'urgente', 'ayuda'
    ]);

    // Limpiar el texto y dividir en palabras
    const words = text
      .toLowerCase()
      .replace(/[¿?.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/);

    // Normalizar términos médicos
    const normalizedWords = words.map(word => {
      // Buscar en el diccionario de términos médicos
      for (const [standardTerm, variants] of Object.entries(medicalTerms)) {
        if (variants.includes(word)) {
          return standardTerm;
        }
      }
      return word;
    });

    // Filtrar palabras vacías y stop words, pero mantener palabras clave médicas
    const filteredWords = normalizedWords.filter(word => {
      // Siempre mantener palabras que son términos médicos o sus variantes
      for (const [_, variants] of Object.entries(medicalTerms)) {
        if (variants.includes(word)) return true;
      }
      // Para otras palabras, aplicar filtros normales
      return word.length > 2 && !stopWords.has(word);
    });

    // Si no hay palabras después del filtrado, mantener al menos los términos médicos
    return filteredWords.length > 0 ? filteredWords : 
           normalizedWords.filter(word => 
             Object.values(medicalTerms).some(variants => variants.includes(word)));
  };

  const performSearch = async (query = '') => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      // Normalizar la consulta
      const searchTerm = query.toLowerCase()
        .replace(/[¿?.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .replace(/buscar|busca|encontrar|encuentra|dame|necesito|quiero|urgente|porfavor|por favor/g, '')
        .trim();

      // Corregir términos comunes mal escritos
      const corrections = {
        'fentalino': 'fentanilo',
        'fentanyl': 'fentanilo',
        'fentalina': 'fentanilo',
        'dexmed': 'dexmedetomidina',
        'midazolan': 'midazolam',
        'ketalar': 'ketamina'
      };

      const keywords = searchTerm.split(/\s+/).map(word => 
        corrections[word] || word
      ).filter(word => word.length > 2);
      
      if (keywords.length === 0) {
        const sortedMeds = [...medications].sort((a, b) => a.name.localeCompare(b.name));
        setSearchResults(sortedMeds);
        return;
      }

      // Buscar y puntuar medicamentos que coincidan con las palabras clave
      const scoredResults = medications.map(med => {
        // Preparar campos del medicamento para búsqueda
        const medFields = {
          name: med.name?.toLowerCase() || '',
          presentation: med.presentation?.toLowerCase() || '',
          dosage: med.dosage?.toLowerCase() || '',
          administration: med.administration?.toLowerCase() || '',
          concentration: med.concentration?.toLowerCase() || '',
          dilution: med.dilution?.toLowerCase() || '',
          observations: med.observations?.toLowerCase() || ''
        };

        let score = 0;
        let matchedKeywords = 0;

        // Evaluar cada palabra clave
        keywords.forEach(keyword => {
          // Mayor peso para coincidencias en el nombre del medicamento
          if (medFields.name.includes(keyword)) {
            score += 10;
            matchedKeywords++;
          }

          // Peso medio para coincidencias en campos importantes
          if (medFields.presentation.includes(keyword) ||
              medFields.dosage.includes(keyword) ||
              medFields.concentration.includes(keyword)) {
            score += 5;
            matchedKeywords++;
          }

          // Peso menor para otros campos
          if (medFields.administration.includes(keyword) ||
              medFields.dilution.includes(keyword) ||
              medFields.observations.includes(keyword)) {
            score += 3;
            matchedKeywords++;
          }

          // Buscar coincidencias parciales si no hubo coincidencias exactas
          if (matchedKeywords === 0) {
            const medText = Object.values(medFields).join(' ');
            const words = medText.split(/\s+/);
            const hasPartialMatch = words.some(word => {
              const distance = levenshteinDistance(word, keyword);
              return distance <= (keyword.length <= 4 ? 1 : 2);
            });
            if (hasPartialMatch) score += 1;
          }
        });

        return {
          ...med,
          score,
          matchCount: matchedKeywords
        };
      }).filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score);

      setSearchResults(scoredResults);

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
      // Limpiar el texto reconocido antes de usarlo
      const cleanedTranscript = transcript
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()¿?]/g, '') // Eliminar puntuación
        .replace(/busca|buscar|encuentra|encontrar|dame|necesito|quiero|por favor|porfavor/gi, '') // Eliminar palabras comunes
        .trim();
      
      setSearchQuery(cleanedTranscript);
      setShowRecentSearches(false);

      // Realizar la búsqueda inmediatamente
      performSearch(cleanedTranscript);

      // Save to recent searches
      const recentSearches = JSON.parse(localStorage.getItem('clinicalDict_recentSearches') || '[]');
      const updated = [cleanedTranscript, ...recentSearches?.filter(s => s !== cleanedTranscript)]?.slice(0, 5);
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