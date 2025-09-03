import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtResetSecret: process.env.JWT_RESET_SECRET || 'dev-reset-secret',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  mailProvider: process.env.MAIL_PROVIDER || 'emailjs', // 'emailjs' | 'log'
  emailjs: {
    serviceId: process.env.EMAILJS_SERVICE_ID || '',
    templateId: process.env.EMAILJS_TEMPLATE_ID || '',
    publicKey: process.env.EMAILJS_PUBLIC_KEY || '',
  }
};
