import React from "react";
import { 
  BrowserRouter, 
  Routes as RouterRoutes, 
  Route,
  Navigate 
} from "react-router-dom";

// Components
import ErrorBoundary from "components/ErrorBoundary";
import ScrollToTop from "components/ScrollToTop";
import { NavigationProvider } from "components/ui/RoleBasedNavigation";
import AuthenticationGate from "components/ui/AuthenticationGate";

// Pages
import LoginPage from './pages/login';
import AdminDashboard from './pages/admin-dashboard';
import ContentManagement from './pages/content-management';
import MedicationSearch from './pages/medication-search';
import MedicationDetails from './pages/medication-details';
import NotFound from "pages/NotFound";
import ForgotPasswordPage from './pages/forgot-password';
import ResetPasswordPage from './pages/reset-password';

const Routes = () => {
  return (
    <BrowserRouter>
      <NavigationProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/reset" element={<ResetPasswordPage />} />
            
            {/* Protected Admin Routes */}
            <Route
              path="/admin-dashboard" 
              element={
                <AuthenticationGate requiredRole="admin">
                  <AdminDashboard />
                </AuthenticationGate>
              }
            />
            <Route
              path="/content-management" 
              element={
                <AuthenticationGate requiredRole="admin">
                  <ContentManagement />
                </AuthenticationGate>
              }
            />
            
            {/* Protected Clinical Routes */}
            <Route
              path="/medication-search" 
              element={
                <AuthenticationGate requiredRole="clinical">
                  <MedicationSearch />
                </AuthenticationGate>
              }
            />
            <Route
              path="/medication-details/:id" 
              element={
                <AuthenticationGate requiredRole="clinical">
                  <MedicationDetails />
                </AuthenticationGate>
              }
            />
            
            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </NavigationProvider>
    </BrowserRouter>
  );
};

export default Routes;
