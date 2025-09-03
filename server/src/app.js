import express from 'express';
import rateLimit from 'express-rate-limit';
import { applySecurity } from './config/security.js';
import authRouter from './routes/auth.js';

const app = express();

applySecurity(app);
app.use(express.json());

// Global sane rate limit
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use('/api/auth', authRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

export default app;
