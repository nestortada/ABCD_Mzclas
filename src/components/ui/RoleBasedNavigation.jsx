import React, { createContext, useContext, useState, useEffect } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved authentication state
    const savedAuth = localStorage.getItem('clinicalDict_auth');
    const savedRole = localStorage.getItem('clinicalDict_role');
    
    if (savedAuth && savedRole) {
      setIsAuthenticated(JSON.parse(savedAuth));
      setUserRole(savedRole);
    }
    
    setIsLoading(false);
  }, []);

  const login = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('clinicalDict_auth', 'true');
    localStorage.setItem('clinicalDict_role', role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('clinicalDict_auth');
    localStorage.removeItem('clinicalDict_role');
  };

  const value = {
    userRole,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

const RoleBasedNavigation = ({ children }) => {
  const { userRole, isAuthenticated, isLoading } = useNavigation();

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
    return children;
  }

  // Render role-specific navigation wrapper
  if (userRole === 'clinical') {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  if (userRole === 'admin') {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  return children;
};

export default RoleBasedNavigation;