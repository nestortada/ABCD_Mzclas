import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/ui/AdminSidebar';
import ContentActions from './components/ContentActions';
import ContentStats from './components/ContentStats';
import ContentTable from './components/ContentTable';
import MedicationEditor from './components/MedicationEditor';
import RecentActivity from './components/RecentActivity';

const ContentManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);

  // Mock data for medications
  const [medications, setMedications] = useState([
    {
      id: 'med_001',
      name: 'Paracetamol',
      genericName: 'Acetaminofén',
      category: 'analgesics',
      status: 'published',
      lastModified: '2025-01-03T10:30:00Z',
      dosage: {
        adult: { min: '500', max: '1000', unit: 'mg' },
        pediatric: { min: '10', max: '15', unit: 'mg/kg' }
      },
      administration: {
        route: 'oral',
        form: 'tablet',
        frequency: 'cada 6-8 horas',
        duration: 'según necesidad'
      },
      concentration: '500 mg/comprimido',
      dilution: {
        instructions: 'No requiere dilución para administración oral',
        stability: 'Estable a temperatura ambiente',
        lightProtection: false
      },
      incompatibilities: ['Alcohol', 'Warfarina en dosis altas'],
      warnings: ['No exceder 4g/día en adultos', 'Precaución en hepatopatía'],
      clinicalObservations: `Analgésico y antipirético de primera línea.\nEfectivo para dolor leve a moderado.\nBien tolerado en la mayoría de pacientes.`
    },
    {
      id: 'med_002',
      name: 'Amoxicilina',
      genericName: 'Amoxicilina',
      category: 'antibiotics',
      status: 'published',
      lastModified: '2025-01-02T15:45:00Z',
      dosage: {
        adult: { min: '250', max: '500', unit: 'mg' },
        pediatric: { min: '20', max: '40', unit: 'mg/kg/día' }
      },
      administration: {
        route: 'oral',
        form: 'capsule',
        frequency: 'cada 8 horas',
        duration: '7-10 días'
      },
      concentration: '250 mg/cápsula',
      dilution: {
        instructions: 'Para suspensión: reconstituir con agua según indicaciones',
        stability: '14 días refrigerado una vez reconstituido',
        lightProtection: false
      },
      incompatibilities: ['Metotrexato', 'Anticoagulantes orales'],
      warnings: ['Verificar alergias a penicilina', 'Completar ciclo antibiótico'],
      clinicalObservations: `Antibiótico betalactámico de amplio espectro.\nEfectivo contra bacterias gram positivas y algunas gram negativas.\nBuena absorción oral.`
    },
    {
      id: 'med_003',
      name: 'Atenolol',
      genericName: 'Atenolol',
      category: 'cardiovascular',
      status: 'draft',
      lastModified: '2025-01-01T09:20:00Z',
      dosage: {
        adult: { min: '25', max: '100', unit: 'mg' },
        pediatric: { min: '0.5', max: '2', unit: 'mg/kg' }
      },
      administration: {
        route: 'oral',
        form: 'tablet',
        frequency: 'una vez al día',
        duration: 'tratamiento crónico'
      },
      concentration: '50 mg/comprimido',
      dilution: {
        instructions: 'No requiere dilución',
        stability: 'Estable a temperatura ambiente',
        lightProtection: false
      },
      incompatibilities: ['Verapamilo IV', 'Diltiazem IV'],
      warnings: ['No suspender bruscamente', 'Monitorear frecuencia cardíaca'],
      clinicalObservations: `Betabloqueador cardioselectivo.\nIndicado en hipertensión y cardiopatía isquémica.\nRequiere ajuste gradual de dosis.`
    },
    {
      id: 'med_004',
      name: 'Salbutamol',
      genericName: 'Salbutamol',
      category: 'respiratory',
      status: 'pending',
      lastModified: '2024-12-30T14:10:00Z',
      dosage: {
        adult: { min: '100', max: '200', unit: 'mcg' },
        pediatric: { min: '100', max: '200', unit: 'mcg' }
      },
      administration: {
        route: 'inhalation',
        form: 'inhaler',
        frequency: 'según necesidad',
        duration: 'tratamiento sintomático'
      },
      concentration: '100 mcg/pulsación',
      dilution: {
        instructions: 'Para nebulización: diluir en solución salina',
        stability: 'Usar inmediatamente después de preparar',
        lightProtection: true
      },
      incompatibilities: ['Betabloqueadores no selectivos'],
      warnings: ['No exceder 8 pulsaciones/día', 'Enjuagar boca después del uso'],
      clinicalObservations: `Broncodilatador de acción rápida.\nEfectivo en crisis asmáticas.\nInicio de acción en 5-15 minutos.`
    },
    {
      id: 'med_005',
      name: 'Metformina',
      genericName: 'Metformina',
      category: 'endocrine',
      status: 'published',
      lastModified: '2024-12-28T11:30:00Z',
      dosage: {
        adult: { min: '500', max: '2000', unit: 'mg' },
        pediatric: { min: '500', max: '2000', unit: 'mg' }
      },
      administration: {
        route: 'oral',
        form: 'tablet',
        frequency: 'con las comidas',
        duration: 'tratamiento crónico'
      },
      concentration: '850 mg/comprimido',
      dilution: {
        instructions: 'No requiere dilución',
        stability: 'Estable a temperatura ambiente',
        lightProtection: false
      },
      incompatibilities: ['Medios de contraste yodados', 'Alcohol'],
      warnings: ['Monitorear función renal', 'Riesgo de acidosis láctica'],
      clinicalObservations: `Antidiabético oral de primera línea.\nMejora sensibilidad a la insulina.\nEfecto cardioprotector demostrado.`
    }
  ]);

  // Mock statistics
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    pending: 0
  });

  // Mock recent activities
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 'act_001',
      medication: 'Paracetamol',
      action: 'Actualizado',
      type: 'updated',
      user: 'Dr. García',
      timestamp: '2025-01-03T10:30:00Z',
      changes: ['dosage', 'warnings']
    },
    {
      id: 'act_002',
      medication: 'Amoxicilina',
      action: 'Publicado',
      type: 'published',
      user: 'Dra. Martínez',
      timestamp: '2025-01-02T15:45:00Z'
    },
    {
      id: 'act_003',
      medication: 'Atenolol',
      action: 'Creado',
      type: 'created',
      user: 'Dr. López',
      timestamp: '2025-01-01T09:20:00Z'
    },
    {
      id: 'act_004',
      medication: 'Ibuprofeno',
      action: 'Archivado',
      type: 'archived',
      user: 'Admin',
      timestamp: '2024-12-31T16:00:00Z'
    }
  ]);

  // Calculate statistics
  useEffect(() => {
    const newStats = {
      total: medications?.length,
      published: medications?.filter(med => med?.status === 'published')?.length,
      draft: medications?.filter(med => med?.status === 'draft')?.length,
      pending: medications?.filter(med => med?.status === 'pending')?.length
    };
    setStats(newStats);
  }, [medications]);

  const handleAddNew = () => {
    setEditingMedication(null);
    setEditorOpen(true);
  };

  const handleEdit = (medication) => {
    setEditingMedication(medication);
    setEditorOpen(true);
  };

  const handleDelete = (medication) => {
    if (window.confirm(`¿Está seguro de eliminar ${medication?.name}?`)) {
      setMedications(prev => prev?.filter(med => med?.id !== medication?.id));
      
      // Add to recent activities
      const newActivity = {
        id: `act_${Date.now()}`,
        medication: medication?.name,
        action: 'Eliminado',
        type: 'deleted',
        user: 'Admin',
        timestamp: new Date()?.toISOString()
      };
      setRecentActivities(prev => [newActivity, ...prev?.slice(0, 9)]);
    }
  };

  const handleDuplicate = (medication) => {
    const duplicated = {
      ...medication,
      id: `med_${Date.now()}`,
      name: `${medication?.name} (Copia)`,
      status: 'draft',
      lastModified: new Date()?.toISOString()
    };
    
    setMedications(prev => [duplicated, ...prev]);
    
    // Add to recent activities
    const newActivity = {
      id: `act_${Date.now()}`,
      medication: duplicated?.name,
      action: 'Duplicado',
      type: 'created',
      user: 'Admin',
      timestamp: new Date()?.toISOString()
    };
    setRecentActivities(prev => [newActivity, ...prev?.slice(0, 9)]);
  };

  const handleToggleStatus = (medication) => {
    const newStatus = medication?.status === 'published' ? 'draft' : 'published';
    
    setMedications(prev => prev?.map(med => 
      med?.id === medication?.id 
        ? { ...med, status: newStatus, lastModified: new Date()?.toISOString() }
        : med
    ));

    // Add to recent activities
    const newActivity = {
      id: `act_${Date.now()}`,
      medication: medication?.name,
      action: newStatus === 'published' ? 'Publicado' : 'Despublicado',
      type: newStatus === 'published' ? 'published' : 'updated',
      user: 'Admin',
      timestamp: new Date()?.toISOString()
    };
    setRecentActivities(prev => [newActivity, ...prev?.slice(0, 9)]);
  };

  const handleBulkAction = (action) => {
    if (selectedItems?.length === 0) return;

    if (action === 'delete') {
      if (window.confirm(`¿Está seguro de eliminar ${selectedItems?.length} medicamentos?`)) {
        setMedications(prev => prev?.filter(med => !selectedItems?.includes(med?.id)));
        setSelectedItems([]);
      }
    } else {
      const statusMap = {
        publish: 'published',
        archive: 'archived'
      };
      
      setMedications(prev => prev?.map(med => 
        selectedItems?.includes(med?.id)
          ? { ...med, status: statusMap?.[action], lastModified: new Date()?.toISOString() }
          : med
      ));
      setSelectedItems([]);
    }
  };

  const handleSaveMedication = (medicationData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (editingMedication) {
        // Update existing
        setMedications(prev => prev?.map(med => 
          med?.id === medicationData?.id ? medicationData : med
        ));
        
        // Add to recent activities
        const newActivity = {
          id: `act_${Date.now()}`,
          medication: medicationData?.name,
          action: 'Actualizado',
          type: 'updated',
          user: 'Admin',
          timestamp: new Date()?.toISOString(),
          changes: ['información general']
        };
        setRecentActivities(prev => [newActivity, ...prev?.slice(0, 9)]);
      } else {
        // Create new
        setMedications(prev => [medicationData, ...prev]);
        
        // Add to recent activities
        const newActivity = {
          id: `act_${Date.now()}`,
          medication: medicationData?.name,
          action: 'Creado',
          type: 'created',
          user: 'Admin',
          timestamp: new Date()?.toISOString()
        };
        setRecentActivities(prev => [newActivity, ...prev?.slice(0, 9)]);
      }
      
      setEditorOpen(false);
      setEditingMedication(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleBulkImport = (file) => {
    setIsLoading(true);
    
    // Simulate file processing
    setTimeout(() => {
      console.log('Importing file:', file?.name);
      // In real implementation, parse CSV/Excel and add medications
      setIsLoading(false);
      alert('Importación completada exitosamente');
    }, 2000);
  };

  const handleExport = () => {
    setIsLoading(true);
    
    // Simulate export
    setTimeout(() => {
      const dataStr = JSON.stringify(medications, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `medicamentos_${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      link?.click();
      URL.revokeObjectURL(url);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'
      }`}>
        <div className="p-4 lg:p-6 space-y-6">
          <ContentActions
            onAddNew={handleAddNew}
            onBulkImport={handleBulkImport}
            onExport={handleExport}
            isLoading={isLoading}
          />

          <ContentStats stats={stats} />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <ContentTable
                medications={medications}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onToggleStatus={handleToggleStatus}
                onBulkAction={handleBulkAction}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
              />
            </div>
            
            <div className="xl:col-span-1">
              <RecentActivity activities={recentActivities} />
            </div>
          </div>
        </div>
      </main>

      <MedicationEditor
        medication={editingMedication}
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingMedication(null);
        }}
        onSave={handleSaveMedication}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ContentManagement;