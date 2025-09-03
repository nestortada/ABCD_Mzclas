import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { resetPassword } from '../../lib/api';

const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const preset = useMemo(() => ({
    token: params.get('token') || '',
    email: params.get('email') || '',
  }), [params]);

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      if (!form.newPassword || !form.confirmPassword) {
        throw new Error('Completa ambos campos');
      }
      if (form.newPassword !== form.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      await resetPassword({ email: preset.email, token: preset.token, newPassword: form.newPassword });
      setStatus('done');
    } catch (e) {
      setStatus('error');
      setError(e?.message || 'No se pudo restablecer la contraseña.');
    }
  };

  if (!preset.email || !preset.token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow p-6 space-y-2">
          <p>Enlace inválido.</p>
          <Link to="/forgot" className="text-blue-600 underline">Volver</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold">Definir nueva contraseña</h1>
        {status !== 'done' ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <Input label="Correo" value={preset.email} disabled />
            <Input label="Token" value={preset.token} disabled />
            <Input
              label="Nueva contraseña"
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              required
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button type="submit" disabled={status === 'loading'} fullWidth>
              {status === 'loading' ? 'Guardando...' : 'Guardar contraseña'}
            </Button>
          </form>
        ) : (
          <div className="space-y-2">
            <p>Tu contraseña fue actualizada.</p>
            <Link to="/login" className="text-blue-600 underline">Ir a iniciar sesión</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
