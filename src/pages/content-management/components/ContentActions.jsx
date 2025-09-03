import React, { useRef } from 'react';

import Button from '../../../components/ui/Button';

const ContentActions = ({ onAddNew, onBulkImport, onExport, isLoading }) => {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      onBulkImport(file);
      event.target.value = ''; // Reset input
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Gestión de Contenido</h1>
        <p className="text-muted-foreground">
          Administra medicamentos y protocolos clínicos
        </p>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <Button
          variant="outline"
          onClick={onExport}
          disabled={isLoading}
          iconName="Download"
          iconPosition="left"
        >
          Exportar
        </Button>
        
        <Button
          variant="outline"
          onClick={handleImportClick}
          disabled={isLoading}
          iconName="Upload"
          iconPosition="left"
        >
          Importar CSV
        </Button>
        
        <Button
          variant="default"
          onClick={onAddNew}
          disabled={isLoading}
          iconName="Plus"
          iconPosition="left"
        >
          Nuevo Medicamento
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ContentActions;