export function makeEmailJsProvider(opts) {
  const endpoint = 'https://api.emailjs.com/api/v1.0/email/send';

  async function postEmailJs(payload) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: opts.serviceId,
        template_id: opts.templateId,
        user_id: opts.publicKey,
        template_params: payload,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`EmailJS error: ${res.status} ${text}`);
    }
  }

  return {
    async sendPasswordReset(to, resetLink) {
      await postEmailJs({
        to_email: to,
        subject: 'You have requested a password change',
        menssage: 'Click the following link to reset your password. This link is valid for 15 minutes and can only be used once.',
        link: resetLink,
      });
    },
    async sendPasswordChanged(to) {
      await postEmailJs({
        to_email: to,
        subject: 'Your password has been changed',
        menssage: 'Your password was recently changed. If it was not you, please contact support immediately.',
      });
    },
  };
}

