import React from 'react';
import { useNavigation } from './RoleBasedNavigation';

const AuthenticationGate = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole, isLoading } = useNavigation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-subtle">
          <div className="w-8 h-8 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            Acceso No Autorizado
          </h1>
          <p className="text-muted-foreground">
            Por favor, inicia sesión para acceder al sistema
          </p>
        </div>
      </div>
    );
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            Acceso Restringido
          </h1>
          <p className="text-muted-foreground">
            No tienes permisos para acceder a esta sección
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthenticationGate;