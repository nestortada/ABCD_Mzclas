import React from 'react';
import Button from '../../../components/ui/Button';

const SedoTable = ({ medications, onEdit, onDelete }) => {
  if (!medications || medications.length === 0) {
    return <p className="text-center text-muted-foreground">No hay medicamentos registrados</p>;
  }

  return (
    <table className="w-full border border-border text-left">
      <thead>
        <tr className="bg-muted">
          <th className="p-2 border-b border-border">Medicamento</th>
          <th className="p-2 border-b border-border">Presentación</th>
          <th className="p-2 border-b border-border w-32">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {medications.map((med) => (
          <tr key={med.id} className="border-b border-border">
            <td className="p-2">{med.name}</td>
            <td className="p-2">{med.presentation}</td>
            <td className="p-2 space-x-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(med)}>Editar</Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(med.id)}>Eliminar</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SedoTable;
