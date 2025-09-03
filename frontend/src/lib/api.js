import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export async function requestPasswordReset(email) {
  try {
    const res = await api.post('/api/auth/request-reset', { email });
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.error || 'No se pudo procesar la solicitud.';
    throw new Error(msg);
  }
}

export async function resetPassword({ email, token, newPassword }) {
  const res = await api.post('/api/auth/reset', { email, token, newPassword });
  return res.data;
}

