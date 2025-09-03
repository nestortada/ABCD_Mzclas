import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { generateResetToken } from '../utils/token.js';
import { sha256Hex } from '../utils/hash.js';
import { mail } from '../config/mail.js';

const router = Router();

// Schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const requestResetSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  email: z.string().email(),
  token: z.string().min(16),
  newPassword: z.string().min(8),
});

// Auth endpoints
router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const { email, password } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) return res.status(200).json({ ok: true }); // do not reveal

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, passwordHash });
  return res.status(201).json({ ok: true });
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ sub: user._id.toString(), email: user.email }, env.jwtSecret, { expiresIn: '1h' });
  return res.json({ accessToken: token });
});

// Rate limit for request-reset: 5 per hour per IP+email
const requestResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.toLowerCase() : '';
    return `${req.ip}|${email}`;
  },
});

router.post('/request-reset', requestResetLimiter, async (req, res) => {
  const parsed = requestResetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(200).json({ ok: true }); // generic

  const { email } = parsed.data;
  const user = await User.findOne({ email });

  if (user) {
    const raw = generateResetToken(32);
    const hash = sha256Hex(raw);
    const exp = new Date(Date.now() + 15 * 60 * 1000);
    user.resetTokenHash = hash;
    user.resetTokenExp = exp;
    await user.save();

    const link = `${env.frontendOrigin.replace(/\/$/, '')}/reset?token=${encodeURIComponent(raw)}&email=${encodeURIComponent(email)}`;
    try {
      await mail.sendPasswordReset(email, link);
    } catch (e) {
      // Do not leak errors; still return generic
      console.error('Mail error:', e);
    }
  }

  // Always generic response
  return res.json({ ok: true });
});

router.post('/reset', async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const { email, token, newPassword } = parsed.data;
  const user = await User.findOne({ email });
  if (!user || !user.resetTokenHash || !user.resetTokenExp) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  if (user.resetTokenExp.getTime() < Date.now()) {
    // Expired
    user.resetTokenHash = null;
    user.resetTokenExp = null;
    await user.save();
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  const incomingHash = sha256Hex(token);
  if (incomingHash !== user.resetTokenHash) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  // Rotate password and invalidate token
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetTokenHash = null;
  user.resetTokenExp = null;
  await user.save();

  try {
    await mail.sendPasswordChanged(email);
  } catch (e) {
    console.error('Mail error:', e);
  }

  return res.json({ ok: true });
});

export default router;
