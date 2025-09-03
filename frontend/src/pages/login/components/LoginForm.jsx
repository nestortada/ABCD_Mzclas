import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useNavigation } from '../../../components/ui/RoleBasedNavigation';

const LoginForm = ({ currentLanguage, onLanguageChange }) => {
  const navigate = useNavigate();
  const { login } = useNavigation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'clinico'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Mock credentials for demo
  const mockCredentials = {
    clinico: {
      email: "doctor@hospital.es",
      password: "clinico123"
    },
    admin: {
      email: "admin@clinicaldict.es", 
      password: "admin123"
    }
  };

  const translations = {
    es: {
      title: "Iniciar Sesión",
      subtitle: "Acceso seguro al diccionario clínico",
      email: "Correo Electrónico",
      emailPlaceholder: "Ingrese su correo electrónico",
      password: "Contraseña",
      passwordPlaceholder: "Ingrese su contraseña",
      login: "Iniciar Sesión",
      loggingIn: "Iniciando sesión...",
      forgotPassword: "¿Olvidó su contraseña?",
      clinico: "Personal Clínico",
      admin: "Administrador",
      roleDescription: "Seleccione su tipo de acceso",
      invalidCredentials: "Credenciales incorrectas. Use las credenciales de demostración.",
      fillAllFields: "Por favor complete todos los campos",
      demoCredentials: "Credenciales de Demostración"
    },
    en: {
      title: "Sign In",
      subtitle: "Secure access to clinical dictionary",
      email: "Email Address",
      emailPlaceholder: "Enter your email address",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      login: "Sign In",
      loggingIn: "Signing in...",
      forgotPassword: "Forgot your password?",
      clinico: "Clinical Staff",
      admin: "Administrator",
      roleDescription: "Select your access type",
      invalidCredentials: "Invalid credentials. Please use demo credentials.",
      fillAllFields: "Please fill in all fields",
      demoCredentials: "Demo Credentials"
    }
  };

  const t = translations?.[currentLanguage] || translations?.es;

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate fields
      if (!formData?.email || !formData?.password) {
        throw new Error(t.fillAllFields);
      }

      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check mock credentials
      const expectedCredentials = mockCredentials?.[formData?.role];
      if (formData?.email !== expectedCredentials?.email || 
          formData?.password !== expectedCredentials?.password) {
        throw new Error(t.invalidCredentials);
      }

      // Authenticate user
      login(formData?.role);

      // Navigate based on role
      if (formData?.role === 'clinico') {
        navigate('/medication-search');
      } else {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    const credentials = mockCredentials?.[role];
    setFormData({
      email: credentials?.email,
      password: credentials?.password,
      role: role
    });
    setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 clinical-shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">{t?.title}</h1>
          <p className="text-slate-600 text-sm">{t?.subtitle}</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t?.roleDescription}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={formData?.role === 'clinico' ? 'default' : 'outline'}
              onClick={() => handleRoleChange('clinico')}
              className="h-12 flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              <Icon name="UserCheck" size={18} />
              <span className="text-sm font-medium">{t?.clinico}</span>
            </Button>
            <Button
              type="button"
              variant={formData?.role === 'admin' ? 'default' : 'outline'}
              onClick={() => handleRoleChange('admin')}
              className="h-12 flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              <Icon name="Shield" size={18} />
              <span className="text-sm font-medium">{t?.admin}</span>
            </Button>
          </div>
        </div>

        {/* Email Input */}
        <Input
          label={t?.email}
          type="email"
          name="email"
          value={formData?.email}
          onChange={handleInputChange}
          placeholder={t?.emailPlaceholder}
          required
          disabled={isLoading}
          className="w-full"
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            label={t?.password}
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData?.password}
            onChange={handleInputChange}
            placeholder={t?.passwordPlaceholder}
            required
            disabled={isLoading}
            className="w-full pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-8 h-10 w-10"
            disabled={isLoading}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">{error}</p>
                {error === t?.invalidCredentials && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-red-700 font-medium">{t?.demoCredentials}:</p>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => fillDemoCredentials('clinico')}
                        className="block text-xs text-red-700 hover:text-red-900 underline"
                        disabled={isLoading}
                      >
                        {t?.clinico}: {mockCredentials?.clinico?.email}
                      </button>
                      <button
                        type="button"
                        onClick={() => fillDemoCredentials('admin')}
                        className="block text-xs text-red-700 hover:text-red-900 underline"
                        disabled={isLoading}
                      >
                        {t?.admin}: {mockCredentials?.admin?.email}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          loading={isLoading}
          fullWidth
          className="h-12 text-base font-medium"
          disabled={isLoading}
        >
          {isLoading ? t?.loggingIn : t?.login}
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
            disabled={isLoading}
            onClick={() => navigate('/forgot')}
          >
            {t?.forgotPassword}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
