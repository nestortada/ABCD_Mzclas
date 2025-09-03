import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useNavigation } from '../../components/ui/RoleBasedNavigation';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, userRole } = useNavigation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'clinical'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'clinical') {
        navigate('/home');
      } else {
        navigate('/admin-dashboard');
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simple validation for demo
        if (!formData?.email || !formData?.password) {
          throw new Error('Por favor complete todos los campos');
        }

        if (formData?.password?.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

      // Authenticate user
      login(formData?.role);

      // Navigate based on role
      if (formData?.role === 'clinical') {
        navigate('/home');
      } else {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    {
      role: 'clinical',
        email: 'doctor@hospital.es',
      password: 'clinical123',
        label: 'Demostración personal clínico'
    },
    {
      role: 'admin',
        email: 'admin@clinicaldict.es',
      password: 'admin123',
        label: 'Demostración administrador'
    }
  ];

  const fillDemoCredentials = (credentials) => {
    setFormData({
      email: credentials?.email,
      password: credentials?.password,
      role: credentials?.role
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-sky-200/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary rounded-2xl mb-4">
            <Icon name="Stethoscope" size={32} color="white" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground">ClinicalDictionary</h1>
          <p className="mt-2 text-muted-foreground">
            Acceso seguro a datos de referencia médica
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card p-8 rounded-lg border border-border clinical-shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={formData?.role === 'clinical' ? 'default' : 'outline'}
                onClick={() => setFormData(prev => ({ ...prev, role: 'clinical' }))}
                className="h-12"
              >
                <Icon name="UserCheck" size={18} className="mr-2" />
                Clínico
              </Button>
              <Button
                type="button"
                variant={formData?.role === 'admin' ? 'default' : 'outline'}
                onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                className="h-12"
              >
                <Icon name="Shield" size={18} className="mr-2" />
                Administrador
              </Button>
            </div>

            {/* Email Input */}
            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              value={formData?.email}
              onChange={handleInputChange}
              placeholder="Ingresa tu correo electrónico"
              required
              disabled={isLoading}
            />

            {/* Password Input */}
              <Input
                label="Contraseña"
                type="password"
                name="password"
                value={formData?.password}
                onChange={handleInputChange}
                placeholder="Ingresa tu contraseña"
                required
                disabled={isLoading}
              />

              <div className="text-right">
                <button onClick={() => navigate('/forgot')}
                  type="button"
                  className="text-sm text-primary hover:underline"
                  disabled={isLoading}
                >
                  Olvidé mi contraseña
                </button>
              </div>

            {/* Error Message */}
              {error && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-md">
                  <div className="flex items-center">
                    <Icon name="AlertCircle" size={16} className="text-error mr-2" />
                    <span className="text-sm text-error">{error}</span>
                  </div>
                </div>
              )}

            {/* Submit Button */}
            <Button
              type="submit"
              loading={isLoading}
              fullWidth
              className="h-12"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Credenciales de demostración
            </p>
            <div className="space-y-2">
              {demoCredentials?.map((cred, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => fillDemoCredentials(cred)}
                  className="w-full justify-start text-sm h-10"
                  disabled={isLoading}
                >
                  <Icon 
                    name={cred?.role === 'clinical' ? 'UserCheck' : 'Shield'} 
                    size={16} 
                    className="mr-3" 
                  />
                  <div className="text-left">
                    <div className="font-medium">{cred?.label}</div>
                    <div className="text-xs text-muted-foreground">{cred?.email}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Plataforma segura de referencia médica</p>
            <p className="mt-1">© 2025 ClinicalDictionary. Todos los derechos reservados.</p>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;
