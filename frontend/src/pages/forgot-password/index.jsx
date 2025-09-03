import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { requestPasswordReset } from '../../lib/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await requestPasswordReset(email);
      setStatus('done');
    } catch (e) {
      setStatus('error');
      setError(e?.message || 'Ocurrió un error al enviar la solicitud.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold">Recuperar contraseña</h1>
        {status !== 'done' ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            <Button type="submit" disabled={status === 'loading'} fullWidth>
              {status === 'loading' ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
            </Button>
          </form>
        ) : (
          <div className="space-y-2">
            <p>
              Si el correo existe, recibirás un enlace de restablecimiento.
              Revisa tu bandeja de entrada y spam.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

