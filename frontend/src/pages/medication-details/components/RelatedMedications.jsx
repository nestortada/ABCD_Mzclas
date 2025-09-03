import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RelatedMedications = ({ relatedMedications }) => {
  const navigate = useNavigate();

  const handleMedicationClick = (medicationId) => {
    navigate(`/medication-details?id=${medicationId}`);
  };

  if (!relatedMedications || relatedMedications?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Link" size={24} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Medicamentos Relacionados</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedMedications?.map((medication, index) => (
          <div 
            key={index}
            className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => handleMedicationClick(medication?.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">{medication?.name}</h3>
                <p className="text-sm text-muted-foreground">{medication?.genericName}</p>
              </div>
              <div className="flex items-center space-x-2">
                {medication?.isHighAlert && (
                  <div className="w-2 h-2 bg-error rounded-full"></div>
                )}
                <Icon name="ExternalLink" size={16} className="text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Categoría:</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {medication?.category}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Relación:</span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                  {medication?.relationshipType}
                </span>
              </div>

              {medication?.similarityScore && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Similitud:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${medication?.similarityScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-accent font-medium">{medication?.similarityScore}%</span>
                  </div>
                </div>
              )}
            </div>

            {medication?.keyDifferences && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <Icon name="Info" size={12} className="inline mr-1" />
                  {medication?.keyDifferences}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={() => navigate('/home')}
          className="w-full"
        >
          <Icon name="Search" size={18} className="mr-2" />
          Buscar Más Medicamentos
        </Button>
      </div>
    </div>
  );
};

export default RelatedMedications;