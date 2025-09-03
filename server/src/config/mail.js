import { env } from './env.js';
import { makeEmailJsProvider } from '../mail/emailjsProvider.js';

let provider;

switch (env.mailProvider) {
  case 'emailjs':
    provider = makeEmailJsProvider({
      serviceId: env.emailjs.serviceId,
      templateId: env.emailjs.templateId,
      publicKey: env.emailjs.publicKey,
    });
    break;
  default:
    provider = {
      async sendPasswordReset(to, resetLink) {
        console.log(`[MAIL LOG] To: ${to} | Link: ${resetLink}`);
      },
      async sendPasswordChanged(to) {
        console.log(`[MAIL LOG] Password changed notice to: ${to}`);
      },
    };
}

export const mail = provider;
