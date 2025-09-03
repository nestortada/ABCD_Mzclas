import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import SearchBar from '../medication-search/components/SearchBar';
import { useFavorites } from '../../utils/favorites';
import SectionCategorias from './components/SectionCategorias';
import SectionNovedades from './components/SectionNovedades';
import SectionMasBuscados from './components/SectionMasBuscados';
import SectionFavoritos from './components/SectionFavoritos';
import SectionAtajos from './components/SectionAtajos';
import VoiceSearchButton from '../medication-search/components/VoiceSearchButton';
import { getTopSearches } from '../../utils/searchMetrics';

const medications = [
  { id: '1', nombre: 'Midazolam', via: 'Central', unidad: 'mg/kg/h', fotosensible: true, estabilidadHoras: 24, actualizadoEn: '2024-06-10T00:00:00Z' },
  { id: '2', nombre: 'Fentanilo', via: 'Periférica', unidad: 'mcg/kg/h', fotosensible: false, estabilidadHoras: 48, actualizadoEn: '2024-06-08T00:00:00Z' },
  { id: '3', nombre: 'Propofol', via: 'Central', unidad: 'mg/kg/h', fotosensible: true, estabilidadHoras: 12 },
];

const isRecent = (dateStr) => {
  if (!dateStr) return false;
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff <= 7 * 24 * 60 * 60 * 1000;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { favorites, toggleFavorite } = useFavorites();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsVoiceSupported(true);
    }
  }, []);

  const novedades = medications.filter(m => isRecent(m.actualizadoEn)).sort((a,b) => new Date(b.actualizadoEn) - new Date(a.actualizadoEn)).slice(0,10);
  const topBuscados = getTopSearches(8).map(id => medications.find(m => m.id === id)).filter(Boolean);
  const favoritos = favorites.map(id => medications.find(m => m.id === id)).filter(Boolean);

  const handleSearch = (term) => {
    if (term?.trim()) {
      navigate('/medication-search', { state: { query: term } });
    }
  };

  const onStartVoice = () => {
    if (!isVoiceSupported) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.onstart = () => setIsVoiceActive(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(transcript);
    };
    recognition.onerror = () => setIsVoiceActive(false);
    recognition.onend = () => setIsVoiceActive(false);
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* AppBar */}
      <header className="sticky top-0 bg-white border-b border-slate-200 z-50">
        <div className="flex items-center p-4 space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="Syringe" size={24} />
            <span className="font-semibold">SedoAnalgesia</span>
          </div>
          <div className="flex-1">
            <SearchBar
              searchQuery={query}
              onSearchChange={setQuery}
            />
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center" aria-label="Perfil">
            <Icon name="User" size={20} />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-8 pb-32">
        <SectionCategorias />

        <SectionNovedades items={novedades} />

        <SectionMasBuscados items={topBuscados} />

        <SectionFavoritos items={favoritos} onToggle={toggleFavorite} />

        <SectionAtajos />
      </main>

      <VoiceSearchButton isActive={isVoiceActive} onStartVoice={onStartVoice} isSupported={isVoiceSupported} />
    </div>
  );
};

export default HomePage;
