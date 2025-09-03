import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoiceSearchButton = ({ isActive, onStartVoice, isSupported = true }) => {
  if (!isSupported) {
    return null;
  }

  return (
    <div
      className="fixed left-1/2 transform -translate-x-1/2 z-40"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 2rem)' }}
    >
      <div className="relative">
        {/* Pulse animation rings */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping animation-delay-75"></div>
          </>
        )}

        {/* Main button */}
        <Button
          id="voice-btn"
          variant="default"
          size="icon"
          onClick={onStartVoice}
          className={`w-16 h-16 rounded-full clinical-shadow-lg transition-all duration-300 ${
            isActive
              ? 'bg-error hover:bg-error/90 scale-110' :'bg-primary hover:bg-primary/90 hover:scale-105'
          }`}
        >
          <Icon
            name={isActive ? "MicOff" : "Mic"}
            size={28}
            color="white"
          />
        </Button>
        
        {/* Status indicator */}
        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white ${
          isActive ? 'bg-error animate-pulse' : 'bg-green-500'
        }`}>
          <Icon 
            name={isActive ? "Radio" : "Check"} 
            size={12} 
            color="white" 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
      
      {/* Instruction text */}
      <div className="mt-3 text-center">
        <p className={`text-sm font-medium ${
          isActive ? 'text-error' : 'text-slate-600'
        }`}>
          {isActive ? 'Escuchando...' : 'Toca para buscar por voz'}
        </p>
        {isActive && (
          <p className="text-xs text-slate-500 mt-1">
            Di el nombre del medicamento
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceSearchButton;