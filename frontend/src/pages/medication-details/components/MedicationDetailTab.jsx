import React from 'react';
import Icon from '../../../components/AppIcon';

const Section = ({ icon, title, children }) => (
  <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
        <Icon name={icon} size={24} className="text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
    </div>
    {children}
  </div>
);

const fieldOrNA = (value) => {
  if (!value || String(value).trim() === '') return 'No especificado';
  return value;
};

const MedicationDetailTab = ({ medication }) => {
  return (
    <div className="space-y-6">
      <Section icon="Activity" title="Dosis">
        <p className="text-2xl font-bold text-primary">
          {medication?.dosage ? `${medication.dosage} ${medication?.dosageUnit || ''}` : 'No especificado'}
        </p>
      </Section>

      <Section icon="AlertTriangle" title="Advertencias">
        <p className="text-base text-foreground">{fieldOrNA(medication?.warnings)}</p>
      </Section>

      <Section icon="Syringe" title="Vía de administración">
        <p className="text-base text-foreground">{fieldOrNA(medication?.administration)}</p>
      </Section>

      <Section icon="Beaker" title="Concentración y dilución">
        <p className="text-base text-foreground">{fieldOrNA(medication?.concentration)}</p>
        {medication?.dilution && (
          <p className="text-base text-foreground mt-2 whitespace-pre-line">{medication.dilution}</p>
        )}
      </Section>

      <Section icon="Clock" title="Tiempo de administración y rango de seguridad">
        <p className="text-base text-foreground">{fieldOrNA(medication?.administrationTime)}</p>
      </Section>

      <Section icon="Timer" title="Estabilidad">
        <p className="text-base text-foreground">{fieldOrNA(medication?.stability)}</p>
      </Section>

      <Section icon="Sun" title="Fotosensibilidad">
        <p className="text-base text-foreground">{fieldOrNA(medication?.lightProtection)}</p>
      </Section>

      <Section icon="GitMerge" title="Compatibilidad en Y">
        {medication?.incompatibilities && medication.incompatibilities.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-base text-foreground">
            {medication.incompatibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-base text-foreground">No especificado</p>
        )}
      </Section>

      <Section icon="FileText" title="Observaciones">
        <p className="text-base text-foreground whitespace-pre-line">{fieldOrNA(medication?.observations)}</p>
      </Section>
    </div>
  );
};

export default MedicationDetailTab;
