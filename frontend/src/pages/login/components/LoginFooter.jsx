import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginFooter = ({ currentLanguage }) => {
  const currentYear = new Date()?.getFullYear();
  
  const translations = {
    es: {
      copyright: `© ${currentYear} ClinicalDictionary. Todos los derechos reservados.`,
      compliance: "Cumple con estándares médicos europeos",
      support: "Soporte técnico disponible 24/7",
      version: "Versión 2.1.0"
    },
    en: {
      copyright: `© ${currentYear} ClinicalDictionary. All rights reserved.`,
      compliance: "Complies with European medical standards",
      support: "24/7 technical support available",
      version: "Version 2.1.0"
    }
  };

  const t = translations?.[currentLanguage] || translations?.es;

  return (
    <footer className="mt-12 space-y-6">
      {/* Support Information */}
      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Headphones" size={16} className="text-blue-600" />
            <span className="text-slate-600">{t?.support}</span>
          </div>
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <div className="flex items-center space-x-2">
            <Icon name="Award" size={16} className="text-green-600" />
            <span className="text-slate-600">{t?.compliance}</span>
          </div>
        </div>
      </div>
      {/* Copyright and Version */}
      <div className="text-center space-y-2">
        <p className="text-sm text-slate-600">{t?.copyright}</p>
        <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
          <span>{t?.version}</span>
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <div className="flex items-center space-x-1">
            <Icon name="Globe" size={12} />
            <span>clinicaldict.es</span>
          </div>
        </div>
      </div>
      {/* Emergency Contact */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
          <Icon name="Phone" size={14} className="text-red-600" />
          <span className="text-xs text-red-700 font-medium">
            Emergencias: +34 900 123 456
          </span>
        </div>
      </div>
    </footer>
  );
};

export default LoginFooter;