import React, { useState } from 'react';
import AdminSidebar from '../../components/ui/AdminSidebar';
import SedoTable from './components/SedoTable';
import SedoEditor from './components/SedoEditor';
import data from '../../data/sedoanalgesicos.json';
import Button from '../../components/ui/Button';

const ContentManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [medications, setMedications] = useState(data);
  const [editingMedication, setEditingMedication] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const handleAdd = () => {
    setEditingMedication(null);
    setEditorOpen(true);
  };

  const handleEdit = (med) => {
    setEditingMedication(med);
    setEditorOpen(true);
  };

  const handleDelete = (id) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const handleSave = (med) => {
    setMedications(prev => {
      const exists = prev.find(m => m.id === med.id);
      if (exists) {
        return prev.map(m => m.id === med.id ? med : m);
      }
      return [med, ...prev];
    });
    setEditorOpen(false);
    setEditingMedication(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'
      }`}
      >
        <div className="p-4 lg:p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Gestión de Sedoanalgésicos</h1>
            <Button onClick={handleAdd}>Agregar</Button>
          </div>
          <SedoTable medications={medications} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </main>
      <SedoEditor
        isOpen={editorOpen}
        medication={editingMedication}
        onSave={handleSave}
        onClose={() => { setEditorOpen(false); setEditingMedication(null); }}
      />
    </div>
  );
};

export default ContentManagement;
