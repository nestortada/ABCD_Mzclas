import helmet from 'helmet';
import cors from 'cors';
import { env } from './env.js';

export function applySecurity(app) {
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin === '*' ? true : env.corsOrigin,
      credentials: false,
    })
  );
}
