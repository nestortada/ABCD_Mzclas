import crypto from 'crypto';

export function generateResetToken(bytes = 32) {
  const raw = crypto.randomBytes(bytes).toString('hex');
  return raw;
}
