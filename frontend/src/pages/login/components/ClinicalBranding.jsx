import React from 'react';
import Icon from '../../../components/AppIcon';

const ClinicalBranding = ({ currentLanguage }) => {
  const translations = {
    es: {
      title: "ClinicalDictionary",
      subtitle: "Diccionario Médico Digital",
      description: "Plataforma segura de referencia médica para profesionales de la salud",
      features: [
        "Búsqueda rápida de medicamentos",
        "Protocolos de administración",
        "Información de incompatibilidades",
        "Acceso offline disponible"
      ]
    },
    en: {
      title: "ClinicalDictionary",
      subtitle: "Digital Medical Dictionary",
      description: "Secure medical reference platform for healthcare professionals",
      features: [
        "Quick medication search",
        "Administration protocols", 
        "Incompatibility information",
        "Offline access available"
      ]
    }
  };

  const t = translations?.[currentLanguage] || translations?.es;

  return (
    <div className="text-center space-y-8">
      {/* Logo */}
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl clinical-shadow-lg">
          <Icon name="Stethoscope" size={40} color="white" />
        </div>
      </div>
      {/* Brand Title */}
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold text-slate-900">{t?.title}</h1>
        <p className="text-xl text-blue-600 font-medium">{t?.subtitle}</p>
        <p className="text-slate-600 max-w-md mx-auto leading-relaxed">{t?.description}</p>
      </div>
      {/* Features List */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 max-w-sm mx-auto">
        <div className="space-y-3">
          {t?.features?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                <Icon name="Check" size={14} className="text-green-600" />
              </div>
              <span className="text-sm text-slate-700 font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="flex items-center justify-center space-x-6 opacity-60">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-slate-500" />
          <span className="text-xs text-slate-500 font-medium">Certificado Médico</span>
        </div>
        <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
        <div className="flex items-center space-x-2">
          <Icon name="Lock" size={16} className="text-slate-500" />
          <span className="text-xs text-slate-500 font-medium">Datos Seguros</span>
        </div>
      </div>
    </div>
  );
};

export default ClinicalBranding;