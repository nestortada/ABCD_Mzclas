import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/ui/AdminSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricsCard from './components/MetricsCard';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import SystemStatus from './components/SystemStatus';
import PendingContent from './components/PendingContent';
import RecentUpdates from './components/RecentUpdates';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    metrics: [],
    activities: [],
    systemHealth: null,
    pendingContent: [],
    recentUpdates: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        metrics: [
          {
            title: "Total Medicamentos",
            value: "2,847",
            change: "+12%",
            changeType: "positive",
            icon: "Pill",
            description: "Entradas activas en el diccionario"
          },
          {
            title: "Revisiones Pendientes",
            value: "23",
            change: "-8%",
            changeType: "positive",
            icon: "Clock",
            description: "Contenido esperando aprobación"
          },
          {
            title: "Actualizaciones Hoy",
            value: "47",
            change: "+15%",
            changeType: "positive",
            icon: "RefreshCw",
            description: "Modificaciones realizadas hoy"
          },
          {
            title: "Usuarios Activos",
            value: "156",
            change: "+3%",
            changeType: "positive",
            icon: "Users",
            description: "Personal clínico conectado"
          }
        ],
        activities: [
          {
            id: 1,
            type: "medication_added",
            user: "Dr. María González",
            action: "agregó el medicamento",
            target: "Amoxicilina 500mg",
            timestamp: new Date(Date.now() - 300000)
          },
          {
            id: 2,
            type: "content_published",
            user: "Admin Sistema",
            action: "publicó actualizaciones de",
            target: "Protocolos de Dilución",
            timestamp: new Date(Date.now() - 600000)
          },
          {
            id: 3,
            type: "medication_updated",
            user: "Dra. Carmen López",
            action: "actualizó la dosificación de",
            target: "Paracetamol Pediátrico",
            timestamp: new Date(Date.now() - 900000)
          },
          {
            id: 4,
            type: "bulk_import",
            user: "Admin Sistema",
            action: "importó 45 nuevos medicamentos",
            target: null,
            timestamp: new Date(Date.now() - 1800000)
          },
          {
            id: 5,
            type: "user_login",
            user: "Dr. Roberto Martín",
            action: "inició sesión en el sistema",
            target: null,
            timestamp: new Date(Date.now() - 2400000)
          }
        ],
        systemHealth: {
          overall: "healthy",
          lastCheck: new Date(),
          services: [
            {
              name: "Base de Datos",
              description: "Firebase Firestore",
              status: "healthy",
              responseTime: 45
            },
            {
              name: "Autenticación",
              description: "Firebase Auth",
              status: "healthy",
              responseTime: 32
            },
            {
              name: "Almacenamiento",
              description: "Firebase Storage",
              status: "healthy",
              responseTime: 67
            },
            {
              name: "API Externa",
              description: "Servicios de medicamentos",
              status: "warning",
              responseTime: 234
            }
          ]
        },
        pendingContent: [
          {
            id: 1,
            title: "Insulina Glargina - Nuevas indicaciones",
            type: "Medicamento",
            author: "Dr. Ana Ruiz",
            priority: "high",
            createdAt: "2025-01-02T10:30:00Z"
          },
          {
            id: 2,
            title: "Protocolo de Sedación Pediátrica",
            type: "Protocolo",
            author: "Dra. Isabel Moreno",
            priority: "medium",
            createdAt: "2025-01-01T15:45:00Z"
          },
          {
            id: 3,
            title: "Incompatibilidades Warfarina",
            type: "Incompatibilidad",
            author: "Dr. Carlos Vega",
            priority: "high",
            createdAt: "2024-12-31T09:20:00Z"
          }
        ],
        recentUpdates: [
          {
            id: 1,
            medicationId: "med_001",
            title: "Omeprazol 40mg",
            description: "Actualizada información de dilución y estabilidad",
            type: "medication",
            updatedBy: "Dra. Patricia Sánchez",
            updatedAt: "2025-01-03T08:15:00Z"
          },
          {
            id: 2,
            medicationId: "med_002",
            title: "Morfina Clorhidrato",
            description: "Nuevas incompatibilidades identificadas",
            type: "incompatibility",
            updatedBy: "Dr. Miguel Torres",
            updatedAt: "2025-01-03T07:30:00Z"
          },
          {
            id: 3,
            medicationId: "med_003",
            title: "Protocolo Reanimación Neonatal",
            description: "Actualización según nuevas guías clínicas",
            type: "protocol",
            updatedBy: "Dra. Elena Jiménez",
            updatedAt: "2025-01-02T16:45:00Z"
          }
        ]
      };
      
      setDashboardData(mockData);
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const handleTestClinicalView = () => {
    navigate('/home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'
      }`}>
        {/* Header */}
        <header className="bg-card border-b border-border clinical-shadow">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Panel de Administración
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gestión integral del diccionario clínico
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleTestClinicalView}
                >
                  <Icon name="Search" size={16} className="mr-2" />
                  Vista Clínica
                </Button>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Calendar" size={16} />
                  <span>{new Date()?.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {dashboardData?.metrics?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                description={metric?.description}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Activity Feed */}
            <div className="xl:col-span-2 space-y-6">
              <ActivityFeed activities={dashboardData?.activities} />
              <QuickActions />
            </div>

            {/* Right Column - Status & Pending */}
            <div className="space-y-6">
              <SystemStatus systemHealth={dashboardData?.systemHealth} />
              <PendingContent pendingItems={dashboardData?.pendingContent} />
            </div>
          </div>

          {/* Recent Updates */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <RecentUpdates recentUpdates={dashboardData?.recentUpdates} />
            
            {/* Additional Stats */}
            <div className="bg-card rounded-lg border border-border clinical-shadow">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Estadísticas de Uso
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Búsquedas hoy
                    </span>
                    <span className="text-lg font-semibold text-foreground">
                      1,247
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Medicamentos más consultados
                    </span>
                    <span className="text-sm font-medium text-primary">
                      Paracetamol
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tiempo promedio de sesión
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      12 min
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Búsquedas por voz
                    </span>
                    <span className="text-sm font-medium text-accent">
                      23%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;