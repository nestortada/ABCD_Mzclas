import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LanguageToggle = ({ currentLanguage, onLanguageChange }) => {
  const languages = [
    {
      code: 'es',
      name: 'Español',
      flag: '🇪🇸'
    },
    {
      code: 'en',
      name: 'English',
      flag: '🇺🇸'
    }
  ];

  const currentLang = languages?.find(lang => lang?.code === currentLanguage) || languages?.[0];

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'es' ? 'en' : 'es';
    onLanguageChange(nextLang);
  };

  return (
    <div className="absolute top-6 right-6">
      <Button
        variant="ghost"
        onClick={toggleLanguage}
        className="h-10 px-3 bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-200"
      >
        <span className="text-lg mr-2">{currentLang?.flag}</span>
        <span className="text-sm font-medium text-slate-700">{currentLang?.name}</span>
        <Icon name="ChevronDown" size={14} className="ml-1 text-slate-500" />
      </Button>
    </div>
  );
};

export default LanguageToggle;