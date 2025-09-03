import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useNavigation } from './RoleBasedNavigation';

const AdminSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useNavigation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navigationItems = [
      {
        id: 'dashboard',
        label: 'Panel',
        icon: 'LayoutDashboard',
        path: '/admin-dashboard',
        description: 'Resumen del sistema y métricas'
      },
      {
        id: 'content',
        label: 'Gestión de Contenido',
        icon: 'FileText',
        path: '/content-management',
        description: 'Administrar base de datos de medicamentos'
      },
      {
        id: 'users',
        label: 'Gestión de Usuarios',
        icon: 'Users',
        path: '/user-management',
        description: 'Gestionar acceso del personal clínico'
      },
      {
        id: 'analytics',
        label: 'Analíticas',
        icon: 'BarChart3',
        path: '/analytics',
        description: 'Métricas de uso y rendimiento'
      },
      {
        id: 'settings',
        label: 'Configuración del Sistema',
        icon: 'Settings',
        path: '/settings',
        description: 'Configurar parámetros del sistema'
      }
    ];

    const quickActions = [
      {
        id: 'add-medication',
        label: 'Agregar Medicamento',
        icon: 'Plus',
        action: () => navigate('/content-management?action=add')
      },
      {
        id: 'bulk-import',
        label: 'Importación Masiva',
        icon: 'Upload',
        action: () => navigate('/content-management?action=import')
      },
      {
        id: 'export-data',
        label: 'Exportar Datos',
        icon: 'Download',
        action: () => navigate('/content-management?action=export')
      }
    ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location?.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="Shield" size={24} color="white" />
          </div>
          {!isCollapsed && (
              <div>
                <h1 className="text-lg font-semibold text-foreground">Panel de Administración</h1>
                <p className="text-xs text-muted-foreground">Diccionario Clínico</p>
              </div>
          )}
        </div>
        
        {/* Desktop collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="hidden lg:flex"
        >
          <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={18} />
        </Button>
        
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden"
        >
          <Icon name="X" size={18} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {navigationItems?.map((item) => (
            <Button
              key={item?.id}
              variant={isActive(item?.path) ? "secondary" : "ghost"}
              onClick={() => handleNavigation(item?.path)}
              className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'} h-12`}
            >
              <Icon name={item?.icon} size={20} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">{item?.label}</div>
                  <div className="text-xs text-muted-foreground">{item?.description}</div>
                </div>
              )}
            </Button>
          ))}
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="pt-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Acciones Rápidas
            </h3>
            <div className="space-y-1">
              {quickActions?.map((action) => (
                <Button
                  key={action?.id}
                  variant="ghost"
                  onClick={action?.action}
                  className="w-full justify-start px-3 h-10 text-sm"
                >
                  <Icon name={action?.icon} size={16} className="mr-3" />
                  {action?.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => navigate('/help')}
            className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'}`}
          >
            <Icon name="HelpCircle" size={18} className={isCollapsed ? '' : 'mr-3'} />
            {!isCollapsed && 'Ayuda y Soporte'}
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full justify-start text-error hover:text-error hover:bg-error/10 ${
              isCollapsed ? 'px-2' : 'px-3'
            }`}
          >
            <Icon name="LogOut" size={18} className={isCollapsed ? '' : 'mr-3'} />
            {!isCollapsed && 'Cerrar sesión'}
          </Button>
        </div>
        
        {!isCollapsed && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Icon name="User" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Usuario Administrador</p>
                <p className="text-xs text-muted-foreground truncate">admin@clinicaldict.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-100 lg:flex-col bg-card border-r border-border clinical-shadow transition-all duration-300 ${
        isCollapsed ? 'lg:w-16' : 'lg:w-80'
      }`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-200 bg-background border border-border clinical-shadow"
      >
        <Icon name="Menu" size={20} />
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-200 flex">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative flex flex-col w-80 max-w-xs bg-card border-r border-border clinical-shadow-lg">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;