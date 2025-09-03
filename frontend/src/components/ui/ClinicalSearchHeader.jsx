import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Input from './Input';
import Button from './Button';
import { useNavigation } from './RoleBasedNavigation';

const ClinicalSearchHeader = ({ 
  searchQuery = '', 
  onSearchChange, 
  onSearchFocus,
  onVoiceSearch,
  showRecentSearches,
  onRecentSearchSelect,
  onCloseRecentSearches
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useNavigation();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('clinicalDict_recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, [showRecentSearches]);

  const handleSearch = (query) => {
    if (query?.trim()) {
      // Save to recent searches
      const updated = [query, ...recentSearches?.filter(s => s !== query)]?.slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('clinicalDict_recentSearches', JSON.stringify(updated));
      
      if (onSearchChange) {
        onSearchChange(query);
      }
      
      // Navigate to search results if not already there
      if (location?.pathname !== '/medication-search') {
        navigate('/medication-search', { state: { query } });
      }
    }
  };

  const handleVoiceSearch = () => {
    setIsVoiceActive(true);
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
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
        handleSearch(transcript);
        if (onVoiceSearch) {
          onVoiceSearch(transcript);
        }
      };
      
      recognition.onerror = () => {
        setIsVoiceActive(false);
      };
      
      recognition.onend = () => {
        setIsVoiceActive(false);
      };
      
      recognition?.start();
    } else {
      setIsVoiceActive(false);
      alert('Voice search is not supported in this browser');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/medication-search');
  };

  return (
    <header className="sticky top-0 z-100 bg-background border-b border-border clinical-shadow">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Home Button */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHomeClick}
            className="text-muted-foreground hover:text-primary"
            title="Volver al inicio"
          >
            <Icon name="Home" size={20} />
          </Button>
        </div>

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="Stethoscope" size={24} color="white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold text-foreground">ClinicalDictionary</h1>
            <p className="text-xs text-muted-foreground">Medical Reference</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 lg:mx-8 relative">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search medications, dosages, interactions..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e?.target?.value)}
              onFocus={() => onSearchFocus && onSearchFocus()}
              onKeyPress={(e) => e?.key === 'Enter' && handleSearch(e?.target?.value)}
              className="pl-10 pr-12"
            />
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceSearch}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                isVoiceActive ? 'text-error animate-pulse' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Icon name={isVoiceActive ? "MicOff" : "Mic"} size={18} />
            </Button>
          </div>
          
          {/* Recent Searches Dropdown */}
          {showRecentSearches && recentSearches?.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg clinical-shadow-lg z-50 max-h-80 overflow-y-auto">
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-600">Búsquedas recientes</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCloseRecentSearches}
                    className="w-6 h-6 text-slate-400 hover:text-slate-600"
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
                {recentSearches?.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => onRecentSearchSelect && onRecentSearchSelect(search)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-md flex items-center space-x-3"
                  >
                    <Icon name="Clock" size={16} className="text-slate-400" />
                    <span className="text-slate-700">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => alert('Notifications feature coming soon!')}
            className="text-muted-foreground hover:text-primary relative"
            title="Notificaciones"
          >
            <Icon name="Bell" size={18} />
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border border-white"></div>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-error"
            title="Cerrar sesión"
          >
            <Icon name="LogOut" size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ClinicalSearchHeader;