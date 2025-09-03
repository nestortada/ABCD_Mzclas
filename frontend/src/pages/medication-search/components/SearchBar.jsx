import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const SearchBar = ({ searchQuery, onSearchChange }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  const suggestions = [
    "Paracetamol",
    "Ibuprofeno",
    "Amoxicilina",
    "Omeprazol",
    "Atorvastatina",
    "Metformina",
    "Losartán",
    "Simvastatina"
  ];

  useEffect(() => {
    const saved = localStorage.getItem('clinicalDict_recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    onSearchChange(value);
    setShowSuggestions(value?.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
    inputRef?.current?.blur();
    
    // Save to recent searches
    const updated = [suggestion, ...recentSearches?.filter(s => s !== suggestion)]?.slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('clinicalDict_recentSearches', JSON.stringify(updated));
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && searchQuery?.trim()) {
      setShowSuggestions(false);
      inputRef?.current?.blur();
      
      // Save to recent searches
      const updated = [searchQuery, ...recentSearches?.filter(s => s !== searchQuery)]?.slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('clinicalDict_recentSearches', JSON.stringify(updated));
    }
  };

  const filteredSuggestions = suggestions?.filter(suggestion =>
    suggestion?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  )?.slice(0, 5);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder="Buscar sedoanalgésicos, dosis, diluciones…"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(searchQuery?.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-12 pr-4 h-14 text-lg bg-white border-2 border-slate-200 rounded-xl focus:border-primary clinical-shadow"
        />
        <Icon
          name="Search"
          size={24}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
        />
      </div>
      {/* Search Suggestions */}
      {showSuggestions && (filteredSuggestions?.length > 0 || recentSearches?.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg clinical-shadow-lg z-50 max-h-80 overflow-y-auto">
          {filteredSuggestions?.length > 0 && (
            <div className="p-3">
              <h4 className="text-sm font-medium text-slate-600 mb-2">Sugerencias</h4>
              {filteredSuggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-md flex items-center space-x-3"
                >
                  <Icon name="Search" size={16} className="text-slate-400" />
                  <span className="text-slate-700">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
          
          {recentSearches?.length > 0 && (
            <div className="p-3 border-t border-slate-100">
              <h4 className="text-sm font-medium text-slate-600 mb-2">Búsquedas recientes</h4>
              {recentSearches?.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-md flex items-center space-x-3"
                >
                  <Icon name="Clock" size={16} className="text-slate-400" />
                  <span className="text-slate-700">{search}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;