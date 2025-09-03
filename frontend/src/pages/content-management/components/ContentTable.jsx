import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ContentTable = ({ 
  medications, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onToggleStatus,
  onBulkAction,
  selectedItems,
  onSelectionChange 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'analgesics', label: 'Analgesics' },
    { value: 'antibiotics', label: 'Antibiotics' },
    { value: 'cardiovascular', label: 'Cardiovascular' },
    { value: 'respiratory', label: 'Respiratory' },
    { value: 'endocrine', label: 'Endocrine' },
    { value: 'neurological', label: 'Neurological' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'archived', label: 'Archived' }
  ];

  const filteredAndSortedMedications = useMemo(() => {
    let filtered = medications?.filter(med => {
      const matchesSearch = med?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                          med?.genericName?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      const matchesCategory = filterCategory === 'all' || med?.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || med?.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];
        
        if (sortConfig?.key === 'lastModified') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [medications, searchQuery, filterCategory, filterStatus, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(filteredAndSortedMedications?.map(med => med?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      onSelectionChange([...selectedItems, id]);
    } else {
      onSelectionChange(selectedItems?.filter(item => item !== id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      draft: { color: 'bg-warning text-warning-foreground', icon: 'Clock' },
      pending: { color: 'bg-secondary text-secondary-foreground', icon: 'AlertCircle' },
      archived: { color: 'bg-muted text-muted-foreground', icon: 'Archive' }
    };

    const config = statusConfig?.[status] || statusConfig?.draft;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      {/* Filters and Search */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Buscar medicamentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              {categories?.map(cat => (
                <option key={cat?.value} value={cat?.value}>{cat?.label}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              {statuses?.map(status => (
                <option key={status?.value} value={status?.value}>{status?.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems?.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedItems?.length} elementos seleccionados
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBulkAction('publish')}
                >
                  <Icon name="CheckCircle" size={16} className="mr-2" />
                  Publicar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBulkAction('archive')}
                >
                  <Icon name="Archive" size={16} className="mr-2" />
                  Archivar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onBulkAction('delete')}
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={selectedItems?.length === filteredAndSortedMedications?.length && filteredAndSortedMedications?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="font-semibold text-foreground hover:bg-transparent"
                >
                  Medicamento
                  <Icon 
                    name={sortConfig?.key === 'name' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="ml-2" 
                  />
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('category')}
                  className="font-semibold text-foreground hover:bg-transparent"
                >
                  Categoría
                  <Icon 
                    name={sortConfig?.key === 'category' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="ml-2" 
                  />
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('status')}
                  className="font-semibold text-foreground hover:bg-transparent"
                >
                  Estado
                  <Icon 
                    name={sortConfig?.key === 'status' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="ml-2" 
                  />
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('lastModified')}
                  className="font-semibold text-foreground hover:bg-transparent"
                >
                  Última Modificación
                  <Icon 
                    name={sortConfig?.key === 'lastModified' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="ml-2" 
                  />
                </Button>
              </th>
              <th className="text-right p-4 font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedMedications?.map((medication) => (
              <tr key={medication?.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-4">
                  <Checkbox
                    checked={selectedItems?.includes(medication?.id)}
                    onChange={(e) => handleSelectItem(medication?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">{medication?.name}</div>
                    {medication?.genericName && (
                      <div className="text-sm text-muted-foreground">{medication?.genericName}</div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground capitalize">{medication?.category}</span>
                </td>
                <td className="p-4">
                  {getStatusBadge(medication?.status)}
                </td>
                <td className="p-4">
                  <div className="text-sm text-muted-foreground">
                    {formatDate(medication?.lastModified)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(medication)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDuplicate(medication)}
                      className="h-8 w-8"
                    >
                      <Icon name="Copy" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleStatus(medication)}
                      className="h-8 w-8"
                    >
                      <Icon name={medication?.status === 'published' ? 'EyeOff' : 'Eye'} size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(medication)}
                      className="h-8 w-8 text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden">
        {filteredAndSortedMedications?.map((medication) => (
          <div key={medication?.id} className="p-4 border-b border-border last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={selectedItems?.includes(medication?.id)}
                  onChange={(e) => handleSelectItem(medication?.id, e?.target?.checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{medication?.name}</h3>
                  {medication?.genericName && (
                    <p className="text-sm text-muted-foreground">{medication?.genericName}</p>
                  )}
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-xs text-muted-foreground capitalize">{medication?.category}</span>
                    {getStatusBadge(medication?.status)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatDate(medication?.lastModified)}
              </span>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(medication)}
                  className="h-10 w-10"
                >
                  <Icon name="Edit" size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDuplicate(medication)}
                  className="h-10 w-10"
                >
                  <Icon name="Copy" size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStatus(medication)}
                  className="h-10 w-10"
                >
                  <Icon name={medication?.status === 'published' ? 'EyeOff' : 'Eye'} size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(medication)}
                  className="h-10 w-10 text-error hover:text-error"
                >
                  <Icon name="Trash2" size={18} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {filteredAndSortedMedications?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron medicamentos</h3>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros o términos de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentTable;