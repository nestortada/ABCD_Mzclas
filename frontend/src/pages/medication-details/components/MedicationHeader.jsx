import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MedicationHeader = ({ medication, isFavorite, onToggleFavorite, onShare }) => {
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${medication?.name} - Información Clínica`,
          text: `Información detallada sobre ${medication?.name} - ${medication?.genericName}`,
          url: window.location?.href
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard?.writeText(window.location?.href);
        alert('Enlace copiado al portapapeles');
      }
      if (onShare) onShare();
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="bg-card border-b border-border p-4 lg:p-6">
      <div className="flex items-start justify-between mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-2"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Volver a Resultados
        </Button>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            className={isFavorite ? 'text-warning' : 'text-muted-foreground'}
          >
            <Icon name={isFavorite ? "Star" : "Star"} size={20} fill={isFavorite ? "currentColor" : "none"} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            loading={isSharing}
          >
            <Icon name="Share2" size={20} />
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">{medication?.name}</h1>
          <p className="text-lg text-muted-foreground">{medication?.genericName}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full">
            <Icon name="Shield" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">{medication?.category}</span>
          </div>

          <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Actualizado: {medication?.lastUpdated}</span>
          </div>

          {medication?.isHighAlert && (
            <div className="flex items-center space-x-2 bg-error/10 px-3 py-1 rounded-full">
              <Icon name="AlertTriangle" size={16} className="text-error" />
              <span className="text-sm font-medium text-error">Medicamento de Alto Riesgo</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationHeader;